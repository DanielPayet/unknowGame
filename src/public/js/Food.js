function Food(x, y) {
    this.position = {x:x, y:y};
    this.color = 0;
    this.cameraIndex = null;
    
    this.render = (camera) => {
        let radius = 10;
        this.color += 2
        this.color %= 355;
        context.fillStyle = 'hsl(' + this.color + ', 50%, 50%)';
        context.beginPath();
        let viewPosition = camera.viewPositionForPoint({x:this.position.x, y: this.position.y});
        context.arc(viewPosition.x, viewPosition.y, radius, 0, 2*Math.PI, true);
        context.closePath();
        context.fill(); 
    }
}