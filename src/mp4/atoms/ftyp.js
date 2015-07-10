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
    write() {
        var data = super.write()
            .writeAscii(this.majorBrand)
            .writeUint32(this.minorVersion);

        this.minorBrands.forEach(brand => data.writeAscii(brand));
        return data;
    }
}
