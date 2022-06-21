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
        promise_to_Save.push(stream_file.insertOne({ user: data.user, type: data.type, title: data.title, 
            time: current_date.getFullYear() + '-' + (current_date.getMonth() + 1)+ '-' + current_date.getDate()}));
        if (new Date().getTime() - recentTime > TIME_STAMPT) {
            recentTime = new Date().getTime();
            let buffer = promise_to_Save;
            promise_to_Save = [];
            SaveToDb(buffer);

        }
    }
}

async function SaveToDb(buffer) {
    try {
        await Promise.allSettled(buffer);
    }
    catch (e) {
        console.log("Error" + e);
    }
}
//current_date.getFullYear() + '-' + (current_date.getMonth() + 1)+ '-' + current_date.getDate()