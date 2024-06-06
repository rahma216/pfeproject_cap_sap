const cds = require('@sap/cds');
const fs = require('fs');
const { spawn } = require('child_process');

const os = require('os');
const archiver = require('archiver');
const path = require('path');
module.exports = cds.service.impl((srv) => {
  /*   srv.on('downloadZip', async (req) => {
        const folderPath = "/home/user/projects/pfe_rahma/srv/clientproject";
        const outputFilePath = path.resolve("/home/user/projects/pfe_rahma/PFE_Rahma.zip");

        try {
            await fs.promises.access(folderPath, fs.constants.F_OK);

            // Create a file to stream archive data to.
            const output = fs.createWriteStream(outputFilePath);
            const archive = archiver('zip', {
                zlib: { level: 9 } // Sets the compression level.
            });

            output.on('close', function() {
                console.log(archive.pointer() + ' total bytes');
                console.log('archiver has been finalized and the output file descriptor has closed.');
            });

            archive.on('warning', function(err) {
                if (err.code === 'ENOENT') {
                    console.warn('Warning:', err);
                } else {
                    throw err;
                }
            });

            archive.on('error', function(err) {
                throw err;
            });

            // Pipe archive data to the file
            archive.pipe(output);

            // Append files from a directory
            archive.directory(folderPath, false);

            // Finalize the archive
            await archive.finalize();

            // Respond with the path to the zip file
            return { zipPath: outputFilePath };

        } catch (err) {
            console.error('ZIP file not found:', err);
            req.error(404, `ZIP file not found: ${err.message}`);
        }
    }); */

   
    const clearFile = async (filePath) => {
      try {
        await fs.promises.writeFile(filePath, '', { flag: 'w' }); // Open file with 'w' to clear it
        console.log('File cleared successfully.');
      } catch (error) {
        console.error('Error clearing file:', error);
        throw error;
      }
    };
    
    // Service to append text to file
    srv.on('appendTextToFile', async (req) => {
      const { content } = req.data; // Correctly capture the 'content' from the request data
      const filePath = '/home/user/projects/pfe_rahma/clientproject/db/models.cds'; // Ensure this path is correct
    
      try {
        // Clear the file before appending
        await clearFile(filePath);
        
        // Append content to the file
        await fs.promises.writeFile(filePath, content + '\n', { flag: 'a' }); // Use 'a' flag to append to the file
        console.log('Data written to file successfully.');
        return { success: true };
      } catch (error) {
        console.error('Error appending to file:', error);
        return { success: false, error: error.message };
      }
    });
    
     // Service to append text to services.cds file
srv.on('appendServiceToFile', async (req) => {
  const { content } = req.data;
  const filePath = '/home/user/projects/pfe_rahma/clientproject/srv/services.cds';

  try {
    // Clear the file before appending
    await clearFile(filePath);

    // Append content to the file
    await fs.promises.writeFile(filePath, content + '\n', { flag: 'a' });
    console.log('Data written to file successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error appending to file:', error);
    return { success: false, error: error.message };
  }
});
      // Handle the ExecuteCommand event
      srv.on('ExecuteCommand', async (req) => {
        const { command } = req.data;
    
        try {
          // Execute the terminal command
          const output = await executeTerminalCommand(command);
          return { result: output };
        } catch (error) {
          console.error('Error executing command:', error);
          return { result: false, error: error.message };
        }
      });
    
      // Function to execute terminal commands
      async function executeTerminalCommand(command) {
        return new Promise((resolve, reject) => {
          const process = spawn(command, {
            shell: true, // Use the shell to interpret the command
            stdio: 'inherit' // Inherit stdio to see the output in the terminal
          });
    
          process.on('close', (code) => {
            if (code === 0) {
              console.log('Command executed successfully');
              resolve('Command executed successfully');
            } else {
              console.error(`Command failed with exit code ${code}`);
              reject(new Error(`Command failed with exit code ${code}`));
            }
          });
    
          process.on('error', (error) => {
            console.error('Failed to start subprocess.');
            reject(error);
          });
        });
      }



srv.on('appendUIToFile', async (req) => {
    try {
        // Read the value of "content" from the request body
        const data = req.data.content;

        //const filePath = '/home/user/projects/clientproject/app/project1/annotations.cds';
        const filePath = req.data.path ;

       
        // Write the value of "content" to the file
        await fs.promises.writeFile(filePath, data + '\n');

        console.log('Data written to file successfully.');
        return { success: true };
    } catch (error) {
        console.error('Error writing data to file:', error);
        return { success: false };
    }

});




});






 

 