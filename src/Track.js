export default class Track {
    constructor() {
        this.streamType = null;
        this.pid = null;
        this.trackId = null;
        this.timeScale = 90000;
        this.width = 0;
        this.height = 0;
        this.samples = [];
        this.creationTime = new Date();
        this.modificationTime = new Date();
    }
    static createTrackByType(streamType) {
        var h264 = require('./codecs/h264/h264');
        var AAC = require('./codecs/AAC/AAC');
        switch (streamType) {
            case 0x0F: return new AAC();
            case 0x1B: return new h264();
            default:
                throw new Error(streamType + ' is not a supported elementary stream type');
        }
    }
}
