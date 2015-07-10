import BitReader from '../../BitReader';
import assert from 'assert';

export default class SequenceParameterSet {
    constructor() {
        this.profile_idc = null;
        this.constraint_set0_flag = null;
        this.constraint_set1_flag = null;
        this.constraint_set2_flag = null;
        this.constraint_set3_flag = null;
        this.constraint_set4_flag = null;
        this.level_idc = null;
        this.seq_parameter_set_id = null;
        this.log2_max_frame_num_minus4 = null;
        this.pic_order_cnt_type = null;
        this.log2_max_pic_order_cnt_lsb_minus4 = null;
        this.max_num_ref_frames = null;
        this.gaps_in_frame_num_value_allowed_flag = null;
        this.pic_width_in_mbs_minus1 = null;
        this.pic_height_in_map_units_minus1 = null;
        this.frame_mbs_only_flag = null;
        this.mb_adaptive_frame_field_flag = null;
        this.direct_8x8_inference_flag = null;
        this.frame_cropping_flag = null;
        this.frame_crop_left_offset = 0;
        this.frame_crop_right_offset = 0;
        this.frame_crop_top_offset = 0;
        this.frame_crop_bottom_offset = 0;
    }

    read(buffer) {
        var reader = new BitReader(buffer);
        reader.skipBits(8);
        this.profile_idc = reader.readBits(8);
        this.constraint_set0_flag = reader.readBits(1);
        this.constraint_set1_flag = reader.readBits(1);
        this.constraint_set2_flag = reader.readBits(1);
        this.constraint_set3_flag = reader.readBits(1);
        this.constraint_set4_flag = reader.readBits(1);
        assert.equal(reader.readBits(3), 0);
        this.level_idc = reader.readBits(8);
        this.seq_parameter_set_id = reader.readUGolomb();
        if ([100, 110, 122, 244, 44, 83, 86, 118].indexOf(this.profile_idc) !== -1) {
            assert.fail('Unsupported sps profile idc');
        }

        this.log2_max_frame_num_minus4 = reader.readUGolomb();
        this.pic_order_cnt_type = reader.readUGolomb();

        if (this.pic_order_cnt_type === 0) {
            this.log2_max_pic_order_cnt_lsb_minus4 = reader.readUGolomb();
        } else if (this.pic_order_cnt_type === 1) {
            assert.fail(this.pic_order_cnt_type, 'Unsupported sps pic_order_cnt_type value');
        }
        this.max_num_ref_frames = reader.readUGolomb();
        this.gaps_in_frame_num_value_allowed_flag = reader.readBits(1);
        this.pic_width_in_mbs_minus1 = reader.readUGolomb();
        this.pic_height_in_map_units_minus1 = reader.readUGolomb();
        this.frame_mbs_only_flag = reader.readBits(1);
        if (!this.frame_mbs_only_flag) {
            this.mb_adaptive_frame_field_flag = reader.readBits(1);
        }
        this.direct_8x8_inference_flag = reader.readBits(1);
        this.frame_cropping_flag = reader.readBits(1);
        if (this.frame_cropping_flag) {
            this.frame_crop_left_offset = reader.readUGolomb();
            this.frame_crop_right_offset = reader.readUGolomb();
            this.frame_crop_top_offset = reader.readUGolomb();
            this.frame_crop_bottom_offset = reader.readUGolomb();
        }
    }

    static getDimensions(sps) {
        return {
            width: ((sps.pic_width_in_mbs_minus1 +1)*16) - (sps.frame_crop_right_offset * 2) - (sps.frame_crop_left_offset * 2),
            height: ((2 - sps.frame_mbs_only_flag) * (sps.pic_height_in_map_units_minus1 + 1) * 16) - (sps.frame_crop_bottom_offset * 2) - (sps.frame_crop_top_offset * 2)
        }
    }

    static parse(buffer) {
        var sps = new SequenceParameterSet();
        sps.read(buffer);
        return sps;
    }
}
