import React from 'react';
import ReactDOM from 'react-dom';
import { tap, filter } from 'rxjs/operators';
// import { withLifeCycleStream } from '../src';
import { withLifeCycleStream } from '../release';

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
    return <div>wefwef123</div>;
  }
}

const SecondExample = withLifeCycleStream(observable => observable.pipe(
  filter(({ omg }) => false),
))(Component);

export default SecondExample;
