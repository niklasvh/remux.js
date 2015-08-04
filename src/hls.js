require('./polyfills');
import mp4 from './mp4/mp4';
import mp2t from './mp2t/mp2t';
import M3U8 from './m3u8';
import Promise from 'bluebird';
import { EventEmitter } from 'events';

function demux(chunk) {
    var ts = new mp2t();
    ts.readBuffer(chunk);
    var container = new mp4();
    ts.tracks.forEach(track => container.addTrack(track));
    return container;
}

function fetch(url, type = 'arraybuffer') {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = type;
        xhr.send();

        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.response);
            } else {
                reject(xhr);
            }
        };
    });
}

export default class HLSSource extends EventEmitter {
    constructor(playlistUrl, getVideo) {
        super();
        this.buffer = null;
        this.position = 0;
        this.queue = [];
        this.getVideo = getVideo;
        this.streams = null;
        this.streamId = 0;
        this.fetching = false;
        this.desiredBufferLength = 8;
        this.bandwidth = 0;
        this.requestedSegments = [];
        this.originalSize = 0;
        this.remuxedSize = 0;
        this.qualitySetting = -1;
        this.ms = this.createMediaSource(playlistUrl);
        this.on('bandwidthChange', (bandwidth) => {
            if (this.qualitySetting === -1) {
                this.streamId = 0;
                (this.streams || []).some((stream, id) => {
                    if (stream.bandwidth < bandwidth) {
                        this.streamId = id;
                    } else {
                        return true;
                    }
                });
            }
        });
        this.src = window.URL.createObjectURL(this.ms);
    }

    setQuality(quality) {
        this.qualitySetting = quality;
        this.streamId = quality === -1 ? 0 : quality;

    }

    createMediaSource(playlistUrl) {
        const ms = new MediaSource();
        ms.addEventListener('sourceopen', () => {
            HLSSource.getPlaylists(playlistUrl).then(playlists => {
                this.streams = playlists;
                return this.getNextChunk();
            }).then(container => {
                container.duration = this.getCurrentPlaylist().playlist.attributes.reduce((duration, segment) => duration + segment.duration, 0) * container.timeScale;
                this.buffer = ms.addSourceBuffer(container.getType());
                this._poller = setInterval(() => {
                    var bufferLength = this.getBufferLength();
                    if (!this.fetching && this.position < this.getCurrentPlaylist().playlist.attributes.length && (bufferLength < this.desiredBufferLength || this.getVideo().paused) ) {
                        this.getNextChunk().then(container => this.appendChunk(container.writeBuffer()));
                    }
                }, 100);
                this.buffer.addEventListener('update', () => {
                    if (this.queue.length) {
                        this.buffer.appendBuffer(this.queue.shift());
                    }
                });

                this.appendChunk(container.writeBuffer());
            });
        });
        return ms;
    }

    static getPlaylists(playlistUrl) {
        return fetch(playlistUrl, 'text').then((str) => {
            var playlist = new M3U8(str);
            return Promise.all(playlist.attributes.map(attribute => {
                var path = playlistUrl.substring(0, playlistUrl.lastIndexOf('/') + 1);
                return fetch(path + attribute.value, 'text').then(playlist => {
                    return {
                        bandwidth: attribute.bandwidth,
                        resolution: attribute.resolution,
                        playlist: new M3U8(playlist),
                        path: path
                    };
                });
            }));
        });
    }

    clearBuffer(playlistUrl) {
        this.position = 0;
        this.queue = [];
        this.requestedSegments = [];
        this.originalSize = 0;
        this.remuxedSize = 0;
        this.streams = null;
        this.streamId = this.qualitySetting === -1 ? 0 : this.streamId;
        this.fetching = false;
        this.ms.removeSourceBuffer(this.buffer);
        this.buffer = null;
        clearInterval(this._poller);
        this.ms = this.createMediaSource(playlistUrl);
        this.src = window.URL.createObjectURL(this.ms);
        return this.src;
    }

    getBufferLength() {
        return this.buffer && this.buffer.buffered.length ? this.buffer.buffered.end(0) - this.getVideo().currentTime : 0;
    }

    appendChunk(chunk) {
        if (this.buffer) {
            if (this.buffer.updating) {
                this.queue.push(chunk);
            } else {
                this.remuxedSize += chunk.byteLength;
                this.buffer.appendBuffer(chunk);
                this.emit('appendBuffer');
            }
        }
    }

    getCurrentPlaylist() {
        return this.streams[this.streamId];
    }

    getNextChunk() {
        var stream = this.getCurrentPlaylist();
        var segment = stream.playlist.attributes[this.position++];
        this.fetching = true;
        var start = Date.now();
        this.requestedSegments.push({
            bandwidth: stream.bandwidth,
            resolution: stream.resolution,
            duration: segment.duration
        });
        this.emit('requestsegment');

        return fetch(stream.path + segment.value).tap(chunk => {
            var end = Date.now();
            this.bandwidth = (8 * chunk.byteLength) / ((end - start) / 1000);
            this.emit('bandwidthChange', this.bandwidth);
            this.fetching = false;
            this.originalSize += chunk.byteLength;
        }).then(demux).tap(container => this.emit('demux', container));
    }
}
