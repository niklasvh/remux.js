var assert = require('assert');

export default class ElementaryStreamDescription {
    constructor() {
        this.type = null;
        this.streamType = null;
        this.elementaryPID = null;
        this.elementaryStreamLengtgh = null;
    }

    readBuffer(bitReader) {
        this.streamType = bitReader.readBits(8);
        assert.equal(bitReader.readBits(3), 7);
        this.elementaryPID = bitReader.readBits(13);
        assert.equal(bitReader.readBits(4), 15);
        this.elementaryStreamLengtgh = bitReader.readBits(12);
        bitReader.skipBits(8 * this.elementaryStreamLengtgh);
    }

    static parse(bitReader) {
        var esd = new ElementaryStreamDescription();
        esd.readBuffer(bitReader);
        return esd;
    }
}
