var Box = require('../../Box');
var avcC = require('./avcC');

export default class avc1 extends Box {
    constructor(track) {
        super('avc1');
        this.extension = new avcC(track);
        this.version = 0;
        this.revision = 0;
        this.referenceIndex = 1;
        this.compressorName = 'JavaScript';
        this.frameCount = 1;
        this.width = track.width;
        this.height = track.height;
    }
    boxLength() {
        return 86 + this.extension.boxLength();
    }
    write() {
        var data = super.write();
        var reserved = 0;
        data.writeUint32(reserved);
        data.writeUint16(reserved);
        data.writeUint16(this.referenceIndex);
        data.writeUint16(this.version);
        data.writeUint16(this.revision);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint16(this.width);
        data.writeUint16(this.height);
        data.writeUint32(0x00480000);
        data.writeUint32(0x00480000);
        data.writeUint32(0);
        data.writeUint16(this.frameCount);
        data.writeUint8(this.compressorName.length);
        data.writeAscii(this.compressorName);

        data.writeUint32(0);
        data.writeUint16(0);
        data.writeUint16(0);
        data.position = 86;
        data.view.set(this.extension.write().view, data.position);
        return data;
    }
}
