export class Graph {
  constructor(canvas, name1, name2) {
    this.canvas = canvas;
    this.name1 = name1;
    this.name2 = name2;
    this.canvas.width = 220;
    this.canvas.height = 200;

    if (this.canvas.getContext) {
      this.ctx = this.canvas.getContext('2d');

      this.ctx.strokeStyle = 'white';

      for (var i = 0; i < this.canvas.width; i += 25) {
        for (var j = 0; j < this.canvas.height; j += 25) {
          this.ctx.strokeRect(i, j, 25, 25);
        }
      } //draw grey net

      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1.5;
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.stroke(); //draw vertical bold black line

      this.ctx.beginPath();
      this.ctx.strokeStyle = 'black';
      this.ctx.lineWidth = 1.5;
      this.ctx.moveTo(0, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.ctx.stroke(); //draw horisontal bold black line

      this.ctx.beginPath();
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${this.name1}`, this.canvas.width / 2+20, 150);
      this.ctx.strokeStyle = 'Orange';
      this.ctx.moveTo(this.canvas.width / 2+30, 140);
      this.ctx.lineTo(this.canvas.width / 2+70, 140);
      this.ctx.stroke(); //draw line for name1

      this.ctx.beginPath();
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'right';
      this.ctx.fillText(`${this.name2}`, this.canvas.width / 2+20, 170);
      this.ctx.strokeStyle = 'Green';
      this.ctx.moveTo(this.canvas.width / 2+30, 160);
      this.ctx.lineTo(this.canvas.width / 2+70, 160);
      this.ctx.stroke(); //draw line for name2

      this.ctx.beginPath();
      this.cx = 0;
      this.cy = this.canvas.height / 2;
      this.tempX1 = 0;
      this.tempY1 = this.canvas.height / 2;
      this.tempX2 = 0;
      this.tempY2 = this.canvas.height / 2;
      this.ctx.moveTo(this.cx, this.cy);

      this.path1 = new Path2D();     // first line
      this.path2 = new Path2D();     // second line
    }
  }

  drawGraph = (x = 0, y1 = 0, y2 = 0) => {

    this.path1.moveTo(this.tempX1, this.tempY1);
    this.path1.lineTo(x, this.cy+y1);

    this.ctx.strokeStyle = 'Orange';
    this.ctx.stroke(this.path1);
    this.tempX1 = x;
    this.tempY1 = this.cy+y1;

    this.path2.moveTo(this.tempX2, this.tempY2);
    this.path2.lineTo(x, this.cy+y2);

    this.ctx.strokeStyle = 'Green';
    this.ctx.stroke(this.path2);
    this.tempX2 = x;
    this.tempY2 = this.cy+y2;
  };
}
