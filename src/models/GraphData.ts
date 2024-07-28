export class GraphData {
  public name?: string			= undefined;
  public strokeStyle?:string	= undefined;
  public fillStyle?:string	= undefined;
  public width?:number			= undefined;
  public type?:string			= undefined; //line, stick,
  public data			= undefined;//[{x:1,y:1}, {x:2,y:2},Object,...]
  public xVarName 		= "x"; //GraphKData에 XData로들어갈 변수명
  public yVarName 		= "y";
  constructor(name?: string, data?: any) {
    this.name = name;
    this.data = data;
  }

  setXVarName(xVarName: string) {
    this.xVarName = xVarName;
  }
  setYVarName(yVarName: string) {
    this.yVarName = yVarName;
  }
  setStrokeStyle(strokeStyle: string) {
    this.strokeStyle = strokeStyle;
  }
  setFillStyle(fillStyle: string) {
    this.fillStyle = fillStyle;
  }
  setWidth(width: number) {
    this.width = width;
  }
  setType(type: string) {
    this.type = type;
  }
}