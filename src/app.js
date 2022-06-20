import express from 'express';
import userRouter from '../routes/users.js';
import { getClient, startConnection } from '../dbClient/mongodb.js';
import { wikipediaListener } from '../controllers/stream-reader/wikimediaListener.js';
//import  EventSource  from 'eventsource';

const app = express();
const PORT = 3000;;

app.listen(PORT, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is running on port ${PORT}...`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
const client = getClient();
startConnection(client);
//wikipediaListener();
// test();


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