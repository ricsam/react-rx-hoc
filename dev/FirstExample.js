import React from 'react';
import { filter } from 'rxjs/operators';
import { withStream } from '../src';

class Component extends React.PureComponent {
  componentDidMount() {
    this.props.stream.next({
      foo: 123,
    });
    this.props.stream.next({
      bar: 123,
    });
  }

  render() {
    return <div>wefwef</div>;
  }
}

const FirstExample = withStream(observable => observable.pipe(
  filter(({ bar }) => bar !== 123),
))(Component);

export default FirstExample;
