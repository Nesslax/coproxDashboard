// Import required modules
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const MongoDB = require('../utils/mongodb');
mongoose.set('useFindAndModify', false);
require('dotenv').config(); // Import dotenv to load environment variables from .env file

async function connectAndExecute(callback) {
    try {
      await MongoDB.connectToDatabase();
      const result = await callback();
      return result;
    } catch (error) {
      console.error('Error connecting and executing:', error.message);
      throw error;
    } 
  }

  router.get('/', async (req, res) => {
    const scriptName = req.params.scriptName;

    // Update script state to 1 (started) in the database
    try {
        return connectAndExecute(async () => {
            console.log(scriptName)
            const coproprieteCollection = MongoDB.getCollection('ScriptState');
            const scriptArray= await coproprieteCollection.find({}).toArray();

            scriptArray.forEach(script => {
              if (script.execution_history && script.execution_history.length > 0) {
                  const lastExecution = script.execution_history[script.execution_history.length - 1].endTime;
                  script.lastExecution = lastExecution;
                  delete script.execution_history;
              }
          });
 
            console.log(scriptArray);
            res.status(200).json(scriptArray);
            return
          });
        
    } catch (error) {
        res.status(500).send(`Error setting ${scriptName} script state to started: ${error}`);
    }
});

// Define routes to start a script
router.get('/:scriptName', async (req, res) => {
    const scriptName = req.params.scriptName;

    // Update script state to 1 (started) in the database
    try {
        return connectAndExecute(async () => {
            console.log(scriptName)
            const coproprieteCollection = MongoDB.getCollection('ScriptState');
            res.send(`${scriptName} script state set to started`);
            data={ status: 1 }
            return await coproprieteCollection.findOneAndUpdate({ name: scriptName },{ $set: data },);
          });
        
    } catch (error) {
        res.status(500).send(`Error setting ${scriptName} script state to started: ${error}`);
    }
});

module.exports = router;