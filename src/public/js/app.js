
// -----------------
// FLOW.JS MAIN FILE
// -----------------

var canvas
var context
var snake = new Snake();
let camera = new Camera(snake);
camera.addObject(snake);

var foods = [];

$(function() {

    canvas = $('canvas').first()[0];
    context = canvas.getContext('2d');

    $(document).on('mousemove', 'canvas', function(event) {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let position = {x: ((event.clientX - rect.left) * scaleX), y: ((event.clientY - rect.top) * scaleY)}; 
        let mousePosition = camera.realPositionForPoint(position);
        snake.moveVector.dX = mousePosition.x - snake.position.x;
        snake.moveVector.dY = mousePosition.y - snake.position.y;
    });   

    setInterval(function() {
        snake.update();
        camera.render();   
        generateAndRenderFood();
    }, 16);
});

function generateAndRenderFood() {
    if (Math.random() < 0.08) {
        let food = new Food(snake.position.x - (Math.random() * 2000), snake.position.y - (Math.random() * 2000));
        foods.push(food);
        camera.addObject(food);
    }
}

function Camera(focus) {
    this.objects = new Map();
    this.focus = focus;
    this.followsFocus = true;
    this.position = {x:0,y:0};
    this.currentIndex = 1;
    this.scale = 1.5;

    this.positionFocus = () => {           
        return {
            x: (focus.position.x - (canvas.width / 2)), 
            y: (focus.position.y - (canvas.height / 2))
        }; 
    }

    this.viewPositionForPoint = (point) => {
        return {x: point.x - this.positionFocus().x, y: point.y - this.positionFocus().y};
    }

    this.realPositionForPoint = (point) => {
        return {x: point.x + this.positionFocus().x, y: point.y + this.positionFocus().y};
    }

    this.addObject = (object) => {
        object.cameraIndex = this.currentIndex;
        this.objects.set(this.currentIndex, object);
        this.currentIndex += 1;
    }

    this.removeObject = (object) => {
        this.objects.delete(object.cameraIndex);
    }

    this.render = () => {
        $(canvas).attr('height', window.innerHeight * this.scale);
        $(canvas).attr('width', window.innerWidth * this.scale);
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.objects.forEach((object) => {
            object.render(this); 
        });
    }
}