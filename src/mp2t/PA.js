var assert = require('assert');

export default class PA {
    constructor() {
        this.programNumber = null;
        this.programMapPID = null;
    }

    readBuffer(bitReader) {
        this.programNumber = bitReader.readBits(16);
        assert.equal(bitReader.readBits(3), 7);
        this.programMapPID = bitReader.readBits(13);
    }

    static parse(bitReader) {
        var pa = new PA();
        pa.readBuffer(bitReader);
        return pa;
    }
}
