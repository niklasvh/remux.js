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

class HLSSource extends EventEmitter {
    constructor(playlistUrl, video) {
        super();
        this.ms = new MediaSource();
        this.buffer = null;
        this.position = 0;
        this.queue = [];
        this.streams = null;
        this.streamId = 0;
        this.fetching = false;
        this.desiredBufferLength = 8;
        this.video = video;
        this.bandwidth = 0;
        this.requestedSegments = [];

        this.ms.addEventListener('sourceopen', () => {
            HLSSource.getPlaylists(playlistUrl).then(playlists => {
                this.streams = playlists;
                return this.getNextChunk();
            }).then(container => {
                console.log(container);
                container.duration = this.getCurrentPlaylist().playlist.attributes.reduce((duration, segment) => duration + segment.duration, 0) * container.timeScale;
                this.buffer = this.ms.addSourceBuffer(container.getType());

                setInterval(() => {
                    var bufferLength = this.getBufferLength();
                    if (!this.fetching && this.position < this.getCurrentPlaylist().playlist.attributes.length && bufferLength < this.desiredBufferLength) {
                        this.getNextChunk().then(container => this.appendChunk(container.writeBuffer()));
                    }
                }, 100);

                this.on('bandwidthChange', (bandwidth) => {
                    this.streamId = 0;
                    this.streams.some((stream, id) => {
                        if (stream.bandwidth < bandwidth) {
                            this.streamId = id;
                        } else {
                            return true;
                        }
                    });
                });

                this.buffer.addEventListener('update', () => {
                    if (this.queue.length) {
                        this.buffer.appendBuffer(this.queue.shift());
                    }
                });

                this.appendChunk(container.writeBuffer());
            });
        });

        this.src = window.URL.createObjectURL(this.ms);
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

    getBufferLength() {
        return this.buffer && this.buffer.buffered.length ? this.buffer.buffered.end(0) - video.currentTime : 0;
    }

    appendChunk(chunk) {
        if (this.buffer.updating) {
            this.queue.push(chunk);
        } else {
            this.buffer.appendBuffer(chunk);
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

        return fetch(stream.path + segment.value).tap(chunk => {
            var end = Date.now();
            this.bandwidth = (8 * chunk.byteLength) / ((end - start) / 1000);
            this.emit('bandwidthChange', this.bandwidth);
            this.fetching = false

        }).then(demux);
    }
}

window.HLSSource = HLSSource;
