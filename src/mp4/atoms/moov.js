var LeafBox = require('../LeafBox');
var mvhd = require('./mvhd');
var trak = require('./trak');
var mvex = require('./mvex');

export default class moov extends LeafBox {
    constructor(media) {
        super('moov', [
            new mvhd(media),
            ...media.tracks.map(track => new trak(media, track.trackId)),
            new mvex(media)
        ]);
    }
}
