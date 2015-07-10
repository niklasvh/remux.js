var util = require('util');
var BinaryUtils = require('../BinaryUtils');

class Box extends BinaryUtils {
    constructor(name) {
        super();
        this.name = name;
    }

    static leafLength(atoms) {
        return atoms.reduce((len, atom) => len + atom.boxLength(), 8);
    }

    write() {
        var length = this.boxLength();
        var buffer = new ArrayBuffer(length);
        var data = new BinaryUtils();
        data.view = new Uint8Array(buffer);
        return data
            .writeUint32(length)
            .writeAscii(this.name);
    }

    writeDate(data, date) {
        var jan1904 = new Date(1904, 1, 1, 0, 0, 0, 0);
        var time = Math.round((date.getTime() - jan1904.getTime()) / 1000);
        return this.writeVersionLong(data, time);
    }

    writeVersionLong(data, value) {
        if (this.version === 1) {
            data.writeUint64(value);
        } else {
            data.writeUint32(value);
        }
        return data;
    }

    getLength() {
        return this.view.byteLength;
    }
}

module.exports = Box;
