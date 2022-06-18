import express from 'express';

const app = express();
const PORT = 3000;

app.listen(PORT, err => {
    if(err) {
        return console.error(err);
    }
    return console.log(`server is running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('Time for reactive programming!');
});