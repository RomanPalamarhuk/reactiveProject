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
wikipediaListener();
// test();

// async function test() {
//     const users = getClient().db().collection('users');
//     const User = await users.findOne({ user: "Vojtěch Dostál", date: "2022-6-21", type: "edit"});
//     console.log(User.count);
//     const myQuery = { user: "Vojtěch Dostál", date: "2022-6-21", type: "edit" };
//     const newValues = { $set: { count: User.count + 1 } };
//     let r = await users.updateOne(myQuery, newValues);
//     console.log(r);
// }
// Rosguill