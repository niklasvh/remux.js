var mp4 = require('../src/mp4/mp4');
var mp2t = require('../src/mp2t/mp2t');
var fs = require('fs');
var path = require('path');

var toArrayBuffer = (buffer) => new Uint8Array(buffer).buffer;

var chunk = fs.readFileSync(path.resolve(__dirname, '../ts/1280x7200.ts'));
var ts = new mp2t();
ts.readBuffer(toArrayBuffer(chunk));

var container = new mp4();
ts.tracks.forEach(track => container.addTrack(track));

fs.writeFile(path.resolve(__dirname, '../bin/testing.mp4'), new Buffer(container.writeBuffer()), 'binary');
fs.writeFile(path.resolve(__dirname, '../bin/testing2.mp4'), new Buffer(container.writeBuffer()), 'binary');
