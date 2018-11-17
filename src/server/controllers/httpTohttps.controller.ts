import * as express from 'express';
import { env } from './../config/config';

export class HttpToHttps {
    public static listenForRedirect() {
        let httpServer = express();
        httpServer.get('*', function (req, res) {
            res.writeHead(301, { "Location": `https://${req.headers['host'].split(":")[0]}:${env.port.https}/index.html` });
            res.end();
        })
        return httpServer.listen(env.port.http);
    }
}