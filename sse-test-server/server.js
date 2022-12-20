import express from 'express'
import { Subject } from 'rxjs'

const app = express();

const NewLog$ = new Subject();

const emitNewLog = (log) => {
    NewLog$.next(log);
}

const serializeEvent = (event, data) => {
    const jsonString = JSON.stringify(data);
    return `event: ${event}\ndata: ${jsonString}\n\n`;
}
    
let num = 0;
const interval = setInterval(() => {
    emitNewLog({ content: num });
    num += 5;
}, 5000);

app.get('/', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    const stream$ = NewLog$.subscribe((log) => {
      res.write(serializeEvent('message', log));
    });

    req.on('close', () => {
      stream$.unsubscribe();
    });
});

app.listen(9000, () => {
    console.log('listening at 9000');
});
