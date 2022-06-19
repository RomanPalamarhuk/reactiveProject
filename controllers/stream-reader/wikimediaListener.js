import  EventSource  from 'eventsource';

const URL = 'https://stream.wikimedia.org/v2/stream/recentchange';
const TIME_STAMPT = 30000;
const eventSourse = new EventSource(URL);


export function wikipediaListener() {
    let data_to_save = [];
    eventSourse.onopen = () => {
        console.info('Opened Connection');
    }

    eventSourse.onerror = (event) => {
        console.log('Error', event);
    }

    eventSourse.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(data);
        // if (data.server_name === 'en.wikipedia.org') {
        //     console.log(data);
        // }
    }
}