import React from 'react';
import ReactDOM from 'react-dom';
import FirstExample from './FirstExample';
import SecondExample from './SecondExample';

const App = () => (
  <>
    <FirstExample />
    <SecondExample />
  </>
);

window.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<App />, document.getElementById('root'));
});
