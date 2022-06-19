import { MongoClient } from 'mongodb';

export function getClient(connectionString){
    return new MongoClient(connectionString);
}
export async function startConnection(client) {
    try {
        await client.connect();
        console.log("Connection good")
    } catch (e) {
        console.error(e);
    }
}