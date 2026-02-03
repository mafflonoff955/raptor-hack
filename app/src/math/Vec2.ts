export class Vec2 {
  constructor(public x: number, public y: number) {}

  static get zero() { return new Vec2(0, 0); }

  add(v: Vec2): Vec2 { return new Vec2(this.x + v.x, this.y + v.y); }
  sub(v: Vec2): Vec2 { return new Vec2(this.x - v.x, this.y - v.y); }
  mul(s: number): Vec2 { return new Vec2(this.x * s, this.y * s); }
  div(s: number): Vec2 { return new Vec2(this.x / s, this.y / s); }
  
  mag(): number { return Math.sqrt(this.x * this.x + this.y * this.y); }
  magSq(): number { return this.x * this.x + this.y * this.y; }
  
  normalize(): Vec2 {
    const m = this.mag();
    return m === 0 ? Vec2.zero : this.div(m);
  }

  dist(v: Vec2): number { return this.sub(v).mag(); }
  
  dot(v: Vec2): number { return this.x * v.x + this.y * v.y; }

  clone(): Vec2 { return new Vec2(this.x, this.y); }
  
  equals(v: Vec2): boolean { return this.x === v.x && this.y === v.y; }
}
