var LeafBox = require('../LeafBox');
var tkhd = require('./tkhd');
var mdia = require('./mdia');

export default class trak extends LeafBox {
    constructor(media, trackId) {
        super('trak', [
            new tkhd(media, media.tracks[trackId - 1]),
            new mdia(media.tracks[trackId - 1])
        ]);
    }
}
