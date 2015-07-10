var Box = require('../Box');

export default class tfdt extends Box {
    constructor(track) {
        super('tfdt');
        this.samples = track.samples;
        this.version = 0;
        this.flags = 0;
    }
    boxLength() {
        return 16;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.samples.length ? this.samples[0].dts : 0);
    }
}
