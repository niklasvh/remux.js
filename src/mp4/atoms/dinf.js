var LeafBox = require('../LeafBox');
var dref = require('./dref');

export default class dinf extends LeafBox {
    constructor() {
        super('dinf', [
            new dref()
        ]);
    }
}
