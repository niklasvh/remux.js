import Sample from './Sample';

export default class AudioSample extends Sample {
    constructor() {
        super();
        this.version = null;
        this.profile = null;
        this.samplingFrequencyIndex = null;
        this.channelConfiguration = null;
    }
}
