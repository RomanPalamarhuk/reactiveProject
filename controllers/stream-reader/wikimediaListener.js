import EventSource from 'eventsource';
import { getClient } from '../../dbClient/mongodb.js';

const URL = 'https://stream.wikimedia.org/v2/stream/recentchange';
const eventSourse = new EventSource(URL);


export function wikipediaListener() {
    eventSourse.onopen = () => {
        console.info('Opened Connection');
    }

    eventSourse.onerror = (event) => {
        console.log('Error', event);
    }
    eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        let current_date = new Date(data.meta.dt);
        if (data.bot === false) {
            addData({
                user: data.user, type: data.type, title: data.title,
                time: current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate()
            });
        }
    }
}

async function addData(data) {
    const users = getClient().db().collection('users');
    const User = await users.findOne({ user: data.user, date: data.time});
    console.log({ user: data.user, date: data.time, type: data.type, title: data.title });
    console.log(User);
    if (User === null) {
        console.log("ZZZZZZZZZZZZZZZZZZZZZZZZZ");
        let types_map = new Map();
        types_map[data.type] = 0;
        let titles_map = new Map();
        titles_map[data.title] = 0;
        await users.insertOne({ user: data.user, date: data.time, type: types_map, title: titles_map });
    }
    else {
        const myQuery = { user: data.user, date: data.time};
        let types_map = User.type;
        if(types_map[data.type] === null || types_map[data.type] === undefined){
            types_map[data.type] = 0;
        }
        types_map[data.type] += 1;
        let titles_map = User.title;
        if(titles_map[data.title] === null || titles_map[data.title] === undefined){
            titles_map[data.title] = 0;
        }
        titles_map[data.title] += 1;

        const newValues = { $set: { type: types_map, title: titles_map}};
        console.log("MAMU EBAL");
        //console.log(User.count + 1);
        var resp = await users.updateOne(myQuery, newValues);
        console.log(resp);
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