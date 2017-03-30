var path = require('path');
var webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ROOT = path.join(__dirname, '/../');
var outJSPATH = path.join(ROOT, '/public/assets/js/');
var tplPATH = path.join(ROOT, '/build/src/tpl/');
var htmlPATH = path.join(ROOT, '/public/');

var commonsPlugin =
new webpack.optimize.CommonsChunkPlugin({
  names: [
    'common'
  ],
  filename: 'common_bundle.js?[chunkhash]'
});

module.exports = {
  output: {
    path: outJSPATH,
    filename: '[name]_bundle.js?[chunkhash]',
    chunkFilename: '[name].chunk.js?[chunkhash]',
    publicPath: '/assets/js/'
  },

  entry: {
    main: ['./src/entry.js'],
    common: ['./src/common/utils.jsx']
  },

  plugins: [
    // new WebpackMd5Hash(),
    commonsPlugin,
    new HtmlWebpackPlugin({
      title: '快查数据，用信狐药迅！',
      chunks: ['common', 'main'],
      filename: htmlPATH + 'index.html',
      template: tplPATH + 'tpl.html',
      inject: 'content'
    }),
    new webpack.ProvidePlugin({
      React: 'react',
      ReactDOM: 'react-dom',
      $: 'jquery'
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      minimize: true,
      compress: {
        drop_debugger: true,
        warnings: false,
        drop_console: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: 'jsx-loader?harmony',
        exclude: /node_modules/
      }, {
        test: /\.js$/,
        loader: 'babel',
        query: {
          plugins: ['transform-runtime'],
          presets: ['es2015', 'stage-0', 'react']
        },
        exclude: /node_modules/
      }, { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  },

  resolve: {
    extensions: ['', '.js', '.css', '.png', '.jpeg', '.jpg', '.jsx']
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'jquery': '$',
    'chart.js': 'Chart',
    'redux': 'Redux',
    'react-redux': 'ReactRedux',
    'react-router-redux': 'ReactRouterRedux',
    'react-router': 'ReactRouter',
    'redux-trunk': 'ReduxThunk'
  }
};
