export default class Container {
    constructor() {
        this.tracks = [];
        this.pids = {};
    }

    addTrack(track) {
        this.pids[track.pid] = track;
        this.tracks.push(track);
    }

    getType() {
        return 'video/mp4; codecs="' + this.tracks.map(track => track.getCodec()).join(', ') + '"';
    }

    getVideo() {
        return this.tracks.find(track => track.isVideo);
    }

    getAudio() {
        return this.tracks.find(track => track.isAudio);
    }
}
