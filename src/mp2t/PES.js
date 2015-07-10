var assert = require('assert');

const START_CODE_PREFIX = 0x000001;

const FLAG_DTS = 0x01;
const FLAG_PTS = 0x02;

export default class PES {
    constructor() {
        this.streamId = null;
        this.pesPacketLength = null;
        this.scramblingControl = null;
        this.priority = null;
        this.dataAlignmentIndicator = null;
        this.copyright = null;
        this.originalOrCopy = null;
        this.escrFlag = null;
        this.esRateFlag = null;
        this.dsmTrickModeFlag = null;
        this.additionalCopyIntoFlag = null;
        this.crcFlag = null;
        this.extensionFlag = null;
        this.pts = null;
        this.dts = null;
        this.payload = null;
    }

    parsePTS(bitReader) {
        var pts0 = bitReader.readBits(3);
        assert.equal(bitReader.readBits(1), 1);
        var pts1 = bitReader.readBits(15);
        assert.equal(bitReader.readBits(1), 1);
        var pts2 = bitReader.readBits(15);
        assert.equal(bitReader.readBits(1), 1);
        return (pts0 << 30) | (pts1 << 15) |  pts2;
    }

    static parse(bitReader) {
        var pes = new PES();
        pes.readBuffer(bitReader);
        return pes;
    }

    readBuffer(bitReader) {
        var packetStartCodePrefix = bitReader.readBits(24);
        assert.equal(packetStartCodePrefix, START_CODE_PREFIX);
        this.streamId = bitReader.readBits(8);
        this.pesPacketLength = bitReader.readBits(16);
        var markerBits = bitReader.readBits(2);
        assert.equal(markerBits, 0x2);
        this.scramblingControl = bitReader.readBits(2);
        assert.equal(this.scramblingControl, 0, 'Scrambling control not implemented');
        this.priority = bitReader.readBits(1);
        this.dataAlignmentIndicator = bitReader.readBits(1);
        this.copyright = bitReader.readBits(1);
        this.originalOrCopy = bitReader.readBits(1);
        var ptsDtsIndicator = bitReader.readBits(2);
        this.escrFlag = bitReader.readBits(1);
        this.esRateFlag = bitReader.readBits(1);
        this.dsmTrickModeFlag = bitReader.readBits(1);
        this.additionalCopyIntoFlag = bitReader.readBits(1);
        this.crcFlag = bitReader.readBits(1);
        this.extensionFlag = bitReader.readBits(1);
        var headerLength = bitReader.readBits(8);

        var dataPayloadStart = bitReader.bit + headerLength * 8;

        if ((ptsDtsIndicator & FLAG_PTS) === FLAG_PTS) {
            assert.equal(bitReader.readBits(4), ptsDtsIndicator);
            this.pts = this.parsePTS(bitReader);
        }

        if ((ptsDtsIndicator & FLAG_DTS) === FLAG_DTS) {
            assert.equal(bitReader.readBits(4) & FLAG_DTS, FLAG_DTS);
            this.dts = this.parsePTS(bitReader);
        }
        bitReader.bit = dataPayloadStart;

        this.payload = bitReader.slice();
        assert.equal(this.payload[0], bitReader.buffer[dataPayloadStart / 8])
    }

    isAudio() {
        return this.streamId >= 0xc0 && this.streamId <= 0xdf
    }
}
