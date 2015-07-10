function BitReader(buffer) {
    this.bit = 0;
    this.buffer = buffer;
}

BitReader.prototype.skipBits = function(num) {
    this.bit += num;
};

BitReader.prototype.setByteOffset = function(byte) {
    this.bit = byte * 8;
};

BitReader.prototype.readBit = function() {
    var offset = Math.floor(this.bit / 8);
    var shift = 7 - this.bit % 8;
    this.bit += 1;
    return (this.buffer[offset] >> shift) & 1;
};

BitReader.prototype.readBits = function (n) {
    var i, value = 0;
    for (i = 0; i < n; i += 1) {
        value = value << 1 | this.readBit();
    }

    return value;
};

BitReader.prototype.readUGolomb = function() {
    var zeros = 0;
    while (0 === this.readBit()) {
        zeros++;
    }

    var value = 1 << zeros;

    for (var i = zeros - 1; i >= 0; i--) {
        value |= this.readBit() << i;
    }

    return value - 1;
};

BitReader.prototype.slice = function(offset, length) {
    if (!offset) {
        offset = this.bit / 8;
    }
    if (!length) {
        length = this.buffer.byteLength - offset;
    }
    return new Uint8Array(this.buffer.buffer, offset + this.buffer.byteOffset, length);
};

module.exports = BitReader;
