const fs = require('fs')
const path = require('path')
const access = require('./access')

var accessDetails = null;
const pattern = /(\.\.\/)/g;
var size = 0;

function replaceRequestParams(req, res) {
    req.body.path = (req.body.path && req.body.path.replace(pattern, ""));
}

function hasPermission(rule) {
    return ((rule == undefined) || (rule == null) || (rule == Permission.Allow)) ? true : false;
}

function getMessage(rule) {
    return ((rule.message == undefined) || (rule.message == null)) ? "" : rule.message;
}

function updateRules(filePermission, accessRule) {
    filePermission.download = hasPermission(accessRule.read) && hasPermission(accessRule.download);
    filePermission.write = hasPermission(accessRule.read) && hasPermission(accessRule.write);
    filePermission.writeContents = hasPermission(accessRule.read) && hasPermission(accessRule.writeContents);
    filePermission.copy = hasPermission(accessRule.read) && hasPermission(accessRule.copy);
    filePermission.read = hasPermission(accessRule.read);
    filePermission.upload = hasPermission(accessRule.read) && hasPermission(accessRule.upload);
    filePermission.message = getMessage(accessRule);
    return filePermission;
}

function getPathPermission(path, isFile, name, filepath, contentRootPath, filterPath) {
    return getPermission(filepath, name, isFile, contentRootPath, filterPath);
}

function getPermission(filepath, name, isFile, contentRootPath, filterPath) {
    var filePermission = new access.AccessPermission(true, true, true, true, true, true, "");
    if (accessDetails == null) {
        return null;
    } else {
        accessDetails.rules.forEach(function (accessRule) {
            if (isFile && accessRule.isFile) {
                var nameExtension = name.substr(name.lastIndexOf("."), name.length - 1).toLowerCase();
                var fileName = name.substr(0, name.lastIndexOf("."));
                var currentPath = contentRootPath + filterPath;
                if (accessRule.isFile && isFile && accessRule.path != "" && accessRule.path != null && (accessRule.role == null || accessRule.role == accessDetails.role)) {
                    if (accessRule.path.indexOf("*.*") > -1) {
                        var parentPath = accessRule.path.substr(0, accessRule.path.indexOf("*.*"));
                        if (currentPath.indexOf(contentRootPath + parentPath) == 0 || parentPath == "") {
                            filePermission = updateRules(filePermission, accessRule);
                        }
                    }
                    else if (accessRule.path.indexOf("*.") > -1) {
                        var pathExtension = accessRule.path.substr(accessRule.path.lastIndexOf("."), accessRule.path.length - 1).toLowerCase();
                        var parentPath = accessRule.path.substr(0, accessRule.path.indexOf("*."));
                        if (((contentRootPath + parentPath) == currentPath || parentPath == "") && nameExtension == pathExtension) {
                            filePermission = updateRules(filePermission, accessRule);
                        }
                    }
                    else if (accessRule.path.indexOf(".*") > -1) {
                        var pathName = accessRule.path.substr(0, accessRule.path.lastIndexOf(".")).substr(accessRule.path.lastIndexOf("/") + 1, accessRule.path.length - 1);
                        var parentPath = accessRule.path.substr(0, accessRule.path.indexOf(pathName + ".*"));
                        if (((contentRootPath + parentPath) == currentPath || parentPath == "") && fileName == pathName) {
                            filePermission = updateRules(filePermission, accessRule);
                        }
                    }
                    else if (contentRootPath + accessRule.path == filepath) {
                        filePermission = updateRules(filePermission, accessRule);
                    }
                }
            } else {
                if (!accessRule.isFile && !isFile && accessRule.path != null && (accessRule.role == null || accessRule.role == accessDetails.role)) {
                    var parentFolderpath = contentRootPath + filterPath;
                    if (accessRule.path.indexOf("*") > -1) {
                        var parentPath = accessRule.path.substr(0, accessRule.path.indexOf("*"));
                        if (((parentFolderpath + (parentFolderpath[parentFolderpath.length - 1] == "/" ? "" : "/") + name).lastIndexOf(contentRootPath + parentPath) == 0) || parentPath == "") {
                            filePermission = updateRules(filePermission, accessRule);
                        }
                    } else if (path.join(contentRootPath, accessRule.path) == path.join(parentFolderpath, name) || path.join(contentRootPath, accessRule.path) == path.join(parentFolderpath, name + "/")) {
                        filePermission = updateRules(filePermission, accessRule);
                    }
                    else if (path.join(parentFolderpath, name).lastIndexOf(path.join(contentRootPath, accessRule.path)) == 0) {
                        filePermission.write = hasPermission(accessRule.writeContents);
                        filePermission.writeContents = hasPermission(accessRule.writeContents);
                        filePermission.message = getMessage(accessRule);
                    }
                }
            }
        });
        return filePermission;
    }
}

