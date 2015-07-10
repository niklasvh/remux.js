var Box = require('../Box');

export default class mdhd extends Box {
    constructor(track) {
        super('mdhd');
        this.version = 0;
        this.flags = 0;
        this.creationTime = track.creationTime;
        this.modificationTime = track.modificationTime;
        this.timeScale = track.timeScale;
        this.duration = track.duration;
    }
    boxLength() {
        return 32;
    }
    write() {
        var data = super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags);

        this.writeDate(data, this.creationTime);
        this.writeDate(data, this.modificationTime);

        return data.writeUint32(this.timeScale)
            .writeUint32(this.duration)
            .writeUint16(0)
            .writeUint16(0);
    }
}
