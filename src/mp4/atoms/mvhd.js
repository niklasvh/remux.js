import Box from '../Box';
import assert from 'assert';

export default class mvhd extends Box {
    constructor(media) {
        super('mvhd');
        this.version = 0;
        this.flags = 0;
        this.creationTime = media.creationTime;
        this.modificationTime = media.modificationTime;
        this.timeScale = media.timeScale;
        this.duration = media.duration;
        this.transformMatrix = media.transformMatrix;
        this.tracks = media.tracks;
        this.rate = 1.0;
        this.volume = 1.0;
    }

    boxLength() {
        return this.version === 1 ? 120 : 108;
    }

    static read(media, reader, length) {
        var version = reader.readUint8();
        var flags = reader.readUint24();
        assert.equal(version, 0, 'Unsupported box version');
        media.creationTime = Box.readDate(reader, version);
        media.modificationTime = Box.readDate(reader, version);
        media.timeScale = reader.readUint32();
        media.duration = Box.readVersionLong(reader, version);
    }

    write() {
        var data = super.write();
        data.writeUint8(this.version);
        data.writeUint24(this.flags);
        this.writeDate(data, this.creationTime);
        this.writeDate(data, this.modificationTime);
        data.writeUint32(this.timeScale);
        this.writeVersionLong(data, this.duration);
        data.writeFixedPoint1616(this.rate);
        data.writeFixedPoint88(this.volume);
        data.position += 10;
        this.transformMatrix.forEach((value, i) => {
            if ((i + 1) % 3 === 0) {
                data.writeFixedPoint0230(value);
            } else {
                data.writeFixedPoint1616(value);
            }
        });
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(0);
        data.writeUint32(this.tracks.length + 1);
        return data;
    }
}
