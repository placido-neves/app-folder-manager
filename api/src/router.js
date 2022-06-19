const router = require("express").Router();

const {
    listControl,

    getFileDetailsControl,

    copyFolderControl,
    moveFolderControl,
    createFolderControl,
    detailFolderControl,
    renameFolderControl

} = require('./controller')

router.get('/main', (req, res) => {
    console.log('ola mundo')
    res.json({ path: '/home/placido' })
})

router.post('/', listControl)


router.post('/detailFile', getFileDetailsControl)

router.post('/moveFolder', moveFolderControl)
router.post('/copyFolder', copyFolderControl)
router.post('/createFolder', createFolderControl)
router.post('/detailFolder', detailFolderControl)
router.put('/renameFolder', renameFolderControl)

module.exports = router 