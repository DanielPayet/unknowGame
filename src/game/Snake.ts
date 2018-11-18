import { Position } from './types/position';
import { Food } from './Food';
import { Application } from './Application';

export class Snake {
    public position: Position = { 'x': 0, 'y': 0 };
    public tailPositions: Position[] = [{ 'x': 0, 'y': 0 }, { 'x': 0, 'y': 0 }, { 'x': 0, 'y': 0 }];
    public velocity = { 'x': 0, 'y': 0 };
    public moveVector = { 'dX': 0, 'dY': 0 };
    public maxSpeed = 15;
    public color = 0;
    public cameraIndex = null;

    public sendPosition() {
        Application.app.socket.emit("snake", { position: this.position })
    }

    public grow(size) {
        for (let i = 0; i < size; i++) {
            let last = this.tailPositions[this.tailPositions.length - 1];
            this.tailPositions.push({ x: last.x, y: last.y });
        }
    };

    public update(foods: Food[], camera) {

        // HEAD, ACCELLERATION, VELOCITY

        this.velocity.x = (this.velocity.x + this.moveVector.dX * 0.01);
        this.velocity.y = (this.velocity.y + this.moveVector.dY * 0.01);
        let distance = Math.sqrt(Math.pow(this.moveVector.dX, 2) + Math.pow(this.moveVector.dY, 2));
        let speed = Math.sqrt(Math.pow(this.velocity.x, 2) + Math.pow(this.velocity.y, 2));
        let coefficient = (speed != 0) ? (Math.min(this.maxSpeed, speed) / speed) : 0;
        let deceleration = Math.max(Math.min(((Math.sqrt(Math.abs(distance) / 100), 1) + 10) / 11, 0.83));
        this.velocity.x *= coefficient * deceleration;
        this.velocity.y *= coefficient * deceleration;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // TAIL LOGIC

        this.tailPositions.forEach((tailPosition, key) => {

            let dY = 0;
            let dX = 0;
            if (key == 0) {
                dX = this.position.x - tailPosition.x;
                dY = this.position.y - tailPosition.y;
            }
            else {
                dX = this.tailPositions[key - 1].x - tailPosition.x;
                dY = this.tailPositions[key - 1].y - tailPosition.y;
            }

            let distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));

            let maxDistance = 30;
            if (maxDistance < distance) {
                coefficient = (distance - maxDistance) / distance;
                this.tailPositions[key].x += dX * coefficient;
                this.tailPositions[key].y += dY * coefficient;
            }
        });

        // FOOD COLLISION 

        {
            foods.forEach((food, key) => {
                let dX = (food.position.x - this.position.x);
                let dY = (food.position.y - this.position.y);
                let distance = Math.sqrt(Math.pow(dX, 2) + Math.pow(dY, 2));
                let coeff = - (5000 / Math.pow(distance, 3));

                if (distance < 200) {
                    food.position.x += dX * coeff;
                    food.position.y += dY * coeff;

                    if (distance < 20) {
                        //foods.splice(key, 1);
                        Application.app.socket.emit("foodEat", key);
                        camera.removeObject(food);
                        this.grow(1);
                    }
                }
            });
        }

        // COLOR CHANGE
        this.color += 1;
        this.color %= 355;
        this.sendPosition();
    }

    public getSize() {
        return this.tailPositions.length;
    }

    public render(camera, context) {
        let radius = 15;
        context.fillStyle = 'hsl(' + this.color + ', 100%, 50%)';
        context.beginPath();
        let viewPosition = camera.viewPositionForPoint({ x: this.position.x, y: this.position.y })
        context.arc(viewPosition.x, viewPosition.y, radius, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();

        let len = this.tailPositions.length * 2;
        this.tailPositions.forEach((position, key) => {
            let intensity = 100 - (100 / len * key);
            context.fillStyle = 'hsl(' + this.color + ', ' + intensity + '%, 50%)';
            context.beginPath();
            viewPosition = camera.viewPositionForPoint({ x: position.x, y: position.y });
            context.arc(viewPosition.x, viewPosition.y, radius, 0, 2 * Math.PI, true);
            context.closePath();
            context.fill();
        });
    }
}