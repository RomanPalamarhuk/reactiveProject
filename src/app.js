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
