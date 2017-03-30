module.exports = {
  path: '/product/page1',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./page1'));
    }, 'page1');
  }
};
