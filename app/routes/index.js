const bluebird = require('bluebird');
const path = require('path');
const fs = require('fs');

const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => res.send('Welcome to Dasa API'));

// Dynamically create REST routes
const directoryPath = path.join(__dirname, '../controllers');

const readdirPromise = bluebird.promisify(fs.readdir);

readdirPromise(directoryPath)
.then((filenames) => {
  
  filenames.forEach((filename) => { 
    const matches = filename.match(/^([\w\_]+).js$/);
  
    if (!matches) {
      return;
    }
  
    const controllerName = matches[1];
    const controller = require(`../controllers/${controllerName}`);
    
    router.post(`/${controllerName}`, controller.createRequest);
    router.get(`/${controllerName}`, controller.readRequest);
    router.get(`/${controllerName}/:id`, controller.readRequest);
    router.put(`/${controllerName}/:id`, controller.updateRequest);
    router.delete(`/${controllerName}/:id`, controller.deleteRequest);
  });
});

module.exports = router;