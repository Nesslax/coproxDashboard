const axios = require('axios');
require('dotenv').config();
const fs = require('fs');
const path = require('path');
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const apiUrl = 'https://copro.vilogi.com/rest'; // Update with the correct base URL

const authenticateUser = async () => {
  const loginEndpoint = '/connexionMulti'; // Update with the correct login endpoint

  try {
    const response = await axios.post(`${apiUrl}${loginEndpoint}?token=${process.env.VILOGI_TOKEN}`, {
      login: process.env.VILOGI_USERNAME,
      pwd: process.env.VILOGI_PASSWORD,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const connection = async () => {
  const coproEndpoint = `/adherant/copro?token=${process.env.VILOGI_TOKEN}&idCopro=${process.env.VILOGI_IDCOPROEXEMPLE}&idAdh=${process.env.VILOGI_IDAUTH}`;

  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const postAdherant = async () => {
  const coproEndpoint = `/adherant/copro?token=${process.env.VILOGI_TOKEN}&idCopro=${process.env.VILOGI_IDCOPROEXEMPLE}&idAdh=${process.env.VILOGI_IDAUTH}`;

  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const putAdherant = async () => {
  const coproEndpoint = `/SyndicInfo/copro?token=${process.env.VILOGI_TOKEN}&idCopro=${process.env.VILOGI_IDCOPROEXEMPLE}&idAdh=${process.env.VILOGI_IDAUTH}`;

  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getAllCopros = async () => {
  const coproEndpoint = `/SyndicInfo/copro?token=${process.env.VILOGI_TOKEN}&idCopro=${process.env.VILOGI_IDCOPROEXEMPLE}&idAdh=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getCoproData = async (coproID) => {
  const mergedData = {};
  const coproEndpoint1 = `/copro?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  //const coproEndpoint3= `/copro/donneeTechnique?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  try {
    const response1 = await axios.get(`${apiUrl}${coproEndpoint1}`);
    await delay(300)
    //const response3 = await axios.get(`${apiUrl}${coproEndpoint3}`);
    Object.assign(mergedData, response1.data);
    //Object.assign(mergedData, response3.data);

    return mergedData;
  } catch (error) {
    throw error;
  }
};
const getCoproDataTech = async (coproID) => {
  const mergedData = {};
  const coproEndpoint3= `/copro/donneeTechnique?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  try {
    await delay(300)
    const response3 = await axios.get(`${apiUrl}${coproEndpoint3}`);
    Object.assign(mergedData, response3.data);

    return mergedData;
  } catch (error) {
    throw error;
  }
};

const getCoproTravaux = async (coproID) => {
  const coproEndpoint = `/travaux?token=${process.env.VILOGI_TOKEN}&idCopro=${coproID}&idAdh=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getCoproContratEntretien = async (coproID) => {
  const coproEndpoint = `/contratEntretien?token=${process.env.VILOGI_TOKEN}&idCopro=${coproID}&idAdh=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getCoproManda = async (coproID) => {
  const coproEndpoint = `/mandatSyndic?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getCoproExercice = async (coproID) => {
  const coproEndpoint = `/exercice?token=${process.env.VILOGI_TOKEN}&copro=${coproID}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


const getRapprochemetBancaire = async (coproID) => {
  const coproEndpoint = `/rapprochements?token=${process.env.VILOGI_TOKEN}&copro=${coproID}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getbudgetComptebyDate = async (coproID,compte,date) => {
  const coproEndpoint = `/andecriture/soldeBalance?token=${process.env.VILOGI_TOKEN}&idCopro=${coproID}&compte=${compte}&dateSolde=${date}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getbudgetCopro = async (coproID,exerciceID) => {
  const coproEndpoint = `/budgets?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&exercice=${exerciceID}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getecritureComptableCompte = async (coproID,compte) => {
  const coproEndpoint = `/andecriture/list?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&withCompte=${compte}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};



const getCoproContratAssurance = async (coproID) => {
  const coproEndpoint = `/assurances?token=${process.env.VILOGI_TOKEN}&idCopro=${coproID}&idAdh=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios.get(`${apiUrl}${coproEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getCoproContratEntretienFichier = async (fichierID, coproID, outputFileName) => {
  const coproEndpoint = `/contratEntretien/getFile/${fichierID}?token=${process.env.VILOGI_TOKEN}&idCopro=${coproID}&idAdh=${process.env.VILOGI_IDAUTH}`;
  try {
    const response = await axios({
      method: 'get',
      url: `${apiUrl}${coproEndpoint}`,
      responseType: 'stream',
    });

    // Ensure the directory exists
    const outputDir = path.dirname(outputFileName);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const writer = fs.createWriteStream(outputFileName);
    // Pipe the response stream to a file
    response.data.pipe(writer);

    // Wait for the file to be fully written
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve); // Resolve the promise when the stream finishes
      writer.on('error', (err) => {
        // Delete the file if an error occurs and reject the promise
        fs.unlink(outputFileName, () => reject(err));
      });
    });

    console.log('File downloaded successfully:', outputFileName);
  } catch (error) {
    console.error('Error downloading file:', error.message);
  }
};


const getPrestataires = async (coproID) => {
  const coproEndpoint = `/professionnel?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  try { 
    //console.log(`${apiUrl}${coproEndpoint}`)
    const pros = await axios.get(`${apiUrl}${coproEndpoint}`);
    return pros.data;
  } catch (error) {
    throw error;
  }
};

const getPrestataireById = async (prestaireID,coproID) => {
  //const coproEndpoint = `/professionnel/idProfessionnel=${prestaireID}?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  const coproEndpoint = `/professionnel?token=${process.env.VILOGI_TOKEN}&copro=${coproID}&id=${process.env.VILOGI_IDAUTH}`;
  
  try { 
    //console.log(`${apiUrl}${coproEndpoint}`)
    const pros = await axios.get(`${apiUrl}${coproEndpoint}`);
    //console.log(pros.data)
    for(const pro in pros.data){
      //console.log(pros.data[pro])
      if(prestaireID.includes(pros.data[pro].idCompte)){
        //console.log(pros.data[pro])
        return pros.data[pro];
      }
        
    }
  } catch (error) {
    throw error;
  }
};


const getCoproAssemblee = async (coproID) => {
  const adherentsEndpoint = `/adherant/all?token=${process.env.VILOGI_TOKEN}&idAdh=${process.env.VILOGI_IDAUTH}&idCopro=${coproID}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllAdherents = async (coproID) => {
  const adherentsEndpoint = `/adherant/all?token=${process.env.VILOGI_TOKEN}&idAdh=${process.env.VILOGI_IDAUTH}&idCopro=${coproID}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getpayementAdherant = async (idAdh,coproID) => {
  const adherentsEndpoint = `/suiviPaiment?token=${process.env.VILOGI_TOKEN}&idAdh=${idAdh}&idCopro=${coproID}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getRelanceAdherant = async (idAdh,coproID) => {
  const adherentsEndpoint = `/relances?token=${process.env.VILOGI_TOKEN}&idAdherant=${idAdh}&copro=${coproID}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getUserHasMessage = async (idAdh,coproID) => {
  const adherentsEndpoint = `/odsmessage?token=${process.env.VILOGI_TOKEN}&idAdh=${idAdh}&idCopro=${coproID}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserMessagePushLu = async (idMessage,idAdh,coproID) => {
  const adherentsEndpoint = `/odsmessage/setLu?token=${process.env.VILOGI_TOKEN}&idAdh=${idAdh}&idCopro=${coproID}&idEvent=${idMessage}`;

  try {
    const response = await axios.get(`${apiUrl}${adherentsEndpoint}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  authenticateUser,
  postAdherant,
  putAdherant,
  getAllCopros,
  getCoproData,
  getCoproDataTech,
  getCoproTravaux,
  getCoproExercice,
  getecritureComptableCompte,
  getRapprochemetBancaire,
  getCoproContratAssurance,
  getCoproContratEntretien,
  getCoproContratEntretienFichier,
  getbudgetComptebyDate,
  getbudgetCopro,
  getPrestataires,
  getPrestataireById,
  getCoproAssemblee,
  getCoproManda,
  getAllAdherents,
  getpayementAdherant,
  getRelanceAdherant,
  getUserHasMessage,
  getUserMessagePushLu  
};
