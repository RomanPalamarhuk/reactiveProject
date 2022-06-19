import express from 'express';
import userRouter from '../routes/users.js';
import { getClient, startConnection } from '../dbClient/mongodb.js';
const app = express();
const PORT = 3000;
const connectionString = 'mongodb://localhost:27017';

app.listen(PORT, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is running on port ${PORT}...`);
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(userRouter);
const client = getClient(connectionString);
startConnection(client);