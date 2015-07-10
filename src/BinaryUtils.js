function BinaryUtils() {
    this.position = 0;
}

BinaryUtils.prototype.writeAscii = function(value) {
    for (var i = 0; i < value.length; i++) {
        this.view[this.position + i] = value.charCodeAt(i);
    }
    this.position += i;
    return this;
};

BinaryUtils.prototype.writeFixedPoint88 = function(value) {
    var integer = parseInt(value * 256);
    this.view[this.position] = (integer & 0xFF00) >> 8;
    this.view[this.position + 1] = (integer & 0x00FF);
    this.position += 2;
    return this;
};

BinaryUtils.prototype.writeFixedPoint1616 = function(value) {
    var integer = parseInt(value * 65536);
    this.view[this.position] = (integer & 0xFF000000) >> 24;
    this.view[this.position + 1] = (integer & 0x00FF0000) >> 16;
    this.view[this.position + 2] = (integer & 0x0000FF00) >> 8;
    this.view[this.position + 3] = (integer & 0x000000FF);
    this.position += 4;
    return this;
};

BinaryUtils.prototype.writeFixedPoint0230 = function(value) {
    var integer = parseInt(value * (1 << 30));
    this.view[this.position] = (integer & 0xFF000000) >> 24;
    this.view[this.position + 1] = (integer & 0x00FF0000) >> 16;
    this.view[this.position + 2] = (integer & 0x0000FF00) >> 8;
    this.view[this.position + 3] = (integer & 0x000000FF);
    this.position += 4;
    return this;
};

BinaryUtils.prototype.writeUint8 = function(value) {
    this.view[this.position++] = value;
    return this;
};

BinaryUtils.prototype.writeUint16 = function(value) {
    this.view[this.position] = value >> 8;
    this.view[this.position + 1] = value >> 0;
    this.position += 2;
    return this;
};

BinaryUtils.prototype.writeUint24 = function(value) {
    this.view[this.position] = value >> 16;
    this.view[this.position + 1] = value >> 8;
    this.view[this.position + 2] = value >> 0;
    this.position += 3;
    return this;
};

BinaryUtils.prototype.writeUint32 = function(value) {
    this.view[this.position] = value >> 24;
    this.view[this.position + 1] = value >> 16;
    this.view[this.position + 2] = value >> 8;
    this.view[this.position + 3] = value;
    this.position += 4;
    return this;
};

BinaryUtils.prototype.writeUint64 = function(value) {
    this.view[this.position] = value >> 56;
    this.view[this.position + 1] = value >> 48;
    this.view[this.position + 2] = value >> 40;
    this.view[this.position + 3] = value >> 32;
    this.view[this.position + 4] = value >> 24;
    this.view[this.position + 5] = value >> 16;
    this.view[this.position + 6] = value >> 8;
    this.view[this.position + 7] = value;
    this.position += 8;
    return this;
};

BinaryUtils.prototype.writeBuffer = function(buffer) {
    this.view.set(buffer, this.position);
    this.position += buffer.byteLength;
    return this;
};

module.exports = BinaryUtils;
