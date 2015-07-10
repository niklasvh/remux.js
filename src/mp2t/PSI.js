var assert = require('assert');

export default class PSI {
    constructor() {
        this.pointerField = null;
        this.tableId = null;
        this.sectionSyntaxIndicator = null;
        this.privateBit = null;
        this.sectionLength = null;
        this.tableIdExt = null;
        this.versionNumber = null;
        this.currentIndicator = null;
        this.sectionNumber = null;
        this.lastSectionNumber = null;
    }

    readBuffer(bitReader) {
        this.pointerField = bitReader.readBits(8);
        if (this.pointerField) {
            bitReader.skipBits(this.pointerField * 8);
        }
        this.tableId = bitReader.readBits(8);
        this.sectionSyntaxIndicator = bitReader.readBits(1);
        this.privateBit = bitReader.readBits(1);
        assert(bitReader.readBits(2), 3);
        this.sectionLength = bitReader.readBits(12) - 5;
        assert.equal(this.sectionLength < 1021, true);

        if (this.sectionLength > 0) {
            this.tableIdExt = bitReader.readBits(16);
            assert(bitReader.readBits(2), 3);
            this.versionNumber = bitReader.readBits(5);
            this.currentIndicator = bitReader.readBits(1);
            this.sectionNumber = bitReader.readBits(8);
            this.lastSectionNumber = bitReader.readBits(8);
        }
    }
}
