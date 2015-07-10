var Box = require('../Box');

const FLAG_BASE_DATA_OFFSET_PRESENT         = 0x00001;
const FLAG_SAMPLE_DESCRIPTION_INDEX_PRESENT = 0x00002;
const FLAG_DEFAULT_SAMPLE_DURATION_PRESENT  = 0x00008;
const FLAG_DEFAULT_SAMPLE_SIZE_PRESENT      = 0x00010;
const FLAG_DEFAULT_SAMPLE_FLAGS_PRESENT     = 0x00020;
const FLAG_DURATION_IS_EMPTY                = 0x10000;
const FLAG_DEFAULT_BASE_IS_MOOF             = 0x20000;

export default class tfhd extends Box {
    constructor(track) {
        super('tfhd');
        this.trackId = track.trackId;
        this.version = 0;
        this.flags = FLAG_DEFAULT_BASE_IS_MOOF;
    }
    boxLength() {
        return 16;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.trackId);
    }
}
