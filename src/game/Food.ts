import { Position } from './types/position';

export class Food {
    position: Position;
    color: number = 0;
    cameraIndex = null;

    constructor(public x, public y) {
        this.position = { x: x, y: y };
    }

    public render(camera, context) {
        let radius = 10;
        this.color += 2
        this.color %= 355;
        context.fillStyle = 'hsl(' + this.color + ', 50%, 50%)';
        context.beginPath();
        let viewPosition = camera.viewPositionForPoint({ x: this.position.x, y: this.position.y });
        context.arc(viewPosition.x, viewPosition.y, radius, 0, 2 * Math.PI, true);
        context.closePath();
        context.fill();
    }
}