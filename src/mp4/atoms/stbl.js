var LeafBox = require('../LeafBox');
var stsd = require('./stsd');
var stts = require('./stts');
var stsc = require('./stsc');
var stsz = require('./stsz');
var stco = require('./stco');

export default class stbl extends LeafBox {
    constructor(track) {
        super('stbl', [
            new stsd(track),
            new stts(),
            new stsc(),
            new stco(),
            new stsz()
        ]);
    }
}
