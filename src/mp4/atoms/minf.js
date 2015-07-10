var LeafBox = require('../LeafBox');
var vmhd = require('./vmhd');
var smhd = require('./smhd');
var stbl = require('./stbl');
var dinf = require('./dinf');

export default class minf extends LeafBox {
    constructor(track) {
        super('minf', [
            new stbl(track),
            track.isVideo ? new vmhd() : new smhd(),
            new dinf()
        ]);
    }
}
