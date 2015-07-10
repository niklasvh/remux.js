var Box = require('../Box');

export default class mdat extends Box {
    constructor(media) {
        super('mdat');
        this.data = media.tracks.reduce((data, track) => data.concat(track.data), []);
    }
    boxLength() {
        return 8 + this.data.reduce((length, data) => length + data.byteLength + 4, 0);
    }
    write() {
        var data = super.write();

        this.data.forEach(trackData => {
            data.writeBuffer(trackData);
        });

        return data;
    }
}
