import { Point } from './Point';

export class Rect {
  public startPoint: Point;
  public endPoint:Point;
  public width: number;
  public height: number;
  public context = undefined;
  public lpadding = 0;
  public tpadding = 0;
  public rpadding = 0;
  public bpadding = 0;
  public lmargin = 0;
  public tmargin = 0;
  public rmargin = 0;
  public bmargin = 0;

  public constructor(startX: number, startY: number, width: number, height: number, context?: any) {
    this.startPoint = new Point(startX, startY);
    this.endPoint = new Point(startX + width, startY + height);
    this.width = width;
    this.height = height;
    this.context = context;
  }

  public getStartX() {
    return this.startPoint.x;
  }

  public getStartY() {
    return this.startPoint.y;
  }

  public getEndX() {
    return this.endPoint.x;
  }

  public getEndY() {
    return this.endPoint.y;
  }

  public setPadding(tpadding: number, rpadding: number, bpadding: number, lpadding: number) {
    this.tpadding = tpadding;
    this.rpadding = rpadding;
    this.bpadding = bpadding;
    this.lpadding = lpadding;
  }

  public setMargin(tmargin: number, rmargin: number, bmargin: number, lmargin: number) {
    this.tmargin = tmargin;
    this.rmargin = rmargin;
    this.bmargin = bmargin;
    this.lmargin = lmargin;
  }

  public strokeRect(context: any, style: any) {
    var target_context	= undefined;
    if(context)
      target_context = context;
    else if(this.context)
      target_context = this.context;


    if(target_context){
      var backup_style 	= target_context.strokeStyle;
      if(style)
        target_context.strokeStyle = style;

      target_context.strokeRect(this.getStartX(),this.getStartY(),this.width,this.height);
      target_context.strokeStyle = backup_style;
      //debug
      //target_context.fillText(this.getStartX()+","+this.getStartY(),this.getStartX(),this.getStartY());
      //target_context.fillText(this.getEndX()+","+this.getEndY(),this.getEndX(),this.getEndY());
    }
  }

  public fillRect(context: any, style: any) {
    var target_context	= undefined;
    if(context)
      target_context = context;
    else if(this.context)
      target_context = this.context;


    if(target_context){
      var backup_style 	= target_context.strokeStyle;
      if(style)
        target_context.fillStyle = style;

      target_context.fillRect(this.getStartX(),this.getStartY(),this.width,this.height);
      target_context.fillStyle = backup_style;
      //debug
      //target_context.fillText(this.getStartX()+","+this.getStartY(),this.getStartX(),this.getStartY());
      //target_context.fillText(this.getEndX()+","+this.getEndY(),this.getEndX(),this.getEndY());
    }
  }

  public getPadding(tpadding: number, rpadding: number, bpadding: number, lpadding: number) {
    var startX = this.getStartX() + lpadding;
    var startY = this.getStartY() + tpadding;
    var endW = (this.getEndX() - startX) - rpadding;
    var endH = (this.getEndY() - startY) - bpadding;
    var rect = new Rect(startX, startY, endW, endH);
    rect.setPadding(tpadding, rpadding, bpadding, lpadding);
    return rect;
  }

  public getMargin(tmargin: number, rmargin: number, bmargin: number, lmargin: number) {
    var startX = this.getStartX() + lmargin;
    var startY = this.getStartY() + tmargin;
    var endW = (this.getEndX() - startX) - rmargin;
    var endH = (this.getEndY() - startY) - bmargin;
    var rect = new Rect(startX, startY, endW, endH);
    rect.setMargin(tmargin, rmargin, bmargin, lmargin);
    return rect;
  }

  public getCentX() {
    return ((this.getEndX() - this.getStartX()) / 2) + this.getStartX()
  }

  public getCentY() {
    return ((this.getEndY() - this.getStartY()) / 2) + this.getEndY();
  }
  public isHit(x: number, y: number) {
    return this.getStartX()<=x && this.getStartY()<=y && this.getEndX()>=x && this.getEndY()>=y;
  }
}