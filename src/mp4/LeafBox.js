var Box = require('./Box');

export default class LeafBox extends Box {
    constructor(name, atoms) {
        super(name);
        this.atoms = atoms;
    }
    boxLength() {
        return Box.leafLength(this.atoms);
    }

    getBoxes(name) {
        var foundAtoms = [];
        this.atoms.forEach(atom => {
            if (atom.name === name) {
                foundAtoms.push(atom);
            } else if (atom instanceof LeafBox) {
                var childAtoms = atom.getBoxes(name);
                if (childAtoms.length) {
                    foundAtoms.splice(foundAtoms.length, 0, ...childAtoms);
                }
            }
        });

        return foundAtoms;
    }

    writeAtoms(atoms, data) {
        atoms.reduce((position, atom) => {
            data.view.set(atom.write().view, position);
            return position + atom.boxLength();
        }, 8);
        return data;
    }

    write() {
        return this.writeAtoms(this.atoms, super.write());
    }

    static read(media, reader, leafLength) {
        return Box.read(media, reader);
    }
}
