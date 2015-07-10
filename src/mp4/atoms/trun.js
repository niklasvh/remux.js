var Box = require('../Box');

const FLAG_DATA_OFFSET_PRESENT                    = 0x0001;
const FLAG_FIRST_SAMPLE_FLAGS_PRESENT             = 0x0004;
const FLAG_SAMPLE_DURATION_PRESENT                = 0x0100;
const FLAG_SAMPLE_SIZE_PRESENT                    = 0x0200;
const FLAG_SAMPLE_FLAGS_PRESENT                   = 0x0400;
const FLAG_SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT = 0x0800;

export default class trun extends Box {
    constructor(track) {
        super('trun');
        this.version = 0;
        this.flags = FLAG_SAMPLE_SIZE_PRESENT | FLAG_SAMPLE_DURATION_PRESENT | FLAG_DATA_OFFSET_PRESENT;
        if (track.isVideo) {
            this.flags |= FLAG_SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT;
        }
        this.samples = track.samples;
        this.dataOffset = null;
    }
    boxLength() {
        var sampleSize = 8;
        if ((this.flags & FLAG_SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT) !== 0) {
            sampleSize += 4;
        }

        var length = 16 + (this.samples.length * sampleSize);
        if ((this.flags & FLAG_DATA_OFFSET_PRESENT) !== 0) {
            length += 4;
        }
        return length;
    }
    write() {
        var data = super.write();
        data.writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.samples.length);

        if ((this.flags & FLAG_DATA_OFFSET_PRESENT) !== 0) {
            data.writeUint32(this.dataOffset);
        }

        this.samples.forEach(sample => {
            data.writeUint32(sample.duration)
                .writeUint32(sample.size);
            if ((this.flags & FLAG_SAMPLE_COMPOSITION_TIME_OFFSET_PRESENT) !== 0) {
                data.writeUint32(sample.pts - sample.dts);
            }
        });
        return data;
    }
}
