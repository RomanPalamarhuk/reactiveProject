import { Router } from 'express';
import { getLocalClient } from '../dbClient/mongodb.js';
const userRouter = Router();

userRouter.get('/api/usertoday/:name', async (req, res) => {
    try {
        const users = getLocalClient().db().collection('users');
        let current_date = new Date();
        let today = current_date.getFullYear() + '-' + (current_date.getMonth() + 1) + '-' + current_date.getDate();
        const user = await users.findOne({ user: req.params.name, date: today });
        let numberOfactions = 0;
        let mapType = new Map(Object.entries(user.type));
        if (user !== null && user !== undefined) {
            for (const [key, value] of mapType) {
                numberOfactions += value;
            }
        }
        res.status(200).json({ user: user, totalActions: numberOfactions });
    }
    catch (e) {
        res.status(200).send("Error happened");
    }
});

// 19Tarrestnom65
userRouter.get('/api/userAllTime/:name', async (req, res) => {
    try {
        const users = getLocalClient().db().collection('users');
        console.log(req.params.name);
        const cursor = await users.find({ user: req.params.name }).toArray();
        let wholeTimeData = [];
        cursor.forEach(el => {
            let numberOfactions = 0;
            if (el !== null && el !== undefined) {
                for (const [key, value] of new Map(Object.entries(el.type))) {
                    numberOfactions += value;
                }
            }
            wholeTimeData.push({user: el.user, date: el.date, actions: numberOfactions});
        })
        res.status(200).json(wholeTimeData);
    }
    catch (e) {
        console.log(e);
        res.status(200).send("Error happened");
    }
});


export default userRouter;
