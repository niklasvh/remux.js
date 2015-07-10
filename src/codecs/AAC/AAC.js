var assert = require('assert');
var Track = require('../../Track');

export default class AAC extends Track {
    constructor() {
        super();
        this.isAudio =  true;
    }

    getCodec() {
        return 'mp4a.40.2';
    }
}
