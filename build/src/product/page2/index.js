module.exports = {
  path: '/product/page2',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./page2'));
    }, 'page2');
  }
};
