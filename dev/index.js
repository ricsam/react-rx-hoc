import React from 'react';
import ReactDOM from 'react-dom';
import { map, tap, filter } from 'rxjs/operators';
import { withRx } from '../src';
import FirstExample from './FirstExample';
import SecondExample from './SecondExample';

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
    console.log(this.props);
    return <div>wefwef</div>;
  }
}

const App = () => (
  <>
    <FirstExample />
    <SecondExample />
  </>
);

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
