const vilogiService = require('../services/vilogiService');
const json2csv = require('json2csv').parse;
const coproService = require('../services/coproService');
const mondayService = require('../services/mondayService');
const scriptService = require('../services/scriptService');
const mondayVilogiSyncService = require('../services/mondayVilogiSyncService');
const logs = require('../services/logs');
const fs = require('fs');
const boardId = 1436546197;
const typeData="contratAssurance"

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let FinalContrat = [];

const contratAssurance = {
    start: async () => {
        logs.logExecution("synchroContratAssurance")
        console.log('Start Extraction ...');
        
        const LogId = await scriptService.logScriptStart('synchroContratAssurance');
        try {
            let copros = await coproService.listCopropriete();
            let FinalContrat = [];  // Initialize FinalContrat array
            let TotalContrat=0
            //const data = await mondayService.getItemsDetails(1466840974);
            //console.log(data)

            for (const copro of copros) {
                console.log("ID Vilogi:", copro.idCopro);
                if (copro.idVilogi !== undefined) {
                    let contrats = await vilogiService.getCoproContratAssurance(copro.idVilogi);
                    //console.log(contrats);

                    let NbContrat=0
                    
                    for (const contrat of contrats) {
                        // Define a regular expression pattern to match the desired format
                        const regex = /^(\d+)-(.*)$/;
                        
                        const match = contrat.assureur.match(regex);
                        let infoFournisseur = {};
                    
                        if (match) {
                            // Extract the numbers from the match
                            const fournisseurID = match[1];
                            infoFournisseur = await vilogiService.getPrestataireById(fournisseurID, copro.idVilogi);
                        } else {
                            //console.log("Invalid format for contrat.fournisseur");
                        }
                        if (infoFournisseur === undefined){
                            console.log("Break");
                            break;
                        }else{

                        }
                        NbContrat++
                        TotalContrat++
                        console.log(` Contrat numero ${TotalContrat}   Sync contrat Number :${contrat.id}   ---- ${copro.idCopro} -  [${NbContrat}   /  ${contrats.length}] `)  
                        const columnValues = {
                            texte5: contrat.typecontrat,
                            //statut_1: contrat.typecontrat,
                            //texte_3: contrat.contrat,
                            //texte__1: contrat.description,
                            date__1: {"date" : contrat.dateeffet.split('/').reverse().join('-')},
                            date_1__1: {"date" : contrat.dateecheance.split('/').reverse().join('-')},
                            //texte_2: contrat.police,
                            texte_6: contrat.assureur,
                            //texte_7: contrat.id,
                            texte_8: contrat.compagnie,
                            chiffres: contrat.prime,
                            texte_10: contrat.compteCharge,
                            e_mail8__1:infoFournisseur.email,
                            ...(infoFournisseur.telephone != null && infoFournisseur!== undefined && { t_l_phone__1:  {"phone" :infoFournisseur.telephone, "countryShortName" : "FR"}}),
                            //date_2__1: {"date" : contrat.datefin.split('/').reverse().join('-')},
                            //texte_12: contrat.idFichier,
                            ...(copro.idMonday != null && { board_relation5: { "item_ids": [copro.idMonday] } }),
                          };
                          
                          
                          const itemName = `Contrat d'assurance - ${copro.idCopro} - ${contrat.assureur}`;//
                          
                          try {
                            await saveMonday(itemName,columnValues,contrat.id)
                            await delay(200)
                          } catch (error) {
                            console.error("Erreur lors de la création de l'élément:", error);
                          }
                        
                    }
                    
                }
            }
            //console.log(FinalContrat)
            await scriptService.updateLogStatus('synchroContratAssurance',LogId ,2 ,"Script executed successfully");
            
            console.log('--------------------------------------------------------------------------------------------END Extraction ...');
        } catch (error) {
            console.error('An error occurred:', error.message);
        }
    }
};



async function saveMonday(itemName,data,idVilogi) {
    try {
        const checkValue= await mondayVilogiSyncService.getItemsByInfo(boardId,idVilogi)
        console.log(checkValue)
        if(checkValue.length > 0){
            console.log("Already exist")
            const newItem = await mondayService.updateItem(boardId, checkValue[0].mondayItenID, data);
        }else{
            const newItem = await mondayService.createItem(boardId, itemName, data);
            //console.log("Nouvel élément créé:", newItem);
            const dataMongo={
                boardID:boardId,
                mondayItenID:newItem.id,
                vilogiEndpoint:typeData,
                //vilogiEndpointData:mandat,
                vilogiItemID:idVilogi

            }
            mondayVilogiSyncService.addItem(dataMongo)
        }
        await delay(300);
        //monday.api(`mutation {change_multiple_column_values(item_id:${newItem.id},board_id:${boardId}, column_values: \"{\\\"board_relation\\\" : {\\\"item_ids\\\" : [${copro.idMonday}]}}\") {id}}` )
      } catch (error) {
        console.error("Erreur lors de la création de l'élément:", error);
      }
}



//extraction des contrat par copro

module.exports = contratAssurance;
