var Box = require('../Box');

export default class stsc extends Box {
    constructor() {
        super('stsc');
        this.entries = [];
        this.version = 0;
        this.flags = 0;
    }
    boxLength() {
        return 16 + this.entries.length * 12;
    }
    write() {
        var data = super.write();
        data.writeUint8(this.version);
        data.writeUint24(this.flags);
        data.writeUint32(this.entries.length);
        this.entries.forEach(entry => {
            data.writeUint32(entry.firstChunk);
            data.writeUint32(entry.samplesPerChunk);
            data.writeUint32(entry.sampleDescriptionId);
        });

        return data;
    }
}
