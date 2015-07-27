import LeafBox from '../LeafBox';
import mvhd from './mvhd';
import trak from './trak';
import mvex from './mvex';

export default class moov extends LeafBox {
    constructor(media) {
        super('moov', [
            new mvhd(media),
            ...media.tracks.map(track => new trak(media, track.trackId)),
            new mvex(media)
        ]);
    }
}
