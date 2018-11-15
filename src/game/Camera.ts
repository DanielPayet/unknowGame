import { Position } from './types/position';

export class Camera {
    private objects: Map<any, any> = new Map();
    private followsFocus: boolean = true;
    private position: Position;
    private currentIndex: number;
    private scale: number;

    constructor(private focus, private canvas) {
        this.objects = new Map();
        this.followsFocus = true;
        this.position = { x: 0, y: 0 };
        this.currentIndex = 1;
        this.scale = 1.5;
    }

    public positionFocus() {
        return {
            x: (this.focus.position.x - (this.canvas.width / 2)),
            y: (this.focus.position.y - (this.canvas.height / 2))
        };
    }

    public viewPositionForPoint(point) {
        return { x: point.x - this.positionFocus().x, y: point.y - this.positionFocus().y };
    }

    public realPositionForPoint(point) {
        return { x: point.x + this.positionFocus().x, y: point.y + this.positionFocus().y };
    }

    public addObject(object) {
        object.cameraIndex = this.currentIndex;
        this.objects.set(this.currentIndex, object);
        this.currentIndex += 1;
    }

    public removeObject(object) {
        this.objects.delete(object.cameraIndex);
    }

    public render(context) {
        $(this.canvas).attr('height', window.innerHeight * this.scale);
        $(this.canvas).attr('width', window.innerWidth * this.scale);
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.objects.forEach((object) => {
            object.render(this, context);
        });
    }
}