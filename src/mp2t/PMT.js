var assert = require('assert');
var PSI = require('./PSI');
var ElementaryStreamDescription = require('./ElementaryStreamDescription');

export default class PMT extends PSI {
    constructor() {
        super();
        this.pcrPid = null;
        this.programInfoLength = null;
        this.elementaryStreamDescriptions = [];
    }

    readBuffer(bitReader) {
        super.readBuffer(bitReader);
        assert.equal(bitReader.readBits(3), 7);
        this.pcrPid = bitReader.readBits(13);
        assert.equal(bitReader.readBits(4), 15);
        this.programInfoLength = bitReader.readBits(12);
        bitReader.skipBits(8 * this.programInfoLength);

        for (var p = 0; p < (this.sectionLength - 6) / 6; p++) {
            this.elementaryStreamDescriptions.push(ElementaryStreamDescription.parse(bitReader));
        }
    }
}
