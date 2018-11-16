import { AppController } from './controllers/index';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import * as http from 'http';

const port: number = +process.env.PORT || 3000;
const app: express.Application = express();
app.use(AppController);
app.use(express.static(path.join(process.cwd(), "/dist/public/")));

var server = new http.Server(app);
var io = socketIo(server, { serveClient: false });

server.listen(port);

io.on('connection', function (socket) {
    console.log("New user connected");
});