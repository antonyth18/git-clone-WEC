const path = require('path')
const fs = require('fs')
const zlib = require('zlib')
const crypto = require('crypto');

class HashObjectCommand {
    constructor(flag, filepath) {
        this.flag = flag;
        this.filepath = filepath
    }

    execute() {
        const flag = this.flag;
        const filepath = path.resolve(this.filepath);

        if(!fs.existsSync(filepath))
            throw new Error(`could not open '${this.filepath}' for reading: No such file or directory`)

        const fileContents = fs.readFileSync(filepath);
        const fileLength = fileContents.length;

        const header = `blob ${fileLength}\0`
        const blob = Buffer.concat([Buffer.from(header), fileContents]);

        const hash = crypto.createHash("sha1").update(blob).digest("hex");

        if(this.flag === '-w') {
            const folder = hash.slice(0, 2);
            const file = hash.slice(2);

            const completeFolderPath = path.join(
                process.cwd(), 
                '.git',
                'objects',
                folder
            );

            fs.mkdirSync(completeFolderPath, { recursive: true });

            const compressedData = zlib.deflateSync(blob);
            fs.writeFileSync(path.join(completeFolderPath, file), compressedData)
        }

        process.stdout.write(hash + '\n');
    }
}

module.exports = HashObjectCommand;