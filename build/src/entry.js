/**
 * Created by pansh on 2016-07-31.
 */
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';

// 生成 store
let store = configureStore();

const rootRoute = {
  childRoutes: [{
    path: '/',
    indexRoute: require('./product/page1'),
    component: require('./main'),
    childRoutes: [
      require('./product/page1'),
      require('./product/page2'),
      require('./product/page3'),
    ]
  }]
};

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(hashHistory, store);

render((
  <Provider store={store} key='provider'>
    <Router history={history} routes={rootRoute} />
  </Provider>
  ), document.getElementById('content')
);
