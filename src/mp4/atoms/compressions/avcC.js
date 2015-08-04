var Box = require('../../Box');

const SPS = {
    profile_idc: 1,
    profile_compatibility: 2,
    level_idc: 3
};

export default class avcC extends Box {
    constructor(track) {
        super('avcC');
        this.configurationVersion = 1;
        this.spsList = track.getSequenceParameterSets().slice(0, 1);
        this.ppsList = track.getPictureParameterSets().slice(0, 1);
        this.lengthSize = 4;
    }

    boxLength() {
        return 50;
    }
    write() {
        var data = super.write();
        var sps = this.spsList[0].buffer;
        data.writeUint8(this.configurationVersion);
        data.writeUint8(sps[SPS.profile_idc]);
        data.writeUint8(sps[SPS.profile_compatibility]);
        data.writeUint8(sps[SPS.level_idc]);
        data.writeUint8((this.lengthSize - 1) | 0xfc);
        data.writeUint8(this.spsList.length | 0xe0);
        this.spsList.forEach(spsItem => {
            data.writeUint16(spsItem.buffer.byteLength);
            data.writeBuffer(spsItem.buffer);
        });

        data.writeUint8(this.ppsList.length);
        this.ppsList.forEach(ppsItem => {
            data.writeUint16(ppsItem.buffer.byteLength);
            data.writeBuffer(ppsItem.buffer);
        });
        return data;
    }
}
