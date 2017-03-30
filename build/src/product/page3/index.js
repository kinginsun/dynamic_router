module.exports = {
  path: '/product/page3',

  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      cb(null, require('./page3'));
    }, 'page3');
  }
};
