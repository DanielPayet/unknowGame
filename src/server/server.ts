import { AppController } from './controllers/index';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';

let httpServer = express();
httpServer.get('*', function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'].split(":")[0] + ":8443" + req.url });
    res.end();
})
httpServer.listen(3000);

const port: number = +process.env.PORT || 8443;
const app: express.Application = express();
app.use(AppController);
app.use(express.static(path.join(process.cwd(), "/dist/public/")));
app.use(express.static(path.join(process.cwd(), "/dist/public/images/icons")));

var server = https.createServer(
    {
        key: fs.readFileSync(path.join(process.cwd(), '/dist/cert/privkey1.pem')),
        cert: fs.readFileSync(path.join(process.cwd(), '/dist/cert/cert1.pem')),
        ca: fs.readFileSync(path.join(process.cwd(), '/dist/cert/chain1.pem'))
    }, app);

var io = socketIo(server, { serveClient: false });

server.listen(port);

io.on('connection', function (socket) {
    console.log("New user connected");
});