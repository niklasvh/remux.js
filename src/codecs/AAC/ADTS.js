var assert = require('assert');
var BitReader = require('../../BitReader');

export default class ADTS {
    constructor() {
        this.version = null;
        this.profile = null;
        this.samplingFrequencyIndex = null;
        this.channelConfiguration = null;
        this.frameLength = null;
        this.bufferFullness = null;
        this.aacFramesInADTS = null;
        this.AACFrame = null;
    }

    read(reader) {
        assert.equal(reader.readBits(12), 0xfff);
        this.version = reader.readBits(1);
        assert.equal(reader.readBits(2), 0);
        var protectionAbsent = reader.readBits(1);
        this.profile = reader.readBits(2) + 1;
        this.samplingFrequencyIndex = reader.readBits(4);
        reader.skipBits(1);
        this.channelConfiguration = reader.readBits(3);
        assert.equal(reader.readBits(4), 0);
        var offset = (protectionAbsent ? 7 : 9);
        this.frameLength = reader.readBits(13);
        this.bufferFullness = reader.readBits(11);
        this.aacFramesInADTS = reader.readBits(2) + 1;
        assert.equal(this.aacFramesInADTS, 1, 'Should have 1 AAC frame per ADTS frame');
        if (!protectionAbsent) {
            reader.skipBits(16);
        }
        this.AACFrame = new Uint8Array(reader.buffer.buffer, reader.buffer.byteOffset + offset, Math.min(this.frameLength - offset, reader.buffer.byteLength - offset));
        reader.bit += 8 * (this.frameLength - offset);
        return this;
    }

    static parse(buffer) {
        var adts = new ADTS();
        var reader = new BitReader(buffer);
        return adts.read(reader);
    }

    static samplingFrequency(samplingFrequencyIndex) {
        return [96000, 88200, 64000, 48000, 44100, 32000, 24000, 22050, 16000, 12000, 11025,  8000, 7350][samplingFrequencyIndex];
    }
}
