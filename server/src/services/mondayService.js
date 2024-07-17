// mondayService.js
const mondaySdk = require("monday-sdk-js");
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const logFilePath = path.join(__dirname, '../../logs/logsMonday.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' }); // 'a' means append




// Initialize Monday SDK
const monday = mondaySdk();
monday.setApiVersion("2023-10");
monday.setToken(process.env.MONDAY_API_KEY)

async function executeGraphQLQuery(queryString) {
  try {
      console.log(queryString)
      const res = await monday.api(queryString);
      console.log(res);
      return res.data ;
    

    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        const errorMessages = error.response.data.errors.map(err => err.message).join(', ');
        throw new Error(`Error executing GraphQL query: ${errorMessages}`);
      } else {
        let errorMessage = 'Error executing GraphQL query:';
        if (error.response) {
          errorMessage += ` Status Code: ${error.response.status},`;
          if (error.response.data && error.response.data.error_message) {
            errorMessage += ` Error Message: ${error.response.data.error_message},`;
          }
          if (error.response.data && error.response.data.error_code) {
            errorMessage += ` Error Code: ${error.response.data.error_code},`;
            // Handling specific error codes
            if (error.response.data.error_code === 'InvalidColumnIdException') {
              // Handle InvalidColumnIdException here
              errorMessage += ` Invalid Column ID: ${error.response.data.error_data.column_id},`;
              errorMessage += ` Error Reason: ${error.response.data.error_data.error_reason},`;
            }
            // Add more conditions for other error codes if needed
          }
          if (error.response.data && error.response.data.error_data) {
            errorMessage += ` Error Data: ${JSON.stringify(error.response.data.error_data)},`;
          }
        } else {
          errorMessage += ` ${error.message}`;
        }
        throw new Error(errorMessage);
      }
    }
  }
let cachedItemFields;

async function fetchItemFields() {

  cachedItemFields="";      
const introspectionQuery = `query IntrospectionQuery {__schema {types {namefields {nametype {nameofType {name}}}}}}`;
 const introspectionResult = await monday.api(introspectionQuery);
  console.log(introspectionResult)
  const itemFields = introspectionResult.data.__schema.types.find(type => type.name === 'Item').fields;
  console.log(itemFields)
  cachedItemFields = itemFields.map(field => field.name);

  return cachedItemFields;
}

// Function to get all items in a board
async function getItems(boardId) {
  try {
    const query = `query { boards(ids: ${boardId}) { items_page (limit: 300) { cursor items { id  name  } } } }`;
    result=await executeGraphQLQuery(query)
    //console.log(result.boards[0].items_page.items)
    return result.boards[0].items_page.items
  } catch (error) {
    throw new Error('Error fetching items:', error.message);
  }
}

async function getItemsGroup(boardId,groupID) {
  try {
    const query = `query { boards(ids: ${boardId}) { items_page (limit: 300) { cursor items { id  name group {id title }  } } } }`;
    result=await executeGraphQLQuery(query)
    //console.log(result.boards[0].items_page.items)
    return result.boards[0].items_page.items
  } catch (error) {
    throw new Error('Error fetching items:', error.message);
  }
}
async function getItemsDetails(itemID) {
  try {
    //await fetchItemFields()
    const query = `query { items(ids: ${itemID}) { id name column_values {column {id  title}  id type value    }} }`;
    const result = await executeGraphQLQuery(query);
    //console.log("name : ",result.items[0].name)
    //console.log("values : ",result.items[0].column_values[0].value)
    for(column in result.items[0].column_values)
    //console.log("ColumnID : ",result.items[0].column_values[column].id,"                 Column : ",result.items[0].column_values[column].column.title,"                  Value : " ,result.items[0].column_values[column].value)
    //console.log(result.items[0])
    //console.log("---------------------------")
    return result.items[0];
  } catch (error) {
    throw new Error('Error fetching items:', error.message);
  }
}


async function getItemInBoardWhereName(name, boardID) {
  try {
    // Query to fetch the item based on its name within the specified board
    const query = `query { boards(ids: ${boardID}) { id state items_page(limit: 1, query_params: { rules: [{ column_id: \"name\", compare_value:  \"${name}\"}] }) { items { id name } } } }`;

    // Execute the query
    const response = await executeGraphQLQuery(query);

    
      // Return the first item found (assuming unique names)
      return response.boards[0].items_page.items[0];

  } catch (error) {
    // Handle any errors
    console.error("Error fetching item:", error);
    throw error;
  }
}

