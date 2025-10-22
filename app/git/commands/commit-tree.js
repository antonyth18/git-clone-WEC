const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const zlib = require('zlib');

class CommitTreeCommand {
  constructor(tree, parent, message) {
    this.tree = tree;
    this.parent = parent;
    this.message = message;
  }

  execute() {
    let commitData = `tree ${this.tree}\n`;
    if (this.parent) commitData += `parent ${this.parent}\n`;

    const author = `Antony Thaikadavil <antonyth1818@gmail.com>`;
    const timestamp = Math.floor(Date.now() / 1000);
    const timezone = "+0530";

    commitData += `author ${author} ${timestamp} ${timezone}\n`;
    commitData += `committer ${author} ${timestamp} ${timezone}\n`;
    commitData += `\n${this.message}\n`;

    const header = `commit ${commitData.length}\0`;
    const data = Buffer.concat([Buffer.from(header), Buffer.from(commitData)]);

    const hash = crypto.createHash("sha1").update(data).digest("hex");
    const folder = hash.slice(0, 2);
    const file = hash.slice(2);

    const objectDir = path.join(process.cwd(), '.git', 'objects', folder);
    fs.mkdirSync(objectDir, { recursive: true });

    const compressed = zlib.deflateSync(data);
    fs.writeFileSync(path.join(objectDir, file), compressed);

    process.stdout.write(hash + '\n');

    const headRef = path.join(process.cwd(), '.git', 'HEAD');
    const ref = fs.readFileSync(headRef, 'utf-8').trim();

    if (ref.startsWith('ref:')) {
    const refPath = path.join(process.cwd(), '.git', ref.slice(5));
    fs.writeFileSync(refPath, hash);
    } else {
    fs.writeFileSync(headRef, hash);
    }

    return hash;
  }
}

module.exports = CommitTreeCommand;
