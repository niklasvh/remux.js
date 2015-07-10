var Box = require('../Box');
var url = require('./url');

export default class dref extends Box {
    constructor() {
        super('dref');
        this.version = 0;
        this.flags = 0;
        this.entries = [new url()];
    }
    boxLength() {
        return 16 + this.entries.reduce((length, entry) => length + entry.boxLength(), 0);
    }
    write() {
        var data = super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(this.entries.length)
        this.entries.reduce((position, atom) => {
            data.view.set(atom.write().view, position);
            return position + atom.boxLength();
        }, data.position);

        return data;
    }
}
