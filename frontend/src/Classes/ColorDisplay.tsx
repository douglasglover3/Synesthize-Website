const animation_speed = 50; // time between animation calls in ms

function to_hsl(color: string, octave: number) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);

  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;

  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);

  var h = (max + min) / 2;
  var s = (max + min) / 2;
  var l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  }
  else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  s = (s * 100);
  s = Math.round(s);
  l = (l * 100) + (5 * octave);
  l = Math.round(l);
  h = Math.round(360 * h);

  return 'hsl(' + h + ', ' + s + '%, ' + l + '%)';
}

export class color_canvas {
  c: any;
  ctx: CanvasRenderingContext2D | null;
  name: string;
  color: string;
  dis_color: string;
  x: number;
  y: number;
  size: number;
  alpha: number;
  fade_sem: number; // 0 : idle | 1 : fade in | 2 fade out
  fade_delta: number; // rate of change for the fade
  display_status: boolean; //false : not displayed | true : displayed

  constructor(name: string, color: string) {
    let style =
      "position: absolute; " +
      "left: 0px; " +
      "top: 0px;"

      if(name == 'c1') {
        style += 'background : #e0e0e0'
      }
      else {
        style += 'background : transparent'
      }

    this.name = name

    this.c = document.createElement("canvas");
    this.ctx = this.c.getContext('2d');

    this.c.setAttribute('id', name)
    this.c.setAttribute('style', style)
    this.c.width = window.innerWidth;
    this.c.height = window.innerHeight - 230;
    this.c.style.webkitFilter = "blur(3px)";

    this.color = color;
    this.x = Math.random() * this.c.width;
    this.y = Math.random() * this.c.height;
    this.size = Math.random() * (100 - 10) + 10;
    this.alpha = 0;
    this.fade_sem = 0; 
    this.fade_delta = Math.random() * (0.50 - 0.25) + 0.25 
    this.display_status = false

    const ele = document.getElementById('canvas_space')
    if (ele != null) {
      ele.append(this.c)

    }
  }

  update_color(color: string) {
    this.color = color
  }

  draw_new(octave: number) {
    this.clear()
    this.dis_color = to_hsl(this.color, octave);
    this.size = Math.random() * (75 - 25) + 25;
    this.x = Math.round(Math.random() * ((this.c.width - this.size) - this.size) + this.size);
    this.y = Math.round(Math.random() * ((this.c.height - this.size) - this.size) + this.size);
    this.fade_delta = Math.random() * (0.25 - 0.15) + 0.15  // rate of change for the fade
    this.display_status = true
    console.log(this.x, this.y)
    this.fade_in()
  }

  check_active_idle() {
    if(this.display_status == true && this.fade_sem == 0) {
      return true
    }
    return false

  }

  check_inactive() {
    return !this.display_status
  }

  draw() {

    if (this.ctx != null) {
      this.clear()
      this.ctx.fillStyle = this.dis_color;
      this.ctx.beginPath()
      this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
      this.ctx.closePath()
      this.ctx.fill();
    }

    if (this.fade_sem === 1) {
      setTimeout(this.fade_in.bind(this), animation_speed)
    }
    else if (this.fade_sem === 2) {
      setTimeout(this.fade_out.bind(this), animation_speed)
    }
  }

  clear() {
    if (this.ctx != null) {
      this.ctx.clearRect(0, 0, this.c.width, this.c.height)
    }
  }

  fade_in() {
    this.fade_sem = 1;
    this.alpha = this.alpha + this.fade_delta;
    if (this.alpha > 1) {
      this.alpha = 1
      this.fade_sem = 0
    }
    this.ctx.globalAlpha = this.alpha;
    this.draw();
  }

  fade_out() {
    this.fade_sem = 2;
    this.alpha = this.alpha - this.fade_delta;
    if (this.alpha < 0) {
      this.alpha = 0
      this.fade_sem = 0
      this.display_status = false
    }
    this.ctx.globalAlpha = this.alpha;
    this.draw();
  }
}
