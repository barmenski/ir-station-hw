export class Graph {
  constructor(canvas, name) {
    this.canvas = canvas;
    this.name = name;
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

      this.ctx.strokeStyle = 'black';
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, this.canvas.height);
      this.ctx.stroke(); //draw vertical bold black line

      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height / 2);
      this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
      this.ctx.font = '30px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.strokeText(`${this.name}`, this.canvas.width / 2, 150);
      this.ctx.stroke(); //draw horisontal bold black line
      this.ctx.beginPath();
      this.cx = 0;
      this.cy = this.canvas.height / 2;
      this.ctx.moveTo(this.cx, this.cy);
    }
  }

  drawGraph = (x = 0, y = 0) => {
    this.ctx.strokeStyle = 'olive';
    this.ctx.lineWidth = 1;
    this.ctx.lineTo(this.cx + x, this.cy + y);
    this.ctx.stroke();
  };
}
