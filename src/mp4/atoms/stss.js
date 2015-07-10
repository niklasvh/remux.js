var Box = require('../Box');

export default class stss extends Box {
    constructor() {
        super('stss');
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
            .writeUint32(0);
    }
}
