import * as socketIo from 'socket.io';
import * as https from 'https';
import { AppEvent } from './app.event';
import { GameEvent } from './game.event';

export class Socket {
    private static io;

    public static bootstrap(server: https.Server) {
        this.io = socketIo(server, { serveClient: false });
        this.initEvent();
    }

    private static initEvent() {
        AppEvent.init(this.io);
        GameEvent.init(this.io);
    }
}