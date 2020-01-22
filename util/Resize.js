
const sharp = require('sharp');
const path = require('path');


class Resize {
    constructor(folder, filename) {
        this.folder = folder;
        this.filename = filename;
    }
    async save(buffer) {
        const filename = this.filename;
        const file_path = this.file_path(filename);

        await sharp(buffer)
            .resize({
                fit: sharp.fit.inside,
                withoutEnlargement: true
            })
            .toFile(file_path);
        return filename;
    }
    file_path(filename) {
        console.warn(`${this.folder}/${filename}`);
        return path.resolve(`${this.folder}/${filename}`)
    }
}
module.exports = Resize;