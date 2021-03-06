import { MongoClient } from 'mongodb';

const connenctionString = 'mongodb://localhost:27017/testdb';
const collectionsNames = ['dataStream', 'users'];
export function getLocalClient(){
    return new MongoClient(connenctionString);
}
export async function startLocalConnection(client) {
    try {
        await client.connect();
        console.log("Connection good");
        await createCollections(collectionsNames);
    } catch (e) {
        console.error("Start local connection" + e);
    }
}

async function createCollections(namesList){
    try{
        const db = getLocalClient().db();
        let promiseArray = [];
        collectionsNames.forEach(e => {
            promiseArray.push(db.createCollection(e));
        });
        await Promise.allSettled(promiseArray);
    }
    catch (e){
        console.log("Error: happened" + e);
    }
}