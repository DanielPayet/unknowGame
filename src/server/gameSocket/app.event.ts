import { emit } from "cluster";

export class AppEvent {
    public static init(io) {
        io.on('connection', function (socket) {
            console.log("New user connected");
            socket.emit("Hello");
        });
    }
}