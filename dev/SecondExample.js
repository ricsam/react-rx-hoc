import React from 'react';
import ReactDOM from 'react-dom';
import { map, tap, filter } from 'rxjs/operators';
import { withLifeCycleStream } from '../src';

class Component extends React.PureComponent {
  state = {
    test: 321,
  };

  componentDidMount() {
    this.setState(
      {
        test: 123,
      },
    );
  }

  render() {
    console.log(this.state, this.props);
    return <div>wefwef</div>;
  }
}

const SecondExample = withLifeCycleStream(observable => observable.pipe(
  tap((props) => {
    // console.log(props);
  }),
  filter(({ omg }) => omg !== 123),
))(Component);

export default SecondExample;
