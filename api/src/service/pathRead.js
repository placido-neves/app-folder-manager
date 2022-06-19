const fs = require('fs')

const list = (dir) => {
   try {
      folder = []
      files = []

      let listofdir = fs.readdirSync(dir);
      for (let k in listofdir) {
         let stat = fs.statSync(dir + '/' + listofdir[k]);
         if (stat.isDirectory()) {
            if (listofdir[k][0] !== ".") {
               folder.push(listofdir[k])
            }
         }
         else {
            if (listofdir[k][0] !== ".") {
               files.push(listofdir[k]);
            }
         }
      }
      return { file: files, folder: folder };
   } catch (error) {
      console.log(error)
   }

}

module.exports = list