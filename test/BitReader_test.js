import BitReader from '../src/BitReader';
import assert from 'assert';

describe('BitReader', () => {
    describe('Exponential-Golomb Codes', () => {
        var readUGolomb = (bitPattern) => {
            var reader = new BitReader(new Uint8Array([parseInt(bitPattern, 2) << (8 - bitPattern.length)]));
            return reader.readUGolomb();
        };
        it('Unsigned 1', () => assert.equal(readUGolomb('1'), 0));
        it('Unsigned 010', () => assert.equal(readUGolomb('010'), 1));
        it('Unsigned 011', () => assert.equal(readUGolomb('011'), 2));
        it('Unsigned 00100', () => assert.equal(readUGolomb('00100'), 3));
        it('Unsigned 00101', () => assert.equal(readUGolomb('00101'), 4));
        it('Unsigned 00110', () => assert.equal(readUGolomb('00110'), 5));
        it('Unsigned 00111', () => assert.equal(readUGolomb('00111'), 6));
        it('Unsigned 0001000', () => assert.equal(readUGolomb('0001000'), 7));
        it('Unsigned 0001001', () => assert.equal(readUGolomb('0001001'), 8));
        it('Unsigned 0001010', () => assert.equal(readUGolomb('0001010'), 9));
        it('Unsigned 0001011', () => assert.equal(readUGolomb('0001011'), 10));
        it('Unsigned 0001100', () => assert.equal(readUGolomb('0001100'), 11));
    })
});
