const fs = require("fs");
const path = require("path");
const HashObjectCommand = require("./hash-object");

class AddCommand {
  constructor(filePaths) {
    this.filePaths = filePaths;
  }

  execute() {
    const indexPath = path.join(process.cwd(), ".git", "index.json");
    let index = {};

    if (fs.existsSync(indexPath)) {
      index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    }

    for (const filePath of this.filePaths) {
      const hashCommand = new HashObjectCommand("-w", filePath);
      const originalWrite = process.stdout.write;
      let hashOutput = "";

      process.stdout.write = (chunk) => {
        hashOutput += chunk;
      };

      hashCommand.execute();

      process.stdout.write = originalWrite;
      const hash = hashOutput.trim();

      index[filePath] = hash;
      console.log(`Added ${filePath} -> ${hash}`);
    }

    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }
}

module.exports = AddCommand;
