var Box = require('../Box');

export default class vmhd extends Box {
    constructor() {
        super('vmhd');
        this.version = 0;
        this.flags = 1;
        this.graphicsMode = 0;
    }
    boxLength() {
        return 20;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint16(this.graphicsMode)
            .writeUint16(0)
            .writeUint16(0)
            .writeUint16(0);
    }
}
