
export default class BitReader {
    constructor(buffer) {
        this.bit = 0;
        this.buffer = buffer;
    }

    skipBits(num) {
        this.bit += num;
    }

    readAscii(n) {
        var offset = this.bit / 8;
        var str = '';
        for (var i = 0; i < n; i++) {
            str += String.fromCharCode(this.buffer[offset + i]);
        }
        this.bit += 8*n;
        return str;
    }

    readUint8() {
        var offset = this.bit / 8;
        var value = this.buffer[offset];
        this.bit += 8;
        return value;
    }

    readUint16() {
        var offset = this.bit / 8;
        var value = this.buffer[offset + 1];
        value |= this.buffer[offset] << 8;

        this.bit += 16;
        return value;
    }

    readUint24() {
        var offset = this.bit / 8;
        var value = this.buffer[offset + 2];
        value |= this.buffer[offset + 1] << 8;
        value |= this.buffer[offset] << 16;

        this.bit += 24;
        return value;
    }

    readUint32() {
        var offset = this.bit / 8;
        var value = this.buffer[offset + 3];
        value |= this.buffer[offset + 2] << 8;
        value |= this.buffer[offset + 1] << 16;
        value |= this.buffer[offset] << 24;

        this.bit += 32;
        return value;
    }

    readBit() {
        var offset = Math.floor(this.bit / 8);
        var shift = 7 - this.bit % 8;
        this.bit += 1;
        return (this.buffer[offset] >> shift) & 1;
    }


    readBits(n) {
        var i, value = 0;
        for (i = 0; i < n; i += 1) {
            value = value << 1 | this.readBit();
        }
        return value;
    }

    readUGolomb() {
        var zeros = 0;
        while (0 === this.readBit()) {
            zeros++;
        }

        var value = 1 << zeros;

        for (var i = zeros - 1; i >= 0; i--) {
            value |= this.readBit() << i;
        }

        return value - 1;
    }

    slice(offset = this.bit / 8, length = this.buffer.byteLength - offset) {
        return new Uint8Array(this.buffer.buffer, offset + this.buffer.byteOffset, length);
    }
}
