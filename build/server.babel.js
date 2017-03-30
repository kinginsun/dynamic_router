var express = require('express');
var app = express();
var sphp = require('sphp');
sphp.cgiEngine = '/usr/local/bin/php-cgi';
sphp.docRoot = '../public';

app.use('/', sphp.express('../public'));
app.use('/', express.static('../public'));
app.listen(process.env.PORT || 3000, function() {
	console.log("Listening on 3000");
});