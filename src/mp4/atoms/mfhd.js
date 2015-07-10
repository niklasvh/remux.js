var Box = require('../Box');

export default class mfhd extends Box {
    constructor(media, sequenceNumber) {
        super('mfhd');
        this.version = 0;
        this.flags = 0;
        this.sequenceNumber = sequenceNumber;
    }
    boxLength() {
        return 16;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.sequenceNumber);
    }
}
