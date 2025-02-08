export class Graph {
  constructor(canvas, name1, name2, step) {
    this.canvas = canvas;
    this.name1 = name1;
    this.name2 = name2;
    this.canvas.width = 300;
    this.canvas.height = 200;
    this.zeroY = 125;
    this.step = 0;
    this.sizeOfCube = 25;

    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext("2d");

      for (var i = 0; i < this.canvas.width; i += this.sizeOfCube) {
        for (var j = 0; j < this.canvas.height; j += this.sizeOfCube) {
          this.ctx.strokeStyle = "white";
          this.ctx.strokeRect(i, j, this.sizeOfCube, this.sizeOfCube);
        }
      } //draw grey net

      this.step = 25;//hide one of the zeros at the intersection point of the axes

      for (var i = this.sizeOfCube; i < this.canvas.width; i += this.sizeOfCube) {
        this.ctx.font = "10px Arial";
        this.ctx.strokeStyle = "black";
        this.ctx.fillText(`${this.step}`, i-5, this.zeroY+10);
        this.step = this.step + this.sizeOfCube;
      } //draw positive step on X axis

      this.step = 0;

      for (var j = this.zeroY; j > 0; j -= this.sizeOfCube) {
        this.ctx.font = "10px Arial";
        this.ctx.strokeStyle = "black";
        this.ctx.fillText(`${this.step}`, 5, j+5);
        this.step = this.step + step;
      } //draw positive step on Y axis

      this.step = 0;

      for (var j = this.zeroY; j < this.canvas.height; j += this.sizeOfCube) {
        this.ctx.font = "10px Arial";
        this.ctx.strokeStyle = "black";
        this.ctx.fillText(`${this.step}`, 5, j+5);

        this.step = this.step - step;
      } //draw negative step on Y axis

      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2.5;
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(3, 10);
      this.ctx.lineTo(-3, 10);
      this.ctx.lineTo(0, 0);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.stroke(); //draw vertical bold black line

      this.ctx.beginPath();
      this.ctx.strokeStyle = "black";
      this.ctx.lineWidth = 2.5;
      this.ctx.moveTo(0, this.zeroY);
      this.ctx.lineTo(this.canvas.width, this.zeroY);
      this.ctx.lineTo(this.canvas.width-10, this.zeroY-3);
      this.ctx.lineTo(this.canvas.width-10, this.zeroY+3);
      this.ctx.lineTo(this.canvas.width, this.zeroY);
      this.ctx.stroke(); //draw horisontal bold black line

      this.ctx.beginPath();
      this.ctx.font = "20px Arial";
      this.ctx.textAlign = "right";
      this.ctx.fillText(`${this.name1}`, this.canvas.width / 2 + 20, 170);
      this.ctx.strokeStyle = "Orange";
      this.ctx.moveTo(this.canvas.width / 2 + 30, 165);
      this.ctx.lineTo(this.canvas.width / 2 + 70, 165);
      this.ctx.stroke(); //draw line for name1

      this.ctx.beginPath();
      this.ctx.font = "20px Arial";
      this.ctx.textAlign = "right";
      this.ctx.fillText(`${this.name2}`, this.canvas.width / 2 + 20, 190);
      this.ctx.strokeStyle = "Green";
      this.ctx.moveTo(this.canvas.width / 2 + 30, 185);
      this.ctx.lineTo(this.canvas.width / 2 + 70, 185);
      this.ctx.stroke(); //draw line for name2

      this.ctx.beginPath();
      this.cx = 0;
      this.cy = this.zeroY;
      this.tempX1 = 0;
      this.tempY1 = this.zeroY;
      this.tempX2 = 0;
      this.tempY2 = this.zeroY;
      this.ctx.moveTo(this.cx, this.cy);
      this.ctx.lineWidth = 1.5;

      this.path1 = new Path2D(); // first line
      this.path2 = new Path2D(); // second line
    }
  }

  drawGraph = (x = 0, y1 = 0, y2 = 0) => {
    this.path1.moveTo(this.tempX1, this.tempY1);
    this.path1.lineTo(x, this.cy + y1);

    this.ctx.strokeStyle = "Orange";
    this.ctx.stroke(this.path1);
    this.tempX1 = x;
    this.tempY1 = this.cy + y1;

    this.path2.moveTo(this.tempX2, this.tempY2);
    this.path2.lineTo(x, this.cy + y2);

    this.ctx.strokeStyle = "Green";
    this.ctx.stroke(this.path2);
    this.tempX2 = x;
    this.tempY2 = this.cy + y2;
  };
}
