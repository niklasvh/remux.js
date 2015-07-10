var assert = require('assert');
var PSI = require('./PSI');
var PA = require('./PA');

const TABLE_ID = 0;

export default class PAT extends PSI {
    constructor() {
        super();
        this.programAssociationList = [];
    }

    getPMTPID() {
        if (this.programAssociationList.length) {
            return this.programAssociationList[0].programMapPID;
        }

        return null;
    }

    readBuffer(bitReader) {
        super.readBuffer(bitReader);
        assert.equal(this.tableId, TABLE_ID);
        assert.equal((this.sectionLength % 4), 0);
        var pmtPidCount = (this.sectionLength - 4) / 4;
        assert.equal(pmtPidCount <= 1, true);
        assert.equal(this.sectionSyntaxIndicator, 1);
        for (var k = 0; k < pmtPidCount; k++) {
            this.programAssociationList.push(PA.parse(bitReader));
        }
    }
}
