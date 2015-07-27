var Box = require('../Box');

export default class ftyp extends Box {
    constructor(media) {
        super('ftyp');
        this.minorBrands = media.minorBrands;
        this.majorBrand = media.majorBrand;
        this.minorVersion = media.minorVersion;
    }
    boxLength() {
        return 16 + this.minorBrands.length * 4;
    }
    static read(media, reader, length) {
        media.majorBrand = reader.readAscii(4);
        media.minorVersion = reader.readUint32();
        media.minorBrands = [];
        for (var i = 16; i < length; i+=4) {
            media.minorBrands.push(reader.readAscii(4));
        }
    }
    write() {
        var data = super.write()
            .writeAscii(this.majorBrand)
            .writeUint32(this.minorVersion);

        this.minorBrands.forEach(brand => data.writeAscii(brand));
        return data;
    }
}
