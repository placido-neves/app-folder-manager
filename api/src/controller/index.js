const multer = require('multer')
const path = require('path')
const {
    moveFiles,
    copyFiles,
    getFileDetails,
    checkForFileUpdate } = require('../service/fileRules')

const {
    copyFolder,
    moveFolder,
    createFolder,
    renameFolder,
    deleteFolder,
    detailFolder } = require('../service/folderRules')
const list = require('../service/pathRead')


async function listControl(req, res) {
    const path = req.body.path
    return res.json(list(path))
}


function getFileDetailsControl(req, res) {
    const filePath = req.body.path
    getFileDetails(filePath).then(data => {
        res.json(data)
    })
}


function copyFolderControl(req, res) {
    const source = req.body.source
    const dest = req.body.dest
    copyFolder(source, dest)
    return res.json({ ok: true })
}
function moveFolderControl(req, res) {
    const source = req.body.source
    const dest = req.body.dest
    moveFolder(source, dest)
    return res.json({ ok: 'ok' })
}
function createFolderControl(req, res) {
    createFolder(req, res)
}
function detailFolderControl(req, res) {
    detailFolder(req, res)
}
function renameFolderControl(req, res) {
    var oldName = path.join(req.body.path, req.body.name);
    var newName = path.join(req.body.path, req.body.newName);
    renameFolder(oldName,newName)
    res.json({ok:"ok"})
}

module.exports = {
    listControl,

    getFileDetailsControl,

    copyFolderControl,
    moveFolderControl,
    createFolderControl,
    detailFolderControl,
    renameFolderControl

}