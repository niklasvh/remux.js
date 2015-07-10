var LeafBox = require('../LeafBox');
var mdhd = require('./mdhd');
var hdlr = require('./hdlr');
var minf = require('./minf');

export default class mdia extends LeafBox {
    constructor(track) {
        super('mdia', [
            new mdhd(track),
            new hdlr(track),
            new minf(track)
        ]);
    }
}
