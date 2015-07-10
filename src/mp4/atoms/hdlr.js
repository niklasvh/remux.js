var Box = require('../Box');

export default class hdlr extends Box {
    constructor(track) {
        super('hdlr');
        this.version = 0;
        this.flags = 0;
        this.handlerType = track.isVideo ? 'vide' : 'soun';
        this.handlerName = track.isVideo ? 'VideoHandler' : 'AudioHandler'
    }
    boxLength() {
        return 45;
    }
    write() {
        var reserved = 0;
        return super.write()
            .writeUint8(this.version)
            .writeUint24(this.flags)
            .writeUint32(0)
            .writeAscii(this.handlerType)
            .writeUint32(reserved)
            .writeUint32(reserved)
            .writeUint32(reserved)
            .writeAscii(this.handlerName);
    }
}
