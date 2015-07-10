var esds = require('./esds');
var Box = require('../Box');
var ADTS = require('../../codecs/AAC/ADTS');

export default class mp4a extends Box {
    constructor(track) {
        super('mp4a');
        this.extension = new esds(track);
        this.dataReferenceIndex = 1;
        var sample = track.samples[0];
        this.channelCount = sample.channelConfiguration;
        this.sampleSize = 16;
        this.samplingFrequency = ADTS.samplingFrequency(sample.samplingFrequencyIndex);
    }
    boxLength() {
        return 36 + this.extension.boxLength();
    }
    write() {
        var data = super.write();
        var reserved = 0;
        data.writeUint32(reserved);
        data.writeUint16(reserved);
        data.writeUint16(this.dataReferenceIndex);
        data.writeUint32(reserved);
        data.writeUint32(reserved);
        data.writeUint16(this.channelCount);
        data.writeUint16(this.sampleSize);
        data.writeUint32(reserved);
        data.writeFixedPoint1616(this.samplingFrequency);
        data.view.set(this.extension.write().view, data.position);
        return data;
    }
}
