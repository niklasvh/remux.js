import React from 'react';
import HLSSource from '../hls';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            segments: [],
            bandwidth: 0,
            videoSamplesRemuxed: 0,
            videoRemuxedByteCount: 0,
            videoNALUCount: 0,
            audioSamplesRemuxed: 0,
            audioRemuxedByteCount: 0,
            originalSize: 0,
            remuxedSize: 0
        };
    }
    componentDidMount() {
        var playlist = '/hls/big_buck_bunny/playlist.m3u8';

        var hls = new HLSSource(playlist, () => {
            return this.refs.video;
        });

        hls.on('bandwidthChange', bandwidth => {
            this.setState({
                bandwidth: bandwidth,
                stream: hls.streams[hls.streamId]
            });
        });

        hls.on('demux', container => {
            var video = container.getVideo();
            var audio = container.getAudio();
            this.setState({
                videoSamplesRemuxed: this.state.videoSamplesRemuxed + video.samples.length,
                videoRemuxedByteCount: this.state.videoRemuxedByteCount + video.data.byteLength,
                videoNALUCount: this.state.videoNALUCount + video.NALUnits.length,
                audioSamplesRemuxed: this.state.audioSamplesRemuxed + audio.samples.length,
                audioRemuxedByteCount: this.state.audioRemuxedByteCount + audio.data.byteLength
            });
        });

        hls.on('requestsegment', () => this.setState({segments: hls.requestedSegments}));
        hls.on('appendBuffer', () => this.setState({
            originalSize: hls.originalSize,
            remuxedSize: hls.remuxedSize
        }));

        setInterval(() => {
            var video = this.refs.video;
            if (video) {
                this.setState({
                    time: video.currentTime,
                    duration: video.duration,
                    audioDecodedByteCount: video.webkitAudioDecodedByteCount,
                    decodedFrameCount: video.webkitDecodedFrameCount,
                    droppedFrameCount: video.webkitDroppedFrameCount,
                    videoDecodedByteCount: video.webkitVideoDecodedByteCount,
                });
            }
        }, 100);

        this.setState({
            tracks: [playlist, hls.src],
            hls: hls
        });
    }
    static asPercentage(value, total) {
        return Math.min((value / total) * 100, 100) + '%';
    }
    static reduceSegmentTime(segments, i) {
        return segments.reduce((time, segment, p) => {
            return (p < i) ? segment.duration + time : time;
        }, 0);
    }
    qualityChange() {
        this.state.hls.setQuality(this.refs.quality.selectedIndex - 1);
    }
    clearBuffer(url) {
        return e => {
            e.preventDefault();
            this.setState({
                tracks: [url, this.state.hls.clearBuffer(url)],
                updating: true
            });
        };
    }
    componentDidUpdate() {
        if (this.state.updating) {
            this.setState({updating: false});
        }
    }
    render() {
        return (
            <div>
                {this.state.updating ? null : <video autoPlay controls ref='video'>
                    {this.state.tracks.map(track => <source key={track} src={track} />)}
                </video>}
                <button onClick={this.clearBuffer('/hls/big_buck_bunny/playlist.m3u8').bind(this)}>Load big buck bunny trailer</button>
                <button onClick={this.clearBuffer('/hls/sintel/playlist.m3u8').bind(this)}>Load sintel trailer</button>
                Quality:
                <select onChange={this.qualityChange.bind(this)} ref="quality">
                    <option>Auto</option>
                    <option>480x270</option>
                    <option>640x360</option>
                    <option>1280x720</option>
                    <option>1920x1080</option>
                </select>
                <fieldset>
                    <legend>Statistics</legend>
                    {typeof(this.state.audioDecodedByteCount) === 'number' ? <div>{this.state.audioDecodedByteCount + ' audio bytes decoded'}</div> : null}
                    {typeof(this.state.videoDecodedByteCount) === 'number' ? <div>{this.state.videoDecodedByteCount + ' video bytes decoded'}</div> : null}
                    {typeof(this.state.decodedFrameCount) === 'number' ? <div>{this.state.decodedFrameCount + ' frames decoded'}</div> : null}
                    {typeof(this.state.droppedFrameCount) === 'number' ? <div>{this.state.droppedFrameCount + ' dropped frames'}</div> : null}
                    <div>Time: {this.state.time}/{this.state.duration}s</div>
                    <div>Overhead in HLS: {parseInt(((this.state.originalSize / this.state.remuxedSize) - 1) * 100 * 100, 10) / 100}%</div>
                    <div style={{clear: 'both'}}>{this.state.audioRemuxedByteCount + ' audio bytes remuxed'}</div>
                    <div>{this.state.videoRemuxedByteCount + ' video bytes remuxed'}</div>
                    <div>{this.state.audioSamplesRemuxed + ' audio samples remuxed'}</div>
                    <div>{this.state.videoSamplesRemuxed + ' video samples remuxed'}</div>
                    <div>{this.state.videoNALUCount + ' h264 NAL units remuxed'}</div>
                </fieldset>
                <div style={{backgroundColor: '#000', height: 150, position: 'relative', overflow: 'hidden', marginTop: 20}}>
                    {this.state.segments.map((segment, i, segments) => {
                        return (
                            <div key={i} style={{textAlign: 'center', overflow: 'hidden', position: 'absolute',  borderLeft: '1px solid black', bottom: 0, height: App.asPercentage(segment.bandwidth, 3000000), left: App.asPercentage(App.reduceSegmentTime(segments, i), this.state.duration), background: 'rgba(0, 255, 0, 0.5)', width: App.asPercentage(segment.duration, this.state.duration) }}>
                                {segment.resolution}
                            </div>
                        );
                    })}
                    <div style={{transition: 'all 0.5s', width: 5, background: 'red', height: 150, position: 'absolute', left: App.asPercentage(this.state.time, this.state.duration)}}></div>
                    <div style={{marginBottom: -25, transition: 'all 0.5s', height: 25, lineHeight: '25px', paddingLeft: 5, background: 'rgba(200, 200, 255, 0.5)', width: '100%', position: 'absolute', left: 0, bottom: App.asPercentage(this.state.bandwidth, 3000000)}}>
                        Bandwidth: {parseInt(this.state.bandwidth / 1024, 10) + ' kbps'}
                    </div>
                </div>
            </div>
        );
    }
}
