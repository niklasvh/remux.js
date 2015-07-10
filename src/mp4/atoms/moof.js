var LeafBox = require('../LeafBox');
var mfhd = require('./mfhd');
var traf = require('./traf');

export default class moof extends LeafBox {
    constructor(media, sequenceNumber) {
        super('moof', [
            new mfhd(media, sequenceNumber),
            ...media.tracks.map(track => new traf(track))
        ]);
    }
}
