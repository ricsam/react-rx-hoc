import React from 'react';
import { ReplaySubject } from 'rxjs';
import { scan, filter, map } from 'rxjs/operators';

export const withStream = epic => (Component) => {
  const subject$ = new ReplaySubject();
  const stream$ = epic(subject$);
  class RxWrapper extends React.PureComponent {
    state = {
      complete: false,
      error: false,
      streamState: {},
    };

    componentDidMount() {
      this.subscription = stream$.subscribe({
        error: (error) => {
          this.setState({
            error,
          });
        },
        complete: () => {
          this.setState({
            complete: true,
          });
        },
        next: (state) => {
          this.setState(({ streamState }) => ({
            streamState: {
              ...streamState,
              ...state,
            },
          }));
        },
      });
    }

    componentWillUnmount() {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }

    render() {
      const { streamState, error, complete } = this.state;
      let status = 'running';
      if (error) {
        status = error;
      } else if (complete) {
        status = 'complete';
      }
      const stream = {
        next: (...args) => {
          subject$.next(...args);
        },
        complete: (...args) => subject$.complete(...args),
        error: (...args) => subject$.error(...args),
      };
      return (
        <Component
          {...this.props}
          stream={stream}
          streamState={streamState}
          streamStatus={status}
        />
      );
    }
  }
  return RxWrapper;
};

const shallowEqual = (objA, objB) => {
  if (objA === objB) {
    return true;
  }

  if (objA == null || objB == null) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);
  const len = aKeys.length;

  if (bKeys.length !== len) {
    return false;
  }

  for (let i = 0; i < len; i += 1) {
    const key = aKeys[i];

    if (objA[key] !== objB[key]) {
      return false;
    }
  }

  return true;
};

export const withLifeCycleStream = epic => (Component) => {
  const propagateState = (allProps, state) => {
    const props = {
      ...allProps,
    };
    ['streamStatus', 'streamState', 'stream'].forEach((key) => {
      delete props[key];
    });
    const streamState = {
      props,
      state,
    };

    allProps.stream.next(streamState);
  };
  class LifeCycleWrapper extends Component {
    constructor(props) {
      super(props);
      propagateState(props, this.state);
    }

    componentDidMount() {
      const { props, state } = this;
      propagateState(props, state);
      if (typeof super.componentDidMount === 'function') {
        super.componentDidMount();
      }
    }

    componentDidUpdate() {
      const { props, state } = this;
      propagateState(props, state);
      if (typeof super.componentDidUpdate === 'function') {
        super.componentDidUpdate();
      }
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  return withStream(observable => epic(
    observable.pipe(
      scan((acc, curr) => [acc[1], curr], [
        {
          props: {},
          state: null,
        },
        {
          props: {},
          state: null,
        },
      ]),
      filter(
        ([prev, current]) => !shallowEqual(prev.state, current.state) || !shallowEqual(prev.props, current.props),
      ),
      map(([, current]) => current),
    ),
  ))(LifeCycleWrapper);
};
