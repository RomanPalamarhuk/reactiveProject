import express from'express';
import path from 'path';
import userRouter  from '../routes/users.js';

const app = express();
const PORT = 3000;
const PAGE_DIR = 'public/index.html';
app.listen(PORT, err => {
    if(err) {
        return console.error(err);
    }
    return console.log(`server is running on port ${PORT}...`);
});
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// all bottom is test
app.use(express.static(path.resolve('static')));



app.use(userRouter);

app.get('/api/:version', (req, res) => {
    res.send(req.params.version);
});