import React from 'react';
import ReactDOM from 'react-dom';
import { map, tap, filter } from 'rxjs/operators';
import { withStream } from '../src';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.stream.next({
      wef: 123,
    });
    this.props.stream.next({
      lol: 123,
    });
    this.props.stream.next({
      omg: 123,
    });
  }

  render() {
    return <div>wefwef</div>;
  }
}

const FirstExample = withStream(observable => observable.pipe(
  filter(({ omg }) => omg !== 123),
))(Component);

export default FirstExample;
