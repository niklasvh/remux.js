var Box = require('../Box');
var AAC = require('../../codecs/AAC/AAC');

const TAG_ES_DESCRIPTOR_BOX = 0x03;
const TAG_DECODER_CONFIG_DESCRIPTOR_BOX = 0x04;
const TAG_AUDIO_DECODER_SPECIFIC_INFO = 0x05;

export default class esds extends Box {
    constructor(track) {
        super('esds');
        this.version = 0;
        this.flags = 0;
        this.maxBitrate = 0;
        this.avgBitrate = 0;
        this.trackId = track.trackId;
        this.objectType = 0x40; // MPEG-4 AAC
        this.streamType = 0x05; // Audio stream
        this.upstream = 0;
        var sample = track.samples[0];
        this.audioObjectType = sample.profile;
        this.samplingFrequencyIndex = sample.samplingFrequencyIndex;
        this.channelConfiguration = sample.channelConfiguration;
    }
    boxLength() {
        return 36;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint8(TAG_ES_DESCRIPTOR_BOX)
            .writeUint8(22) // tag size
            .writeUint16(this.trackId)
            .writeUint8(0)
            .writeUint8(TAG_DECODER_CONFIG_DESCRIPTOR_BOX)
            .writeUint8(17) // tag size
            .writeUint8(this.objectType)
            .writeUint8((this.streamType << 2) | (this.upstream << 1) | 1)
            .writeUint8(0xff)
            .writeUint8(0xff)
            .writeUint8(0xff)
            .writeUint32(this.maxBitrate)
            .writeUint32(this.avgBitrate)
            .writeUint8(TAG_AUDIO_DECODER_SPECIFIC_INFO)
            .writeUint8(2) // tag size
            .writeUint8((this.audioObjectType << 3) | (this.samplingFrequencyIndex & 0x0e) >> 1)
            .writeUint8((this.samplingFrequencyIndex & 0x01) << 7 | (this.channelConfiguration << 3));
    }
}
