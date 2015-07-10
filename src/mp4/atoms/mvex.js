var LeafBox = require('../LeafBox');
var trex = require('./trex');

export default class mvex extends LeafBox {
    constructor(media) {
        super('mvex', media.tracks.map(track => new trex(track)));
    }
}
