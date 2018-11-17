export class GameEvent {
    public static init(io) {
        io.on('move', function (socket) {
            console.log("A snake have move");
        });
    }
}