export class Point {
  public x: number;
  public y: number;
  public value?: number;
  public constructor(x: number, y: number, value?: number) {
    this.x = x;
    this.y = y;
    this.value = value;
  }
}