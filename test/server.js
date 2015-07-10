var express = require('express');
var path = require('path');
var fs = require('fs');
var connectBrowserify = require('connect-browserify');

var port = process.env.PORT || 8081;
var app = express();

app.get('/js/hls.js', connectBrowserify({
    entry: path.resolve(__dirname, '../src/hls.js'),
    debug: false,
    watch: true
}));

app.use('/hls', express.static(path.resolve(__dirname, '../examples/hls')));

app.get('/', function(req, res) {
    fs.readFile(path.resolve(__dirname, 'example.html'), 'utf-8', function(err, content) {
        res.send(content);
    })
});

app.listen(port, function() {
    console.log('Test server listening on port', port);
});
