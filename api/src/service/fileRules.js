const fs = require('fs')
const path = require('path')
const { copyFolder, moveFolder } = require('./folderRules')
const rules = require('./rules')

var copyName = "";
var isRenameChecking = false;

function moveFiles(req, res, contentRootPath) {
    var fileList = [];
    var replaceFileList = [];
    var permission; var pathPermission; var permissionDenied = false;
    pathPermission = rules.getPathPermission(req.path, false, req.body.targetData.name, contentRootPath + req.body.targetPath, contentRootPath, req.body.targetData.filterPath);
    req.body.data.forEach(function (item) {
        var fromPath = contentRootPath + item.filterPath;
        permission = rules.getPermission(fromPath, item.name, item.isFile, contentRootPath, item.filterPath);
        var fileAccessDenied = (permission != null && (!permission.read || !permission.write));
        var pathAccessDenied = (pathPermission != null && (!pathPermission.read || !pathPermission.writeContents));
        if (fileAccessDenied || pathAccessDenied) {
            permissionDenied = true;
            var errorMsg = new Error();
            errorMsg.message = fileAccessDenied ? ((permission.message !== "") ? permission.message :
                item.name + " is not accessible. You need permission to perform the write action.") :
                ((pathPermission.message !== "") ? pathPermission.message :
                    req.body.targetData.name + " is not accessible. You need permission to perform the writeContents action.");
            errorMsg.code = "401";
            response = { error: errorMsg };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    });
    if (!permissionDenied) {
        req.body.data.forEach(function (item) {
            var fromPath = contentRootPath + item.filterPath + item.name;
            var toPath = contentRootPath + req.body.targetPath + item.name;
            rules.checkForFileUpdate(fromPath, toPath, item, contentRootPath, req);
            if (!isRenameChecking) {
                toPath = contentRootPath + req.body.targetPath + copyName;
                if (item.isFile) {
                    var source = fs.createReadStream(path.join(fromPath));
                    var desti = fs.createWriteStream(path.join(toPath));
                    source.pipe(desti);
                    source.on('end', function () {
                        fs.unlinkSync(path.join(fromPath), function (err) {
                            if (err) throw err;
                        });
                    });
                }
                else {
                    moveFolder(fromPath, toPath);
                    fs.rmdirSync(fromPath);
                }
                var list = item;
                list.name = copyName;
                list.filterPath = req.body.targetPath;
                fileList.push(list);
            } else {
                replaceFileList.push(item.name);
            }
        });
        if (replaceFileList.length == 0) {
            copyName = "";
            response = { files: fileList };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
        else {
            isRenameChecking = false;
            var errorMsg = new Error();
            errorMsg.message = "File Already Exists.";
            errorMsg.code = "400";
            errorMsg.fileExists = replaceFileList;
            response = { error: errorMsg, files: [] };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    }
}

function copyFiles(req, res, contentRootPath) {
    var fileList = [];
    var replaceFileList = [];
    var permission; var pathPermission; var permissionDenied = false;
    pathPermission = rules.getPathPermission(req.path, false, req.body.targetData.name, contentRootPath + req.body.targetPath, contentRootPath, req.body.targetData.filterPath);
    req.body.data.forEach(function (item) {
        var fromPath = contentRootPath + item.filterPath;
        permission = rules.getPermission(fromPath, item.name, item.isFile, contentRootPath, item.filterPath);
        var fileAccessDenied = (permission != null && (!permission.read || !permission.copy));
        var pathAccessDenied = (pathPermission != null && (!pathPermission.read || !pathPermission.writeContents));
        if (fileAccessDenied || pathAccessDenied) {
            permissionDenied = true;
            var errorMsg = new Error();
            errorMsg.message = fileAccessDenied ? ((permission.message !== "") ? permission.message :
                item.name + " is not accessible. You need permission to perform the copy action.") :
                ((pathPermission.message !== "") ? pathPermission.message :
                    req.body.targetData.name + " is not accessible. You need permission to perform the writeContents action.");
            errorMsg.code = "401";
            response = { error: errorMsg };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    });
    if (!permissionDenied) {
        req.body.data.forEach(function (item) {
            var fromPath = contentRootPath + item.filterPath + item.name;
            var toPath = contentRootPath + req.body.targetPath + item.name;
            rules.checkForFileUpdate(fromPath, toPath, item, contentRootPath, req);
            if (!isRenameChecking) {
                toPath = contentRootPath + req.body.targetPath + copyName;
                if (item.isFile) {
                    fs.copyFileSync(path.join(fromPath), path.join(toPath), (err) => {
                        if (err) throw err;
                    });
                }
                else {
                    copyFolder(fromPath, toPath)
                }
                var list = item;
                list.filterPath = req.body.targetPath;
                list.name = copyName;
                fileList.push(list);
            } else {
                replaceFileList.push(item.name);
            }
        });
        if (replaceFileList.length == 0) {
            copyName = "";
            response = { files: fileList };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        } else {
            isRenameChecking = false;
            var errorMsg = new Error();
            errorMsg.message = "File Already Exists.";
            errorMsg.code = "400";
            errorMsg.fileExists = replaceFileList;
            response = { error: errorMsg, files: [] };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        }
    }
}

function getFileDetails(filepath) {
        return new Promise((resolve, reject) => {
            var cwd = {};
            fs.stat(filepath, function (err, stats) {
                cwd.name = path.basename(filepath);
                cwd.local = filepath;
                cwd.size = rules.getSize(stats.size);
                cwd.modified = stats.ctime;
                cwd.created = stats.mtime;

                resolve(cwd);
            });
        });
  
}

function checkForFileUpdate(fromPath, toPath, item, contentRootPath, req) {
    var count = 1;
    var name = copyName = item.name;
    if (fromPath == toPath) {
        if (rules.checkForDuplicates(contentRootPath + req.body.targetPath, name, item.isFile)) {
            rules.updateCopyName(contentRootPath + req.body.targetPath, name, count, item.isFile);
        }
    } else {
        if (req.body.renameFiles.length > 0 && req.body.renameFiles.indexOf(item.name) >= 0) {
            rules.updateCopyName(contentRootPath + req.body.targetPath, name, count, item.isFile);
        } else {
            if (rules.checkForDuplicates(contentRootPath + req.body.targetPath, name, item.isFile)) {
                isRenameChecking = true;
            }
        }
    }
}

module.exports = {
    moveFiles,
    copyFiles,
    getFileDetails,
    checkForFileUpdate,
}