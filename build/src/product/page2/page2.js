import React, { Component } from 'react';
import { connect } from 'react-redux';

class App2 extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
        <div className='uk-text-center'>
          这是page2
        </div>
      </div>
    );
  }
}

function filterProps (state) {
  return state;
}

module.exports = connect(filterProps)(App2);
