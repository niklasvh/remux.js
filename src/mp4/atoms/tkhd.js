var Box = require('../Box');

const FLAG_TRACK_ENABLED = 0x1;
const FLAG_TRACK_IN_MOVIE = 0x2;
const FLAG_TRACK_IN_PREVIEW = 0x4;

export default class tkhd extends Box {
    constructor(media, track) {
        super('tkhd');
        this.trackId = track.trackId;
        this.version = 0;
        this.flags = FLAG_TRACK_ENABLED | FLAG_TRACK_IN_MOVIE | FLAG_TRACK_IN_PREVIEW;
        this.creationTime = track.creationTime;
        this.modificationTime = track.modificationTime;
        this.duration = media.duration;
        this.transformMatrix = media.transformMatrix;
        this.width = track.width;
        this.height = track.height;
    }
    boxLength() {
        return this.version === 0 ? 92 : 104;
    }
    write() {
        var data = super.write();
        var reserved = 0;
        data.writeUint8(this.version);
        data.writeUint24(this.flags);
        this.writeDate(data, this.creationTime);
        this.writeDate(data, this.modificationTime);
        data.writeUint32(this.trackId);
        data.writeUint32(reserved);
        this.writeVersionLong(data, this.duration);
        data.writeUint64(reserved);
        data.writeUint16(0);
        data.writeUint16(0);
        data.writeFixedPoint88(1.0);
        data.writeUint16(reserved);
        this.transformMatrix.forEach((value, i) => {
            if ((i + 1) % 3 === 0) {
                data.writeFixedPoint0230(value);
            } else {
                data.writeFixedPoint1616(value);
            }
        });
        data.writeFixedPoint1616(this.width);
        data.writeFixedPoint1616(this.height);
        return data;
    }
}
