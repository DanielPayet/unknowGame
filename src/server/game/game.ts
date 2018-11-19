import { Food } from "./food";

export class Game {
    public static joueurs: Map<number, any> = new Map<number, any>();
    public static foods = [];

    public static run() {
        setInterval(() => {
            Food.generateFood();
        }, 1000);
    }
}