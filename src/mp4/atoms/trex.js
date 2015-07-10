var Box = require('../Box');

export default class trex extends Box {
    constructor(track) {
        super('trex');
        this.version = 0;
        this.flags = 0;
        this.trackId = track.trackId;
        this.sampleDescriptionIndex = 1;
    }
    boxLength() {
        return 32;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.trackId)
            .writeUint32(this.sampleDescriptionIndex)
            .writeUint32(0)
            .writeUint32(0)
            .writeUint32(0);
    }
}
