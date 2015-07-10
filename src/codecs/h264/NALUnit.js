var assert = require('assert');

class NALUnit {
    constructor(type, refIdc, buffer) {
        this.type = type;
        this.refIdc = refIdc;
        this.buffer = buffer;
    }

    static read(buffer) {
        var nalHeader = buffer[0];
        var forbiddenZeroBit = (nalHeader >> 7) & 0x1;
        assert.equal(forbiddenZeroBit, 0);

        var nalRefIdc = (nalHeader >> 5) & 0x3;
        var nalType = nalHeader & 0x1f;

        return new NALUnit(nalType, nalRefIdc, buffer);
    }
}

module.exports = NALUnit;