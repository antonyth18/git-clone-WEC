const AddCommand = require('./add');
const CatFileCommand = require('./cat-file');
const GitClient = require('./client');
const CommitTreeCommand = require('./commit-tree');
const HashObjectCommand = require('./hash-object');
const LSTreeCommand = require('./ls-tree');
const WriteTreeCommand = require('./write-tree');

module.exports = {
    CatFileCommand,
    GitClient,
    HashObjectCommand,
    LSTreeCommand,
    WriteTreeCommand,
    CommitTreeCommand,
    AddCommand
}