export class GameEvent {
    public static init(io) {
        io.on('move', function (socket) {
            console.log("A snake have move");
        });
        io.on("snake", (data) => {
            console.log("snake move", data);
        })
    }
}