const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Path to the file
const orderNumberFile = path.join(__dirname, 'currentOrderNumber.txt');
const logfile = path.join(__dirname, 'logs.txt');

const delay = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(null), time)
    })
}

//manually declare all accounts that need to claim orders
const accounts = [
    {
        username: "jh1",
        token: "c5dee42bb4134abb69445057dcd5e52392e930fd5fd41254b6fb3ab4d3b4781e",
        claimCount: 0
    },
    {
        username: "jh2",
        token: "4910aed489e3954298467a9fd389ace404fdb5f9f0f4147fdb3dd38d8863209e",
        claimCount: 0
    },
    {
        username: "jh3",
        token: "4910aed489e3954298467a9fd389ace404fdb5f9f0f4147fdb3dd38d8863209e",
        claimCount: 0
    },
    {
        username: "jh5",
        token: "75ad48b4e1eae63b8d9d4e5e0f576963e25a731d876b13bae9a79b467d300fdc",
        claimCount: 0
    },
    {
        username: "brian",
        token: "77aa401d254507852f731eb2a5c6439f5fce6694e4a38dbc407f0dfb4eb3870a",
        claimCount: 0
    }
    
];

// Read the file
fs.readFile(orderNumberFile, 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }    

    let currentOrderNumber = parseInt(data, 10);

    for(const account of accounts){
        console.log("CLAIMING FOR " + account.username)
        // let claimCount = 0;
        while (account.claimCount < 2) {
            currentOrderNumber++;
            console.log("CLAIMING " + currentOrderNumber.toString());
            account.claimCount += await claimHeyboReward(account.username, account.token, currentOrderNumber);
            // account.claimCount += getRandomCase();
            console.log(`CURRENT CLAIM COUNT FOR ${account.username} IS ${account.claimCount}`);
            await delay(1000);
        }
        // claimCount = 0;
    }

    writeTofile(orderNumberFile, currentOrderNumber);
    
});

//returns 1 if there is a succesful claim, and 0 if there is no succesful claim
async function claimHeyboReward(username, token, orderNumber) {
    const url = 'https://heybros.fly.dev/express-redeem';
    const requestBody = {
        userName: username,
        code: "HEY-" + orderNumber,
        token: token
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `5l4w` // token authorization
            }
        })

        if (response.status == 200) {
            return 1;
        } 

    } catch (error) {
        console.log(error.response.data);
        if(error.response.data == "Receipt already scanned."){
            return 0;
        }  else if (error.response.data == "Too many receipts scanned"){
            return 3;
        } else {
            writeTofile(logfile, error.response.data);
        }
        
        return 0;
    }
}

// write to ordernumber OR logfile
function writeTofile(filePath, message){

    if(typeof(message) != String) {
        message = message.toString();
    }
    console.log("writing " + message + " to file");

    fs.writeFileSync(filePath, message.toString() + "\n", 'utf8', (writeErr) => {
        if (writeErr) {
            console.error('Error writing file:', writeErr);
            return;
        }
    });
    
}

// function getRandomCase() {
//     // Generate a random number between 0 and 1
//     const randomNumber = Math.random();

//     if (randomNumber < 0.4) {
//         // 40% chance for case 1
//         return 1;
//     } else if (randomNumber < 0.95) {
//         // Additional 40% chance for case 2, making it 40% overall
//         return 0;
//     } else {
//         // Remaining 20% chance for case 3
//         return 3;
//     }
// }