var util = require('util');
var BitReader = require('../BitReader');
var h264 = require('../codecs/h264/h264');
var assert = require('assert').equal;

const STREAM_H264 = 0x1B;
const STREAM_AAC = 0x0F;

export default class TSPacket extends BitReader {
    constructor(container, chunk) {
        super(chunk);
        this.container = container;
        this.syncByte = this.readBits(8);
        this.TEI = this.readBits(1);
        this.payloadUnitStartIndicator = this.readBits(1);
        this.transportPriority = this.readBits(1);
        this.packetIdentifier = this.readBits(13);
        this.scramblingControl = this.readBits(2);
        this.adaptionFieldExists = this.readBits(1);
        this.containsPayload = this.readBits(1);
        this.continuityCounter = this.readBits(4);
        this.payload = null;

        if (this.adaptionFieldExists) {
            var adaptionFieldLength = this.readBits(8);
            this.skipBits((adaptionFieldLength) * 8);
        }

        if (this.containsPayload) {
            this.payload = this.slice();
        }
    }
}
