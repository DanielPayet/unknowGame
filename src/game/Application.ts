import { Food } from './Food';
import { Snake } from './Snake';
import { Camera } from './Camera';
import $ from 'jquery';
import io from 'socket.io-client';

export class Application {
    private canvas;
    private context;
    private snake: Snake;
    private camera: Camera;
    private foods: Food[];
    private isPaused: boolean;

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
        return new Application().run();
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
            this.generateAndRenderFood();
            this.updateScore();
        }, 16);
    }

    public initSocket() {
        var socket = io.connect(process.env.server);
        socket.on("Hello", (socket) => {
            console.log("Bienvenu sur le jeu du turfu");
        });
    }

    private generateAndRenderFood() {
        if (Math.random() < 0.08) {
            let food = new Food(this.snake.position.x - (Math.random() * 2000), this.snake.position.y - (Math.random() * 2000));
            this.foods.push(food);
            this.camera.addObject(food);
        }
    }

    private updateScore() {
        $("#score").text(this.snake.getSize() - 3);
    }
}