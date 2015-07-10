import assert from 'assert';
import NALUnit from './NALUnit';
import SequenceParameterSet from './SequenceParameterSet';
import Track from '../../Track';

const NAL_TYPE_NON_IDR_SLICE = 1;
const NAL_TYPE_IDR_SLICE = 5;
const NAL_TYPE_SPS = 7;
const NAL_TYPE_PPS = 8;
const NAL_TYPE_AUD = 9;

class h264 extends Track {
    constructor() {
        super();
        this.isVideo =  true;
        this.NALUnits = [];
    }

    getCodec() {
        return 'avc1.42c029';
    }

    annexBtoAvcc(buffer) {
        var syncWordLength = 4;
        var nalPosition = -1;
        for (var position = 0; position < buffer.byteLength; position++) {
            if (buffer[position] !== 0 || buffer[position + 1] !== 0 || buffer[position  + 2] !== 0 || buffer[position + 3] !== 1) {
                continue;
            }

            if (nalPosition >= 0) {
                let nalSize = position - nalPosition;
                assert.equal(nalSize > 0, true);
                buffer[nalPosition - 4] = (nalSize & 4278190080) >> 24;
                buffer[nalPosition - 3] = (nalSize & 16711680) >> 16;
                buffer[nalPosition - 2] = (nalSize & 65280) >> 8;
                buffer[nalPosition - 1] = nalSize & 255;
            }

            nalPosition = position + syncWordLength;
            var nalHeader = buffer[nalPosition];
            var forbiddenZeroBit = (nalHeader >> 7) & 0x1;
            assert.equal(forbiddenZeroBit, 0);

            position += syncWordLength;
        }

        let nalSize = position - nalPosition;
        assert.equal(nalSize > 0, true);
        buffer[nalPosition - 4] = (nalSize & 4278190080) >> 24;
        buffer[nalPosition - 3] = (nalSize & 16711680) >> 16;
        buffer[nalPosition - 2] = (nalSize & 65280) >> 8;
        buffer[nalPosition - 1] = (nalSize & 255);

        return buffer;
    }
    readAnnexB(buffer) {
        var syncWordLength = 0;
        var nalPosition = -1;
        for (var position = 0; position < buffer.byteLength; position++) {
            if (buffer[position] !== 0 || buffer[position + 1] !== 0) {
                continue;
            }

            syncWordLength = 0;
            if (buffer[position  + 2] === 0 && buffer[position + 3] === 1) {
                syncWordLength = 4;
            } else if (buffer[position  + 2] === 1) {
                syncWordLength = 3;
            } else {
                continue;
            }

            if (nalPosition >= 0) {
                let nalSize = position - nalPosition;
                assert.equal(nalSize > 0, true);
                this.NALUnits.push(NALUnit.read(new Uint8Array(buffer.buffer, buffer.byteOffset + nalPosition, nalSize)));
            }

            nalPosition = position + syncWordLength;
            var nalHeader = buffer[nalPosition];
            var forbiddenZeroBit = (nalHeader >> 7) & 0x1;
            assert.equal(forbiddenZeroBit, 0);

            position += syncWordLength;
        }
    }
    getSequenceParameterSets() {
        return this.NALUnits.filter(unit => unit.type === NAL_TYPE_SPS);
    }
    getPictureParameterSets() {
        return this.NALUnits.filter(unit => unit.type === NAL_TYPE_PPS);
    }
    getDimensions() {
        var sps = SequenceParameterSet.parse(this.getSequenceParameterSets()[0].buffer);
        return SequenceParameterSet.getDimensions(sps);
    }
}

module.exports = h264;