// Function to create a new item in a board
async function createItem(boardId, itemName, columnValues) {
  try {
    const query = `mutation {
      create_item (
        board_id: ${boardId},
        item_name: "${removeFrenchSpecialCharacters(itemName)}",
        column_values: "${JSON.stringify(columnValues).replace(/"/g, '\\"')}"
      ) {id name}}`;
    const response = await executeGraphQLQuery(query);
    return response.create_item;
  } catch (error) {
    logExecution(`Error creating item ${itemId}`)
    throw new Error('Error creating item:',itemName, error.message);
  }
}

// Function to create a new item in a board
async function updateItem(boardId, itemId, columnValues) {
  try {
    // Remove occurrences of /r/n from columnValues
    const cleanedColumnValues = JSON.stringify(columnValues).replace(/\\r\\n/g, '');

    const columnValuesString = cleanedColumnValues.replace(/"/g, '\\"');
    const query = `mutation {
      change_multiple_column_values (
        item_id: ${itemId},
        board_id: ${boardId},
        column_values: "${columnValuesString}"
      ) {
        id
      }
    }`;
    const response = await executeGraphQLQuery(query);
    console.log(response)
    return await response.change_multiple_column_values;
  } catch (error) {
    logExecution(`Error updating item ${itemId}`)
    throw new Error(`Error updating item ${itemId}: ${error.message}`);
  }
}

// Function to create a subitem under a parent item
async function createSubitem(parentItemId, subitemName) {
  try {
    const query = `mutation { create_subitem (parent_item_id: ${parentItemId}, item_name: "${subitemName}") { id name } }`;
    const response = await monday.api(query);
    return response.data.create_subitem;
  } catch (error) {
    throw new Error('Error creating subitem:', error.message);
  }
}

async function createGroup(boardId,groupName){
  try {
    const response = await monday.api(`mutation {create_group (board_id:  ${boardId}, group_name: "${removeFrenchSpecialCharacters(groupName)}") {id}}`);
    return response.data.create_subitem;
  } catch (error) {
    throw new Error('Error creating subitem:', error.message);
  }
}
async function uploadFileToMonday(filePath,ITEM_ID,COLUMN_ID) {
  const form = new FormData();
  const fileStream = fs.createReadStream(filePath);
  
  form.append('variables[file]', fileStream);
  form.append('query', `
      mutation ($file: File!) {
          add_file_to_column (
              file: $file,
              item_id: ${ITEM_ID},
              column_id: "${COLUMN_ID}"
          ) {
              id
          }
      }
  `);

  try {
    const response = await axios.post('https://api.monday.com/v2/file', form, {
      headers: {
          ...form.getHeaders(),
          Authorization: process.env.MONDAY_API_KEY
      },
      maxContentLength: Infinity, // Allow large content length
      maxBodyLength: Infinity, // Allow large body length
      timeout: 300000 // 5 minutes timeout
  });

  console.log('File uploaded successfully:', response.data);
  } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
  }
}

function removeFrenchSpecialCharacters(inputString) {
  // Define the regular expression pattern to match French special characters
  //const frenchSpecialCharactersRegex = /[ÀÁÂÃÄÅàáâãäåÇçÈÉÊËèéêëÌÍÎÏìíîïÑñÒÓÔÕÖØòóôõöøÙÚÛÜùúûüÝýÿ]/g;
  
  // Remove the French special characters using the replace method with an empty string
  const cleanedString = inputString.replace(/"/g, '\\"');

  return cleanedString;
}
async function logExecution(...args) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} ${args.join(' ')}\n`;
  logStream.write(logMessage);
  process.stdout.write(logMessage); // Optional: Write to the console as well
}


module.exports = {
  executeGraphQLQuery,
  getItems,
  getItemsGroup,
  getItemsDetails,
  getItemInBoardWhereName,
  createGroup,
  createItem,
  createSubitem,
  updateItem,
  uploadFileToMonday,
};
