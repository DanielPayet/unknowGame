import * as socketIo from 'socket.io';
import * as https from 'https';
import { AppEvent } from './app.event';
import { GameEvent } from './game.event';
import { Game } from '../game/game';

export class Socket {
    public static io;
    public static sockets = [];

    public static bootstrap(server: https.Server) {
        this.io = socketIo(server, { serveClient: false });
        this.initEvent();
    }

    private static initEvent() {
        AppEvent.init(this.io);
        GameEvent.init(this.io);
        this.io.on('connection', (socket) => {
            socket.emit("Hello", { foods: Game.foods });
            this.createSocket(socket);
            socket.on('disconnect', () => {
                this.removeSocket(socket);
            });
        });
    }

    private static createSocket(socket) {
        this.sockets.push(socket);
        socket.on("snake", (data) => {
            Game.joueurs.set(socket.id, data);
        });
        socket.on("foodEat", (key) => {
            Game.foods.splice(key, 1);
            this.io.sockets.emit("foodEating", key);
        })
    }

    private static removeSocket(socket) {
        this.sockets = this.sockets.filter(s => s.id != socket.id);
    }
}