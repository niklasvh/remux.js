import assert from 'assert';

let emptyLine = line => line.trim().length;

export default class m3u8 {
    constructor(str) {
        var lines = str.split('\n').map(line => line.trim());
        this.attributes = [];
        assert.equal(lines[0], '#EXTM3U');
        lines.slice(1).filter(emptyLine).forEach(line => {
            var attribute = line.split(':')[0];
            if (line[0] === '#') {
                switch(attribute) {
                    case '#EXT-X-STREAM-INF':
                        let properties = this.parseProperties(line.split(':')[1]);
                        this.attributes.push(new Playlist(properties.bandwidth, properties.resolution));
                        break;
                    case '#EXTINF':
                        this.attributes.push(new Segment(parseFloat(line.split(':')[1].trim())));
                        break;
                    default:
                        //console.log('Unhandled attribute', attribute, line);
                }
            } else {
                this.attributes[this.attributes.length - 1].value = line;
            }
        });
    }

    parseProperties(values) {
        return values.split(',').map(property => property.split('=')).reduce((data, item) => {
            data[item[0].toLowerCase()] = item[1];
            return data;
        }, {});
    }
}

class Segment {
    constructor(duration) {
        this.type = 'segment';
        this.duration = duration;
    }
}

class Playlist {
    constructor(bandwidth, resolution) {
        this.type = 'playlist';
        this.bandwidth = parseInt(bandwidth, 10);
        this.resolution = resolution;
        this.value = null;
    }
}
