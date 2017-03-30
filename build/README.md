下载的文件放在web目录/infocus2

进入：infocus2/build

配置文件：
server.babel.js
var express = require('express');
var app = express();
var phpExpress = require('php-express')({
    binPath: 'php'
});

app.set('views', '../public');
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');
app.all(/.+\.php$/, phpExpress.router);

app.use('/', express.static('../public'));

app.listen(process.env.PORT || 3000);

server.js
require('babel-register');
require('./server.babel');

package.json
{
  "name": "xing-coding",
  "version": "1.0.0",
  "description": "inFocus2.0",
  "main": "app.js",
  "dependencies": {
    "babel-core": "^6.7.6",
    "babel-loader": "^6.2.4",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-react": "^6.5.0",
    "babel-preset-react-hmre": "^1.1.1",
    "babel-register": "^6.9.0",
    "concurrently": "^2.1.0",
    "css-loader": "^0.23.1",
    "express": "^4.13.4",
    "extract-text-webpack-plugin": "^1.0.1",
    "file-loader": "^0.8.5",
    "html-webpack-plugin": "^2.15.0",
    "jsx-loader": "^0.13.2",
    "npm-install-webpack-plugin": "^3.0.0",
    "path": "^0.12.7",
    "php-express": "0.0.3",
    "react": "^15.0.1",
    "react-dom": "^15.0.1",
    "style-loader": "^0.13.1",
    "url-loader": "^0.5.7",
    "webpack": "^1.13.0",
    "zeptojs": "^1.1.4"
  },
  "devDependencies": {},
  "scripts": {
    "build": "webpack --progress --colors --watch",
    "webpack-watch": "webpack -w",
    "express-server": "node ./server",
    "dev": "concurrently --kill-others \"npm run webpack-watch\" \"npm run express-server\"",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "xing",
  "repository": "github",
  "license": "ISC"
}

# 运行内置服务器
>> npm install
>> node ./server
>> npm run dev

实时编译修改的文件
$ npm run build