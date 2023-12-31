const zendeskController = require('../controllers/zendeskController');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const zendeskTicket = {
    start: async () => {
        console.log('Zendesk ticket start ...');

        try {
            // Call controller function to fetch tickets
            const tickets = await zendeskController.getTicketsNew({}, {
                // Mock Express.js response object
                status: function (code) {
                    this.statusCode = code;
                    return this; // Return itself for method chaining
                },
                json: async data => {
                    // Call getUserFromID for each ticket
                    
                    for (const ticket of data) {
                        //console.log(ticket.requester_id);
                         console.log('Ticket ID in start:',ticket.id)
                        await processUserTags(ticket.id,ticket.requester_id);
                    }
                },
                // ... other Express.js response methods that you might use
            });

            // Add your additional synchronization logic here, using the fetched tickets data
        } catch (error) {
            // Handle errors
            console.error('Error fetching tickets:', error.message);
        }
    },
};

async function processUserTags(ticket_id, requesterId) {
    //console.log('Ticket ID in processUserTags:', ticket_id);
    const user = await zendeskController.getUserFromID({ params: { ID: requesterId } }, {
        // Mock Express.js response object for getUserFromID
        status: function (code) {
            this.statusCode = code;
            return this; // Return itself for method chaining
        },
        json: async data => {
            const userTags = data[0].tags;
            console.log(userTags);

            if (userTags && userTags.length > 0) {
                // If user tags are not empty, perform actions
                checkAndPerformAction(ticket_id, userTags);

            }
        },
        // ... other Express.js response methods that you might use
    });
}


async function checkAndPerformAction(ticket_id, tags) {
    console.log('starting with tags: ', tags);
    console.log()
    body={ticket: {tags: tags}};
    params ={  ticket_id: ticket_id, tagToAdd: tags};

    
    zendeskController.updateTicket({ params});
    // Use Promise.all to wait for all updateTicket promises to complete
    await Promise.all(tags.map(async (tag) => {
        console.log('------------------------------------------- here is the tag', tag, '------------------for ticket', ticket_id);
  
        switch (tag) {
            
            case 'cs':
                console.log('cs')
            case 'locataire':
                console.log('locataire')    
            default:
                // Default case if the tag is not matched
                return Promise.resolve(); // Resolve with a promise for default case
        }
    }));
}

module.exports = zendeskTicket;