function getSize(size) {
    var hz;
    if (size < 1024) hz = size + ' B';
    else if (size < 1024 * 1024) hz = (size / 1024).toFixed(2) + ' KB';
    else if (size < 1024 * 1024 * 1024) hz = (size / 1024 / 1024).toFixed(2) + ' MB';
    else hz = (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
    return hz;
}

function fileManagerDirectoryContent(req, res, filepath) {
    var contentRootPath;
    if (req.path == "/") {
        contentRootPath = filepath;
    } else {
        contentRootPath = filepath.substring(0, (filepath.indexOf(req.body.path)));
    }

    return new Promise((resolve, reject) => {
        var cwd = {};
        fs.stat(filepath, function (err, stats) {
            cwd.name = path.basename(filepath);
            cwd.local = filepath;
            cwd.size = getSize(stats.size);
            cwd.modified = stats.ctime;
            cwd.created = stats.mtime;
            resolve(cwd);
        });
    });
}

function checkForDuplicates(directory, name, isFile) {
    var filenames = fs.readdirSync(directory);
    if (filenames.indexOf(name) == -1) {
        return false;
    } else {
        for (var i = 0; i < filenames.length; i++) {
            if (filenames[i] === name) {
                if (!isFile && fs.lstatSync(directory + "/" + filenames[i]).isDirectory()) {
                    return true;
                } else if (isFile && !fs.lstatSync(directory + "/" + filenames[i]).isDirectory()) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
}

function getFiles(req, res) {
    return new Promise((resolve, reject) => {
        fs.readdir(contentRootPath + req.body.path.replace(pattern, ""), function (err, files) {
            //handling error
            if (err) {
                console.log(err);
                reject(err);

            } else
                resolve(files);
        });
    });
}

function getFolderSize(req, res, directory, sizeValue) {
    size = sizeValue;
    var filenames = fs.readdirSync(directory);
    for (var i = 0; i < filenames.length; i++) {
        if (fs.lstatSync(directory + "/" + filenames[i]).isDirectory()) {
            getFolderSize(req, res, directory + "/" + filenames[i], size);
        } else {
            const stats = fs.statSync(directory + "/" + filenames[i]);
            size = size + stats.size;
        }
    }
}

function checkForMultipleLocations(req, contentRootPath) {
    var previousLocation = "";
    var isMultipleLocation = false;
    req.body.data.forEach(function (item) {
        if (previousLocation == "") {
            previousLocation = item.filterPath;
            location = item.filterPath;
        } else if (previousLocation == item.filterPath && !isMultipleLocation) {
            isMultipleLocation = false;
            location = item.filterPath;
        } else {
            isMultipleLocation = true;
            location = "Various Location";
        }
    });
    if (!isMultipleLocation) {
        location = contentRootPath.split("/")[contentRootPath.split("/").length - 1] + location.substr(0, location.length - 2);
    }
    return isMultipleLocation;
}

function updateCopyName(path, name, count, isFile) {
    var subName = "", extension = "";
    if (isFile) {
        extension = name.substr(name.lastIndexOf('.'), name.length - 1);
        subName = name.substr(0, name.lastIndexOf('.'));
    }
    copyName = !isFile ? name + "(" + count + ")" : (subName + "(" + count + ")" + extension);
    if (checkForDuplicates(path, copyName, isFile)) {
        count = count + 1;
        updateCopyName(path, name, count, isFile);
    }
}

module.exports = {
    hasPermission,
    getMessage,
    updateRules,
    getPathPermission,
    getPermission,
    getSize,
    fileManagerDirectoryContent,
    checkForDuplicates,
    getFiles,
    getFolderSize,
    updateCopyName,
    checkForDuplicates,
    size,
}