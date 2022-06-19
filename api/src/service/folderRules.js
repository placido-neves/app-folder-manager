const fs = require('fs')
const path = require('path')
const rules = require('./rules')

function copyFolder(source, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    files = fs.readdirSync(source);

    files.forEach((file) => {
        var curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            copyFolder(curSource, path.join(dest, file)); source
        } else {
            fs.copyFileSync(path.join(source, file), path.join(dest, file), fs.constants.COPYFILE_EXCL)
        }
    })
}

function detailFolder(req, res) {
    var newDirectoryPath = path.join(req.body.path, req.body.name);
    (async () => {
        await rules.fileManagerDirectoryContent(req, res, newDirectoryPath).then(data => {
            response = { files: data };
            response = JSON.stringify(response);
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
        });
    })();
}

function moveFolder(source, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }
    files = fs.readdirSync(source);
    files.forEach(function (file) {
        var curSource = path.join(source, file);
        if (fs.lstatSync(curSource).isDirectory()) {
            moveFolder(curSource, path.join(dest, file));
            fs.rmdirSync(curSource);
        } else {
            fs.copyFileSync(path.join(source, file), path.join(dest, file), fs.constants.COPYFILE_EXCL);

            fs.unlinkSync(path.join(source, file), function (err) {
                if (err) throw err;
            });
        }
    });
}

function createFolder(req, res) {
    var newDirectoryPath = path.join(req.body.path, req.body.name);
    if (fs.existsSync(newDirectoryPath)) {
        var errorMsg = new Error();
        errorMsg.message = "A file or folder with the name " + req.body.name + " already exists.";
        errorMsg.code = "400";
        response = { error: errorMsg };

        response = JSON.stringify(response);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    } else {
        fs.mkdirSync(newDirectoryPath);
        (async () => {
            await rules.fileManagerDirectoryContent(req, res, newDirectoryPath).then(data => {
                response = { data };
                res.json(response);
            });
        })();
    }
}

function renameFolder(oldDirectoryPath, newDirectoryPath) {
    try {
        fs.renameSync(oldDirectoryPath, newDirectoryPath);
    }catch(e){
        console.log(e)
    }
}

function deleteFolder(req, res, contentRootPath) {
    var deleteFolderRecursive = function (path) {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach(function (file, index) {
                var curPath = path + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(path);
        }
    };
    var promiseList = [];
    for (var i = 0; i < req.body.names.length; i++) {
        var newDirectoryPath = path.join(contentRootPath + req.body.path, req.body.names[i]);

        promiseList.push(FileManagerDirectoryContent(req, res, newDirectoryPath));
    }
    Promise.all(promiseList).then(data => {
        data.forEach(function (files) {
            if (fs.lstatSync(path.join(contentRootPath + req.body.path, files.name)).isFile()) {
                fs.unlinkSync(path.join(contentRootPath + req.body.path, files.name));

            } else {
                deleteFolderRecursive(path.join(contentRootPath + req.body.path, files.name));
            }
        });
        response = { files: data };
        response = JSON.stringify(response);
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    });
}

module.exports = {
    copyFolder,
    moveFolder,
    createFolder,
    renameFolder,
    deleteFolder,
    detailFolder
}