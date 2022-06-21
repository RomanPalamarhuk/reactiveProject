import EventSource from 'eventsource';
import { Timestamp } from 'mongodb';
import { getClient } from '../../dbClient/mongodb.js';

const URL = 'https://stream.wikimedia.org/v2/stream/recentchange';
const TIME_STAMPT = 10000;
const eventSourse = new EventSource(URL);


export function wikipediaListener() {
    let promise_to_Save = [];
    let recentTime = new Date().getTime();
    const stream_file = getClient().db().collection('users');
    eventSourse.onopen = () => {
        console.info('Opened Connection');
    }

    eventSourse.onerror = (event) => {
        console.log('Error', event);
    }
    eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        //console.log({ user: data.user, type: data.type, title: data.title, time: new Date(data.meta.dt) });
        var current_date = new Date(data.meta.dt);
        stream_file.insertOne({
            user: data.user, type: data.type, title: data.title,
            time: current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate()
        });
        // promise_to_Save.push(stream_file.insertOne({ user: data.user, type: data.type, title: data.title, 
        //     time: current_date.getFullYear() + '-' + (current_date.getMonth() + 1)+ '-' + current_date.getDate()}));
        //     if (new Date().getTime() - recentTime > TIME_STAMPT) {
        //         recentTime = new Date().getTime();
        //         let buffer = promise_to_Save;
        //         promise_to_Save = [];
        //         SaveToDb(buffer);
        //     }
        // }
    }
}

async function addData(data){
    
}
async function SaveToDb(buffer) {
    try {
        await Promise.allSettled(buffer);
    }
    catch (e) {
        console.log("Error" + e);
    }
}
// async function test() {
//     console.log("Test");
//     const c = getClient();
//     const users = c.db().collection('users');
//     const user = await users.findOne({ user: 'roman' });
//     let today = new Date();
//     let day = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
//     if (user === undefined || user === null) {
//         let mapS = new Map();
//         mapS["1"] = 1;
//         await users.insertOne({ user: "roman", date: day, count: 0, map: JSON.stringify(mapS)});
//     }
//     else {
//         console.log("1");
//         const myQuery =  {user: "roman", date: day};
//         console.log("2");
//         const newValues = { $set: {map: user.map["1"] + 1}};
//         console.log("3");
//         await users.updateOne(myQuery, newValues);
//     }
// }