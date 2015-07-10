var Box = require('../Box');

export default class free extends Box {
    constructor() {
        super('free');
    }
    boxLength() {
        return 8;
    }
    write() {
        return super.write();
    }
}
