var Box = require('../Box');
var avc1 = require('./compressions/avc1');
var mp4a = require('./mp4a');

export default class stsd extends Box {
    constructor(track) {
        super('stsd');
        this.entries = track.isVideo ? [new avc1(track)] : [new mp4a(track)];
        this.version = 0;
        this.flags = 0;
    }
    boxLength() {
        return 16 + this.entries.reduce((len, atom) => len + atom.boxLength(), 0);
    }
    write() {
        var data = super.write();
        data.writeUint8(this.version);
        data.writeUint24(this.flags);
        data.writeUint32(this.entries.length);
        data.writeUint16(0);
        this.entries.reduce((position, atom) => {
            data.view.set(atom.write().view, position);
            return position + atom.boxLength();
        }, 16);
        return data;
    }
}
