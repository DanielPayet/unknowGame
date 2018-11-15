import { Food } from './Food';
import { Snake } from './Snake';
import { Camera } from './Camera';
import $ from 'jquery';

export class Application {
    private canvas;
    private context;
    private snake: Snake;
    private camera: Camera;
    private foods: Food[];

    constructor() {
        this.canvas = $('canvas').first()[0];
        this.context = this.canvas.getContext('2d');
        this.foods = [];
        this.snake = new Snake();
        this.camera = new Camera(this.snake, this.canvas);
        this.camera.addObject(this.snake);
        this.initEvent();
    }

    public static bootstrap() {
        return new Application().run();
    }

    public initEvent() {
        $(document).on('mousemove', 'canvas', (event) => {
            let rect = this.canvas.getBoundingClientRect();
            let scaleX = this.canvas.width / rect.width;
            let scaleY = this.canvas.height / rect.height;
            let position = { x: ((event.clientX - rect.left) * scaleX), y: ((event.clientY - rect.top) * scaleY) };
            let mousePosition = this.camera.realPositionForPoint(position);
            this.snake.moveVector.dX = mousePosition.x - this.snake.position.x;
            this.snake.moveVector.dY = mousePosition.y - this.snake.position.y;
        });
    }

    public run() {
        setInterval(() => {
            this.snake.update(this.foods, this.camera);
            this.camera.render(this.context);
            this.generateAndRenderFood();
        }, 16);
    }

    private generateAndRenderFood() {
        if (Math.random() < 0.08) {
            let food = new Food(this.snake.position.x - (Math.random() * 2000), this.snake.position.y - (Math.random() * 2000));
            this.foods.push(food);
            this.camera.addObject(food);
        }
    }
}