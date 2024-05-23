#! /usr/bin/env node

// Import modules
const program = require('minimist');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

/**
 * Capture the args
 */
const argv = require('minimist')(process.argv);
let writeTo = argv['w'];

// If write to isn't provided show error;
if (!writeTo) {
  process.exitCode = 1;
  throw new Error('No path to write to provided');
} else {
  writeTo = writeTo.trim();
}

// Build path to package.json
const pathToPckgJson = path.format({
  dir: process.cwd(),
  base: 'package.json'
});

/**
 * Main function to run tasks
 */
function main() {
  // Check if package.json exists
  fs.access(pathToPckgJson, (err) => {
    // If package.json doesn't exist
    if (err) {
      process.exitCode  = 1;
      throw new Error('Something went wrong. Package.json is missing or cannot be accessed!');
    } else {
      // File exists
      // Read the package.json
      fs.readFile(pathToPckgJson, (err, data) => {
        if (err) {
          process.exitCode = 1;
          throw new Error('Cannot read file.');
        }

        // It's successful and can be read
        // Store the data 
        const pckgJson = JSON.parse(data);
        const version = pckgJson.version;

        // call make directory with version
        makeDirectory(version);

      })
    }
  })
}

function makeDirectory(version) {
  const writeToPath = path.resolve(writeTo);

  fs.stat(writeToPath, (err, stats) => {
    // This means it doesn't exist
    if (err) {
      // Try to create directory and call callback
      mkdirp(writeTo, (err) => {
        // If it cannot create the directory
        if (err) {
          process.exitCode = 1
          throw new Error('Could not create the directory');
        }
        // Else write file
        writeFile(writeToPath, version);
      })
    } else {
      // It exists call Write file
      writeFile(writeToPath, version);
    }
  })
}

function writeFile(writeToPath, version) {
  const payload = {"APP_VERSION": `${version}`};
  // Construct the final path
  const finalPath = path.format({
    dir: writeToPath,
    base: 'app-version.json'
  });

  // Write the new file
  fs.writeFile(finalPath, JSON.stringify(payload),'utf8', (err) => {
    if (err) {
      process.exitCode = 1;
      throw new Error('Failed to write to app-version.json');
    } else {
      console.log('Version transfer successful :-)');
    }
  })
}

// Run the App
main();

