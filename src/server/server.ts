import { AppController } from './controllers/index';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as https from 'https';
import * as fs from 'fs';

const portHttp: number = +process.env.PORT_HTTP || 3000;
const portHttps: number = +process.env.PORT_HTTPS || 8443;
const distLocationLocation: string = process.env.dist || "/dist";

let httpServer = express();
httpServer.get('*', function (req, res) {
    res.writeHead(301, { "Location": `https://${req.headers['host'].split(":")[0]}:${portHttps}${req.url}` });
    res.end();
})

httpServer.listen(portHttp);

const app: express.Application = express();
app.use(AppController);
app.use(express.static(path.join(process.cwd(), distLocationLocation, "/public/")));
app.use(express.static(path.join(process.cwd(), distLocationLocation, "/public/images/icons")));

var server = https.createServer(
    {
        key: fs.readFileSync(path.join(process.cwd(), distLocationLocation, '/cert/privkey1.pem')),
        cert: fs.readFileSync(path.join(process.cwd(), distLocationLocation, '/cert/cert1.pem')),
        ca: fs.readFileSync(path.join(process.cwd(), distLocationLocation, '/cert/chain1.pem'))
    }, app);

var io = socketIo(server, { serveClient: false });

server.listen(portHttps);

io.on('connection', function (socket) {
    console.log("New user connected");
});