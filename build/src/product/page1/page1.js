import React, { Component } from 'react';
import { connect } from 'react-redux';

class Agent extends Component {

  constructor (props) {
    super(props);
  }

  componentDidMount () {
  }

  render () {
    return (
      <div>
        <div className='uk-text-center zb-title'>
          这是page1
        </div>
      </div>
    );
  }
}

function filterProps (state) { return state; }

module.exports = connect(filterProps)(Agent);
