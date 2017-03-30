import React, { Component } from 'react';
import { connect } from 'react-redux';
import Footer from './components/footer';

/**
 * app 入口类:  在此页面放入整个网站共同拥有的 components, 底部导航栏、顶部关注二维码
 */

class Main extends Component {
  constructor (props) {
    super(props);
    this.state = {
      authorized: false
    };
  }

  componentWillMount () {
  }

  componentDidMount () {

  }

  render () {
    return (
      <div>
        <div style={{marginBottom: '4.5rem'}}>
          {this.props.children}
        </div>
        <Footer pathName={this.props.location.pathname} />
      </div>
    );
  }
}

// 基于全局 state ，哪些是我们想注入的 props ?
// 注意：使用 https://github.com/reactjs/reselect 效果更佳。
function filterProps (state) {
  return state;
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
module.exports = connect(filterProps)(Main);
