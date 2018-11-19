import { Food } from './Food';
import { Snake } from './Snake';
import { Camera } from './Camera';
import $ from 'jquery';
import io from 'socket.io-client';

export class Application {
    public static app: Application;
    private canvas;
    private context;
    private snake: Snake;
    private camera: Camera;
    public foods: Food[];
    private isPaused: boolean;
    public socket;

    constructor() {
        this.isPaused = false;
        this.canvas = $('canvas').first()[0];
        this.context = this.canvas.getContext('2d');
        this.foods = [];
        this.snake = new Snake();
        this.camera = new Camera(this.snake, this.canvas);
        this.camera.addObject(this.snake);
        this.initEvent();
        this.initSocket();
    }

    public static bootstrap() {
        this.app = new Application()
        return this.app.run();
    }

    public initEvent() {
        $(document).on('mousemove', 'canvas', (event) => {
            move(event.clientX, event.clientY);
        });

        $(document).on('touchmove', 'canvas', (e) => {
            let touch = e.touches[0];
            move(touch.clientX, touch.clientY);
        });

        let move = (x, y) => {
            let rect = this.canvas.getBoundingClientRect();
            let scaleX = this.canvas.width / rect.width;
            let scaleY = this.canvas.height / rect.height;
            let position = { x: ((x - rect.left) * scaleX), y: ((y - rect.top) * scaleY) };
            let mousePosition = this.camera.realPositionForPoint(position);
            this.snake.moveVector.dX = mousePosition.x - this.snake.position.x;
            this.snake.moveVector.dY = mousePosition.y - this.snake.position.y;
        }

        $(document).bind('keypress', (e) => {
            if (e.keyCode == 112 && !this.isPaused) {
                this.isPaused = true;
            } else {
                this.isPaused = false;
            }
        });

        $(document).on('touchend click', '#info', (e) => {
            e.preventDefault();
            this.isPaused = !this.isPaused;
        });
    }

    public run() {
        setInterval(() => {
            if (!this.isPaused) {
                this.snake.update(this.foods, this.camera);
            }
            this.camera.render(this.context);
            this.updateScore();
        }, 16);
    }

    public initSocket() {
        this.socket = io.connect(process.env.server);
        this.socket.on("Hello", (data) => {
            console.log("Bienvenue sur le jeu du turfu");
            this.foods.push(...data.foods.map((f) => new Food(f.x, f.y)));
            this.foods.forEach(food => {
                this.camera.addObject(food);
            })
        });
        this.socket.on("newFood", (foodServer) => {
            let food = new Food(foodServer.x, foodServer.y);
            this.foods.push(food);
            this.camera.addObject(food);
        });
        this.socket.on("foodEat", (key) => {
            this.camera.removeObject(this.foods[key]);
            this.foods.splice(key, 1);
        })
    }

    private updateScore() {
        $("#score").text(this.snake.getSize() - 3);
    }
}