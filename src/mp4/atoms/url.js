var Box = require('../Box');

export default class url extends Box {
    constructor() {
        super('url ');
        this.version = 0;
        this.flags = 1;
        this.location = '';
    }
    boxLength() {
        return 12 + this.location.length;
    }
    write() {
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeAscii(this.location);
    }
}
