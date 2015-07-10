var LeafBox = require('../LeafBox');
var tfhd = require('./tfhd');
var trun = require('./trun');
var tfdt = require('./tfdt');

export default class traf extends LeafBox {
    constructor(track) {
        super('traf', [
            new tfhd(track),
            new tfdt(track),
            new trun(track)
        ]);
    }
}
