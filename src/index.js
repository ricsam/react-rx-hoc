import React from 'react';
import { ReplaySubject } from 'rxjs';
import { scan, filter, map } from 'rxjs/operators';

export const withStream = epic => (Component) => {
  class RxWrapper extends React.PureComponent {
    state = {
      complete: false,
      error: false,
      streamState: {},
    };

    constructor(props) {
      super(props);
      this.subject$ = new ReplaySubject();
      this.stream$ = epic(this.subject$);
    }

    componentDidMount() {
      this.subscription = this.stream$.subscribe({
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
      const observer = {
        next: (...args) => {
          this.subject$.next(...args);
        },
        complete: (...args) => this.subject$.complete(...args),
        error: (...args) => this.subject$.error(...args),
      };
      return (
        <Component
          {...this.props}
          observer={observer}
          observable={this.stream$}
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
    ['streamStatus', 'streamState', 'observer', 'observable'].forEach((key) => {
      delete props[key];
    });
    const streamState = {
      props,
      state,
      streamState: allProps.streamState,
      streamStatus: allProps.streamStatus,
      observer: allProps.observer,
      observable: allProps.observable,
    };

    allProps.observer.next(streamState);
  };
  const orig = {
    componentDidMount: Component.prototype.componentDidMount,
    componentDidUpdate: Component.prototype.componentDidUpdate,
    // getDerivedStateFromProps: Component.getDerivedStateFromProps,
  };

  Component.prototype.componentDidMount = function componentDidMount(...args) {
    const { props, state } = this;
    propagateState(props, state);
    if (typeof orig.componentDidMount === 'function') {
      orig.componentDidMount.apply(this, args);
    }
  };
  Component.prototype.componentDidUpdate = function componentDidUpdate(...args) {
    const { props, state } = this;
    propagateState(props, state);
    if (typeof orig.componentDidUpdate === 'function') {
      orig.componentDidUpdate.apply(this, args);
    }
  };
  /*
  Component.getDerivedStateFromProps = (props, state) => {
    const newState = {
      ...props.streamState,
      ...state,
    };
    let origStateCalculation = {};
    if (typeof orig.getDerivedStateFromProps === 'function') {
      origStateCalculation = orig.getDerivedStateFromProps(props, newState);
    }
    return {
      ...newState,
      ...origStateCalculation,
    };
  };
  */

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
        ([prev, current]) => !shallowEqual(prev.state, current.state)
            || !shallowEqual(prev.props, current.props)
            || !shallowEqual(prev.streamState, current.streamState),
      ),
      map(([, current]) => current),
    ),
  ))(Component);
};
