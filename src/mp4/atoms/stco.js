var Box = require('../Box');

export default class stco extends Box {
    constructor() {
        super('stco');
        this.entries = [];
        this.version = 0;
        this.flags = 0;
    }
    boxLength() {
        return 16 + this.entries.length * 4;
    }
    write() {
        var data = super.write();
        data.writeUint8(this.version);
        data.writeUint24(this.flags);
        data.writeUint32(this.entries.length);
        this.entries.forEach(entry => {
            data.writeUint32(entry.chunkOffset);
        });
        return data;
    }
}
