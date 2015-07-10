var Box = require('../Box');

export default class stsz extends Box {
    constructor() {
        super('stsz');
        this.version = 0;
        this.flags = 0;
        this.sampleSize = 0;
    }
    boxLength() {
        return 20;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.sampleSize)
            .writeUint32(0);
    }
}
