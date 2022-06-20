import EventSource from 'eventsource';
import { Timestamp } from 'mongodb';
import { getClient } from '../../dbClient/mongodb.js';

const URL = 'https://stream.wikimedia.org/v2/stream/recentchange';
const TIME_STAMPT = 10000;
const eventSourse = new EventSource(URL);


export function wikipediaListener() {
    let users_to_update = [];
    let recentTime = new Date().getTime();
    eventSourse.onopen = () => {
        console.info('Opened Connection');
    }

    eventSourse.onerror = (event) => {
        console.log('Error', event);
    }
    eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const current_date = new Date(data.meta.dt);
        users_to_update.push({
            user: data.user, type: data.type,
            title: data.title, date:
                current_date.getFullYear() + '-' + (current_date.getMonth() + 1)
                + '-' + current_date.getDate()
        });

        if (new Date().getTime() - recentTime > TIME_STAMPT) {
            recentTime = new Date().getTime();
            let buffer = users_to_update;
            users_to_update = [];
            UpdateData(buffer);

        }
    }
}

async function UpdateData(users_to_update) {
    try {
        array_promises = [];
        for (let el of users_to_update) {
            array_promises.push(UpdateOneUser(el));
        }
        await Promise.allSettled(array_promises);
    }
    catch (e) {
        console.log("Error" + e);
    }
}

async function UpdateOneUser(user_getted) {
    try {
        const users = getClient().db().collection('users');
        const user = await users.findOne({ user: user_getted.user, date: user_getted.date });
        if (user === undefined || user === null) {
            let map_title = new Map();
            map_title[user.title] = 0;
            let map_uses = new Map();
            map_uses[user.type] = 0;
            await users.insertOne({ user: user_getted.user, date: user_getted.date, titles: map_title, types_editing: map_uses });
        }
        else {
            const query = { user: user.user, date: user.date };
            if (user.titles[user_getted.title] === undefined || user.titles[user_getted.title] === null) {
                user.titles[user_getted.title] = 0;
            }
            if (user.types_editing[user_getted.type] === undefined || user.types_editing[user_getted.type] === null) {
                user.types_editing[user_getted.type] = 0;
            }
            const newValues = { $set: { titles: user.titles[user_getted.title] + 1, types_editing: user.types_editing[user_getted.type] + 1 } };
            await users.updateOne(query, newValues);
        }
    }
    catch (e) {
        console.log("Error happened" + e);
    }
}