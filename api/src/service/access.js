class AccessDetails {
    constructor(role, rules) {
        this.role = role;
        this.rules = rules;
    }
}

class AccessPermission {
    constructor(read, write, writeContents, copy, download, upload, message) {
        this.read = read;
        this.write = write;
        this.writeContents = writeContents;
        this.copy = copy;
        this.download = download;
        this.upload = upload;
        this.message = message
    }
}

class AccessRules {
    constructor(path, role, read, write, writeContents, copy, download, upload, isFile, message) {
        this.path = path;
        this.role = role;
        this.read = read;
        this.write = write;
        this.writeContents = writeContents;
        this.copy = copy;
        this.download = download;
        this.upload = upload;
        this.isFile = isFile;
        this.message = message
    }
}

module.exports = {AccessDetails,AccessPermission,AccessRules}