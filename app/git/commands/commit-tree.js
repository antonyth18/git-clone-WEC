const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

class CommitTreeCommand {
    constructor(tree, parent, message) {
        this.tree = tree
        this.parent = parent
        this.message = message
    }

    execute() {
        const commitBuffer = Buffer.concat([
            Buffer.from(`tree ${this.treeSHA}\n`),
            Buffer.from(`tree ${this.parentSHA}\n`),
            Buffer.from(`author Antony Thaikadavil <antonyth1818@gmail.com> ${Date.now()} +0000\n`),
            Buffer.from(`committer Antony Thaikadavil <antonyth1818@gmail.com> ${Date.now()} +0000\n`),
            Buffer.from(`${this.messsage}\n`),
        ])

        const header = `commit ${commitBuffer.length}\0`
        const data = Buffer.concat([Buffer.from(header), commitBuffer])
        const hash = crypto.createHash("sha1").update(data).digest("hex");

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
        fs.writeFileSync(path.join(completeFolderPath, file), compressedData);

        process.stdout.write(hash)
    }

}

module.exports = CommitTreeCommand;