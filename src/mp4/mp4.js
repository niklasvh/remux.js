var Container = require('../Container');
var ftyp = require('./atoms/ftyp');
var moov = require('./atoms/moov');
var moof = require('./atoms/moof');
var mdat = require('./atoms/mdat');

export default class mp4 extends Container {
    constructor() {
        super();
        this.majorBrand = 'iso6';
        this.minorBrands = ['isom', 'iso6', 'msdh'];
        this.creationTime = new Date();
        this.modificationTime = new Date();
        this.timeScale = 90000;
        this.minorVersion = 1;
        this.duration = 0;
        this.transformMatrix = [
            1.0, 0,   0,
            0,   1.0, 0,
            0,   0,   1.0
        ];
    }

    writeBuffer() {
        var moofBox = new moof(this, 1);

        var boxes = [
            new ftyp(this),
            new moov(this),
            moofBox,
            new mdat(this)
        ];

        var trunBoxes = moofBox.getBoxes('trun');
        this.tracks.reduce((length, track, index) => {
            trunBoxes[index].dataOffset = length;
            return length + track.data.byteLength;
        },  moofBox.boxLength() + 8);


        var length = boxes.reduce((len, atom) => len + atom.boxLength(), 0);
        var buffer = new ArrayBuffer(length);
        var view = new Uint8Array(buffer);
        boxes.reduce((position, atom) => {
            var data = atom.write();
            view.set(data.view, position);
            return position + data.view.byteLength;
        }, 0);
        return view;
    }
}
