import Container from '../Container';
import Track from '../Track';
import Sample from '../Sample';
import AudioSample from '../AudioSample';
import h264 from '../codecs/h264/h264';
import AAC from '../codecs/AAC/AAC';
import ADTS from '../codecs/AAC/ADTS';
import TSPacket from './TSPacket';
import PES from './PES';
import PAT from './PAT';
import PMT from './PMT';
import assert from 'assert';

const TS_PACKET_SIZE = 188;

const PID_PAT = 0;

export default class mp2t extends Container {
    constructor() {
        super();
        this.pat = null;
        this.pmt = null;
    }

    getPacketByPID(packets, pid) {
        return packets.find(packet => packet.packetIdentifier === pid);
    }

    static accessUnitFromTSPacket(packet) {
        var pes = PES.parse(packet);
        var sample = pes.isAudio() ? new AudioSample() : new Sample();
        sample.pts = pes.pts;
        sample.dts = pes.dts !== null ? pes.dts : pes.pts;
        if (pes.isAudio()) {
            var adts = ADTS.parse(pes.payload);
            sample.version = adts.version;
            sample.profile = adts.profile;
            sample.samplingFrequencyIndex = adts.samplingFrequencyIndex;
            sample.channelConfiguration = adts.channelConfiguration;
            sample.data = [adts.AACFrame];
        } else {
            sample.data = [pes.payload];
        }

        return sample;
    }

    readBuffer(buffer) {
        var tsPackets = [];
        for (var packet = 0; packet * TS_PACKET_SIZE < buffer.byteLength; packet++) {
            tsPackets.push(new TSPacket(this, new Uint8Array(buffer, packet * TS_PACKET_SIZE, TS_PACKET_SIZE)));
        }

        if (!this.tracks.length) {
            if (this.pat === null) {
                this.pat = new PAT();
                this.pat.readBuffer(this.getPacketByPID(tsPackets, PID_PAT));
            }

            if (this.pmt === null) {
                this.pmt = new PMT();
                this.pmt.readBuffer(this.getPacketByPID(tsPackets, this.pat.getPMTPID()));
            }

            this.pmt.elementaryStreamDescriptions.forEach((esd, i) => {
                var track = Track.createTrackByType(esd.streamType);
                track.pid = esd.elementaryPID;
                track.streamType = esd.streamType;
                track.trackId = i + 1;
                this.addTrack(track);
            });

        }

        tsPackets.forEach(packet => {
            var track = this.pids[packet.packetIdentifier];
            if (!track) {
                return;
            }

            if (packet.payloadUnitStartIndicator) {
                track.samples.push(mp2t.accessUnitFromTSPacket(packet));
            } else if (track.samples.length > 0) {
                var previousSample = track.samples[track.samples.length - 1];
                previousSample.data.push(packet.payload);
            }  else {
                assert.fail('No payload unit start indicator and no existing sample to append to');
            }
        });

        this.tracks.forEach(track => {
            var trackSize = track.samples.reduce((size, sample, i) => {
                sample.size = sample.data.reduce((totalSize, subSample) => totalSize + subSample.byteLength, 0);
                var buffer = new Uint8Array(sample.size);
                sample.data.reduce((position, subSample) => {
                    buffer.set(subSample, position);
                    return position + subSample.byteLength;
                }, 0);
                sample.data = buffer;

                if (i > 0) {
                    track.samples[i - 1].duration = sample.dts - track.samples[i - 1].dts;
                }
                return size + sample.size;
            }, 0);
            track.samples[track.samples.length - 1].duration = track.samples[track.samples.length - 2].duration;
            track.duration = track.samples.reduce((duration, sample) => sample.duration + duration, 0);

            var trackData = new Uint8Array(trackSize);

            track.samples.reduce((size, sample) => {
                trackData.set(sample.data, size);
                return size + sample.data.byteLength;
            }, 0);

            if (track instanceof h264) {
                track.readAnnexB(trackData);
                var {width, height} = track.getDimensions();
                track.data = track.annexBtoAvcc(trackData);
                track.width = width;
                track.height = height;
            } else if (track instanceof AAC) {
                track.data = trackData;
            } else {
                assert.fail('Unknown stream type');
            }
        });
    }

}
