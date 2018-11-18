import { Position } from "./type/position";
import { Game } from "./game";
import { Socket } from "../gameSocket/socket";

export class Food {
    position: Position;
    color: number = 0;
    cameraIndex = null;

    constructor(public x, public y) {
        this.position = { x: x, y: y };
    }

    public static generateFood() {
        if (Math.random() < 0.08 && Game.joueurs.size != 0) {
            Game.joueurs.forEach((g) => {
                let food = new Food(g.position.x - (Math.random() * 2000), g.position.y - (Math.random() * 2000));
                Game.foods.push(food);
                Socket.io.sockets.emit('newFood', food);
            });
        }
    }
}