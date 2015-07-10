var Box = require('../Box');

export default class smhd extends Box {
    constructor() {
        super('smhd');
        this.version = 0;
        this.flags = 1;
        this.balance = 0;
    }
    boxLength() {
        return 16;
    }
    write() {
        var reserved = 0;
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint16(this.balance)
            .writeUint16(reserved);
    }
}
