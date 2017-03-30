import React, { Component } from 'react';
import { Link } from 'react-router';
class Footer extends Component {

  constructor (props) {
    super(props);
    this.state = {
      active: this.path2index(props.pathName)
    };
  }

  componentWillMount () {}

  componentDidMount () {}

  componentWillReceiveProps (props) {
    if (this.props.pathName !== props.pathName) {
      this.setState({active: this.path2index(props.pathName)});
    }
  }

  path2index (pathName) {
    let activeNum = 0;
    if (pathName === '/' || pathName === '/product/page1') {
      activeNum = 0;
    } else if (pathName === '/product/page2') {
      activeNum = 1;
    } else if (pathName === '/product/page3') {
      activeNum = 4;
    }
    return activeNum;
  }

  switchTab (id) {
    this.setState({active: id});
  }

  render () {
    return (
      <div className='uk-grid uk-position-bottom zb-menu'>
        <div className='uk-width-1-3 uk-text-center'>
          <Link to='/product/page1' className={'zb-menu-link' + (this.state.active === 0 ? ' zb-menu-active' : '')} onClick={this.switchTab.bind(this, 0)}>
          
          <div className='zb-menu-text uk-width-1-1'>
            Page1
          </div>
          </Link>
        </div>
        <div className='uk-width-1-3 uk-text-center'>
          <Link to='/product/page2' className={'zb-menu-link' + (this.state.active === 1 ? ' zb-menu-active' : '')} onClick={this.switchTab.bind(this, 1)}>
          
          <div className='zb-menu-text uk-width-1-1'>
            Page2
          </div>
          </Link>
        </div>
        <div className='uk-width-1-3 uk-text-center'>
          <Link to='/product/page3' className={'zb-menu-link' + (this.state.active === 4 ? ' zb-menu-active' : '')} onClick={this.switchTab.bind(this, 4)}>
          
          <div className='zb-menu-text uk-width-1-1'>
            Page3
          </div>
          </Link>
        </div>
      </div>
    );
  }

}

module.exports = Footer;
