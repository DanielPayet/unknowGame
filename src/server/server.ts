import { AppController, HttpToHttps } from './controllers/index';
import * as express from 'express';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';
import * as fs from 'fs';
import { env } from './config/config';
import { Socket } from './gameSocket/socket';

class Server {
    private serverHttp: http.Server;
    private server: https.Server;
    private expressApp: express.Application;

    constructor() {
        this.configureExpressServer();
        this.configureSocketIo();
        this.runServer();
    }

    public static bootstrap() {
        return new Server();
    }

    private configureExpressServer() {
        this.serverHttp = HttpToHttps.listenForRedirect();
        this.expressApp = express();
        this.expressApp.use(AppController);
        this.expressApp.use(express.static(path.join(process.cwd(), env.distLocationLocation, "/public/")));
        this.expressApp.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
            next();
        });
        this.server = https.createServer(this.getSecureConf(), this.expressApp);
    }

    private getSecureConf(): https.ServerOptions {
        return {
            key: fs.readFileSync(path.join(process.cwd(), env.distLocationLocation, '/cert/privkey1.pem')),
            cert: fs.readFileSync(path.join(process.cwd(), env.distLocationLocation, '/cert/cert1.pem')),
            ca: fs.readFileSync(path.join(process.cwd(), env.distLocationLocation, '/cert/chain1.pem'))
        }
    }

    private configureSocketIo() {
        Socket.bootstrap(this.server);
    }

    private runServer() {
        this.server.listen(env.port.https, () => {
            console.log(`Le serveur à correctement démarré sur le port :${env.port.http} et :${env.port.https}`)
        });
    }
}

export default Server.bootstrap();