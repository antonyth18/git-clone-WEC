# Mini-Git CLI: A Custom Git Implementation

This project is a rudimentary command-line Git client built from scratch in Node.js. Its purpose is to implement the core mechanics of Git's immutable object model and history tracking, providing direct hands-on experience with how modern version control systems work under the hood.

The design is modular, with each core Git concept (like object hashing, tree creation, and commit finalization) separated into its own command class.

## Implemented Functionality

The client supports both high-level user commands (init, add) and the low-level object management commands that constitute the Git core.

| Command | Type | Description |
| --- | --- | --- |
| node main.js init | High-Level | Initializes a new, empty Git repository (.git directory) in the current directory, setting up the objects, refs, and HEAD files. |
| node main.js add <file> | High-Level | Adds specified files to the staging area. This command internally uses hash-object -w to create Blob objects and updates the local index file (.git/index.json). |
| node main.js commit-tree | Low-Level | Creates the final Commit Object. It takes a Tree SHA, an optional Parent Commit SHA, and the commit message, bundles them together, hashes the result, writes the new commit object, and updates the branch reference (.git/refs/heads/main). |
| node main.js hash-object -w <file> | Low-Level | Computes the SHA-1 hash for the given file's contents, formats it as a blob object, and writes the compressed object to the .git/objects directory. |
| node main.js write-tree | Low-Level | Creates a Tree Object based on the files currently registered in the staging area (.git/index.json). It recursively processes directories and files, creating nested Tree objects as necessary, and returns the top-level Tree SHA. |
| node main.js cat-file -p <sha> | Inspection | Reads and decompresses a Git object (Blob, Tree, or Commit) from the database and prints its human-readable contents to stdout. |
| node main.js ls-tree <sha> | Inspection | Displays the contents of a Tree object, listing its mode, type, and name (similar to ls-tree --name-only). |

## Architecture Overview

The project is structured around a Command Pattern using Node.js classes, where each class implements an execute() method to perform its specific task.

.  
├── main.js             # CLI entry point; handles argument parsing and command routing  
├── git/  
│   ├── index.js        # Command module index (bundles all command classes for main.js)  
│   ├── client.js       # Simple GitClient wrapper to run commands  
│   ├── add.js          # Logic for the \`add\` command (uses hash-object)  
│   ├── commit-tree.js  # Logic for creating the Commit object (includes message and history)  
│   ├── write-tree.js   # Logic for creating the Tree object (handles file/directory hierarchy)  
│   ├── hash-object.js  # Core logic for creating Blob objects (hashing and zlib compression)  
│   ├── cat-file.js     # Logic for inspecting object contents  
│   └── ls-tree.js      # Logic for listing contents of a Tree object  
└── ...                 # Other support files  
  
  
  

### Key Object Model Implementation Details

*   Hashing: Uses Node's built-in crypto module to generate SHA-1 hashes for all Git objects (Blobs, Trees, and Commits).
    
*   Object Storage: Objects are compressed using Zlib and stored in the standard Git format: .git/objects/XX/XXXX...
    
*   Tree Objects: The write-tree.js implements the recursive creation of Tree objects, correctly linking the hierarchical state of the repository.
    
*   Commit Objects: The commit-tree.js correctly links the Tree snapshot, the Parent Commit, and includes the Commit Message as an immutable part of the commit object's content.
    

## Setup and Execution

### Prerequisites

*   Node.js (v14+)
    

### Installation

1.  Clone the repository:  
    git clone <your-repo-link>  
    cd mini-git-cli  
      
      
    
2.  Install dependencies (if any are used, e.g., for Zlib/Crypto) and run commands via Node.
    

### Usage Example

To execute a command, call node server.js <command> <arguments>:

1.  Initialize the Repository:  
    node server.js init  
      
      
    
2.  Create a File and Add it to Staging:  
    echo "Hello Git" > file.txt  
    node server.js add file.txt  
    \# Internally runs: hash-object -w file.txt  
      
      
    
3.  Create the Tree Object (Snapshot):  
    node server.js write-tree  
    \# Output: <Tree\_SHA>  
      
      
    
4.  Create the Commit Object (History):  
    \# Assuming the Tree\_SHA from above is 6a4f5b... and this is the first commit (no parent)  
    node server.js commit-tree 6a4f5b... -m "Initial commit of file.txt"  
    \# Output: <Commit\_SHA>  
      
      
    

## Key Takeaways and Conclusion

This project is an exceptional showcase of deep understanding by simulating Git's core behavior. You've successfully built a foundational Git client by directly implementing the low-level object model.

The modular structure, the correct use of SHA-1 hashing, and the inclusion of advanced commands like write-tree and commit-tree demonstrate a deep, practical grasp of Git's internals, especially how the immutable object graph is constructed to track history. This serves as a fantastic foundation for further expanding your custom version control tool.
