const { exec } = require("child_process");
const path = require('path');
const fs = require('fs');

// Img assets base path
const directoryPath = path.join(__dirname, '/src/assets/images/backgrounds');
const grepCmd = 'grep -R --exclude-dir={node_modules,.git,.github,.vscode,.husky,stories,tests,_generated}';

let imgFiles = [];

const getFilesRecursively = (directory) => {
  const filesInDirectory = fs.readdirSync(directory);
  for (const file of filesInDirectory) {
    const absolute = path.join(directory, file);
    if (fs.statSync(absolute).isDirectory()) {
        getFilesRecursively(absolute);
    } else {
      imgFiles.push(absolute);
    }
  }
};

// Get all image files with full path
getFilesRecursively(directoryPath);

for (const imgFileWithPath of imgFiles) {

  // Extract file name from full path
  const fileNameOnly = path.basename(imgFileWithPath);

  exec(`${grepCmd} ${fileNameOnly} ./src`, (error, stdout, stderr) => {
    if (error) {
      //console.log(`error: ${error.message}`);

      const imgDir = path.dirname(imgFileWithPath);
      const deletedDir = `${imgDir}/deleted`;

      //console.log(deletedDir);
      //return;

      if (!fs.existsSync(deletedDir)){
        fs.mkdirSync(deletedDir);
      }

      try {
      
        const movedFileName = `${deletedDir}/${fileNameOnly}`;
        fs.rename(imgFileWithPath, movedFileName, function (err) {
          if (err) throw err
          console.log('Successfully moved!')
        })

        //fs.unlinkSync(imgFileWithPath);
        //console.log(`Removed: ${imgFileWithPath}`);
        //file removed
      } catch(err) {
        console.error(err)
      }

      return;
    }
    if (stderr) {
      //console.log(`stderr: ${stderr}`);
      return;
    }
    //console.log(`stdout: ${stdout}`);
    return;
  });  
}

