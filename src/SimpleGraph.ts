import { Point } from './models/Point';
import { Rect } from 'models/Rect';
import { SimpleGraphUtils } from 'utils/SimpleGraphUtils';
import { GraphDataSet } from 'models/GraphDataSet';
import { GraphData } from 'models/GraphData';


export class SimpleGraph {
  public name = 'SimpleGraph';
  public canvas: HTMLCanvasElement;
  context?: CanvasRenderingContext2D | null = undefined;
  endCanvas?: HTMLCanvasElement = undefined;
  public contentFillStyle: string | CanvasGradient | CanvasPattern = '#FFFFFF';
  public contentTitle = 'TITLE';
  public contentStrokeStyle:string | CanvasGradient | CanvasPattern = '#222222';
  public chartFillStyle:string | CanvasGradient | CanvasPattern = '#FFFFFF';
  public chartStrokeStyle:string | CanvasGradient | CanvasPattern = '#000000';
  public chartContainerRectVisible = false;
  public chartMarginRectVisible = false;
  public chartPaddingRectVisible = false;
  public chartCrossGrideVisible = true;
  public chartCrossGrideXCount = 10;
  public chartCrossGrideYCount = 10;
  public chartAxisXCount = 15;
  public chartAxisXGuideSize = 5; //수치눈꿈 사이즈
  public chartAxisYCount = 15;
  public chartAxisYGuideSize = 5;
  public chartAxisXVisible = true;
  public chartAxisYVisible = true;
  public chartAxisScaleVisible = true; //아래쪽에 보이는 스케일 표식 보일거냐?
  public chartAxisXFnc = (data: any, index?: number) => {
    return data;
  }; //화면에 값뿌려줄때 어떻게 뿌려줄꺼냐
  public chartAxisYFnc = (data: any, index?: number) => {
    return data;
  };
  public chartDataVisible = true; //차트에 값표시할꺼냐
  public chartAxisXDataMin?: number = undefined; //셋팅되지않으면 데이터값의 min max값으로처리
  public chartAxisXDataMax?: number = undefined;
  public chartAxisYDataMin?: number = undefined;
  public chartAxisYDataMax?: number = undefined;
  public chartAxisXDataMinMarginPercent: number = 10;
  public chartAxisXDataMaxMarginPercent: number = 10;
  public chartAxisYDataMinMarginPercent: number = 10;
  public chartAxisYDataMaxMarginPercent: number = 10;
  public chartCrossStrokeStyle = '#EEEEEE';
  public containerRect?: Rect = undefined;	//그래프의 최상단 컨테이너 Rect
  public contentRect?: Rect = undefined;	//그래프의 컨텐츠를 담는 Rect
  public chartRect?: Rect = undefined;	//그래프의 차트를 담는 Rect
  public chartDataRect?: Rect = undefined;	//실질적으로 그래프Data가 그려지는곳
  public tpadding = 10;
  public rpadding = 10;
  public bpadding = 10;
  public lpadding = 10;
  public tmargin = 10;
  public rmargin = 10;
  public bmargin = 10;
  public lmargin = 10;
  public tChartPadding = 10;
  public rChartPadding = 10;
  public bChartPadding = 10;
  public lChartPadding = 10;
  public data: GraphDataSet = new GraphDataSet();

  public constructor(targetCanvas: HTMLCanvasElement | string) {
    if (typeof targetCanvas === 'string') {
      this.canvas = document.querySelector(targetCanvas) as HTMLCanvasElement;
    } else {
      this.canvas = targetCanvas;
    }
  }


  onMouseTraking() {
    var useThis = this;
    this.canvas.addEventListener('mousemove', function (event) {
      var yMin = useThis.chartAxisYDataMin ?? 0;
      var yMax = useThis.chartAxisYDataMax ?? 0;
      var xMin = useThis.chartAxisXDataMin ?? 0;
      var xMax = useThis.chartAxisXDataMax ?? 0;
      event.preventDefault();
      // @ts-ignore
      var rect = event.target.getBoundingClientRect();
      var point = new Point(event.clientX - rect.left, event.clientY - rect.top);
      // @ts-ignore
      var chartDataPoint = new Point(point.x - useThis.chartDataRect.getStartX(), point.y - useThis.chartDataRect.getStartY());

      if (useThis.context && useThis.endCanvas) {
        useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
        useThis.context.drawImage(useThis.endCanvas, 0, 0);
        useThis.context.fillStyle = '#000000';
        useThis.context.strokeStyle = '#000000';
        useThis.context.beginPath();
        useThis.context.moveTo(point.x, 0);
        useThis.context.lineTo(point.x, useThis.endCanvas.height);
        useThis.context.moveTo(0, point.y);
        useThis.context.lineTo(useThis.endCanvas.width, point.y);
        useThis.context.stroke();
        var atDataPoint = useThis.getDrawChartData(chartDataPoint, xMin, xMax, yMin, yMax);
        useThis.context.textAlign = 'end';
        useThis.context.textBaseline = 'bottom';
//        useThis.context.fillText(atDataPoint.y+",  "+atDataPoint.x+" ", point.x, point.y);
        if (atDataPoint)
          useThis.context.fillText(useThis.chartAxisYFnc(atDataPoint.y) + ',  ' + useThis.chartAxisXFnc(atDataPoint.x) + ' ', point.x, point.y);
        useThis.context.textAlign = 'left';
        useThis.context.textBaseline = 'top';
        useThis.context.fillText('     ' + point.y + ',  ' + point.x, point.x, point.y);
      }

    }, false);
  }

  setYLine(yVal: number) {
    var useThis = this;
    if (useThis.context && useThis.endCanvas) {
      useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
      useThis.context.drawImage(useThis.endCanvas, 0, 0);
      var yMin = useThis.chartAxisYDataMin ?? 0;
      var yMax = useThis.chartAxisYDataMax ?? 0;
      var xMin = useThis.chartAxisXDataMin ?? 0;
      var xMax = useThis.chartAxisXDataMax ?? 0;
      var point = new Point(xMin, yVal);
      //getDrawChartPoint(point, xMin, xMax, yMin, yMax){
      var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
      if (pxPoint) {
        useThis.context.fillStyle = '#000000';
        useThis.context.strokeStyle = '#000000';
        useThis.context.beginPath();
        useThis.context.moveTo(0, pxPoint.y);
        useThis.context.lineTo(useThis.endCanvas.width, pxPoint.y);
        useThis.context.stroke();
      }
    }
  }

  setXLine(xVal: number) {
    var useThis = this;
    if (useThis.context && useThis.endCanvas) {
      useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
      useThis.context.drawImage(useThis.endCanvas, 0, 0);
      var yMin = useThis.chartAxisYDataMin ?? 0;
      var yMax = useThis.chartAxisYDataMax ?? 0;
      var xMin = useThis.chartAxisXDataMin ?? 0;
      var xMax = useThis.chartAxisXDataMax ?? 0;
      var point = new Point(xVal, yMin);
      //getDrawChartPoint(point, xMin, xMax, yMin, yMax){
      var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
      if (pxPoint) {
        useThis.context.fillStyle = '#000000';
        useThis.context.strokeStyle = '#000000';
        useThis.context.beginPath();
        useThis.context.moveTo(pxPoint.x, 0);
        useThis.context.lineTo(pxPoint.x, useThis.endCanvas.height);
        useThis.context.stroke();
      }
    }
  }

  setXLines(xValArr: number[]) {
    var useThis = this;
    if (useThis.context && useThis.endCanvas) {
      useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
      useThis.context.drawImage(useThis.endCanvas, 0, 0);
      var yMin = useThis.chartAxisYDataMin ?? 0;
      var yMax = useThis.chartAxisYDataMax ?? 0;
      var xMin = useThis.chartAxisXDataMin ?? 0;
      var xMax = useThis.chartAxisXDataMax ?? 0;
      for (var i = 0; i < xValArr.length; i++) {
        var xVal = xValArr[i]
        var point = new Point(xVal, yMin);
        //getDrawChartPoint(point, xMin, xMax, yMin, yMax){
        var pxPoint = this.getDrawChartPoint(point, xMin, xMax, yMin, yMax)
        if (pxPoint) {
          useThis.context.fillStyle = '#000000';
          useThis.context.strokeStyle = '#000000';
          useThis.context.beginPath();
          useThis.context.moveTo(pxPoint.x, 0);
          useThis.context.lineTo(pxPoint.x, useThis.endCanvas.height);
          useThis.context.stroke();
        }
      }
    }
  }

  onDrag() {
    var useThis = this;
    let dragStartPoint: Point | undefined = undefined; // canvas의 절대좌표
    var dragEndPoint: Point | undefined = undefined;

    var dragChartDataStartPoint: Point | undefined = undefined;	//ChartData 그래프데이터 그리는곳부터 상대좌표
    var dragChartDataEndPoint: Point | undefined = undefined;


    var handleMouseEvent = (event: MouseEvent) => {
      var yMin = useThis.chartAxisYDataMin ?? 0;
      var yMax = useThis.chartAxisYDataMax ?? 0;
      var xMin = useThis.chartAxisXDataMin ?? 0;
      var xMax = useThis.chartAxisXDataMax ?? 0;
      const target = event.target;
      if (target && target instanceof HTMLElement && useThis.chartDataRect && useThis.chartRect && useThis.canvas && useThis.context && useThis.endCanvas) {
        var rect = target.getBoundingClientRect();
        var point = new Point(event.clientX - rect.left, event.clientY - rect.top);
        var chartDataPoint = new Point(point.x - useThis.chartDataRect.getStartX(), point.y - useThis.chartDataRect.getStartY());
        if (event.type == 'mousedown') {
          if (useThis.chartRect.isHit(point.x, point.y)) {
            dragStartPoint = point;
            dragChartDataStartPoint = chartDataPoint;
          }
        } else if (event.type == 'mousemove') {
          if (useThis.chartRect.isHit(point.x, point.y) && dragStartPoint) {
            if (dragEndPoint) {//우선지워라.
              useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
              useThis.context.drawImage(useThis.endCanvas, 0, 0);
            }
            dragEndPoint = point;
            dragChartDataEndPoint = chartDataPoint;

            useThis.context.fillStyle = 'rgba(200, 200, 200, 0.3)';
            useThis.context.fillRect(dragStartPoint.x, dragStartPoint.y, point.x - dragStartPoint.x, point.y - dragStartPoint.y);
            useThis.context.fillStyle = '#000000';
            if (dragChartDataStartPoint) {
              var atStartData = useThis.getDrawChartData(dragChartDataStartPoint, xMin, xMax, yMin, yMax);
              var atEndData = useThis.getDrawChartData(dragChartDataEndPoint, xMin, xMax, yMin, yMax);
            }
//				useThis.context.fillText(atStartData.y+",  "+atStartData.x, dragStartPoint.x, dragStartPoint.y);
//				useThis.context.fillText("    "+atEndData.y+",  "+atEndData.x, dragEndPoint.x, dragEndPoint.y);
            if (atStartData && atEndData) {
              useThis.context.fillText(useThis.chartAxisYFnc(atStartData.y) + ',  ' + useThis.chartAxisXFnc(atStartData.x), dragStartPoint.x, dragStartPoint.y);
              useThis.context.fillText('    ' + useThis.chartAxisYFnc(atEndData.y) + ',  ' + useThis.chartAxisXFnc(atEndData.x), dragEndPoint.x, dragEndPoint.y);
            }
          }
        } else if (event.type == 'mouseup') {
          useThis.context.clearRect(0, 0, useThis.endCanvas.width, useThis.endCanvas.height);
          useThis.context.drawImage(useThis.endCanvas, 0, 0);
          if (dragStartPoint && dragEndPoint && dragChartDataStartPoint && dragChartDataEndPoint) {
            var dragChartDataBetweenStartPoint = new Point(Math.min(dragChartDataStartPoint.x, dragChartDataEndPoint.x), Math.min(dragChartDataStartPoint.y, dragChartDataEndPoint.y));
            var dragChartDataBetweenEndPoint = new Point(Math.max(dragChartDataStartPoint.x, dragChartDataEndPoint.x), Math.max(dragChartDataStartPoint.y, dragChartDataEndPoint.y));
            var atStartData = useThis.getDrawChartData(dragChartDataBetweenStartPoint, xMin, xMax, yMin, yMax);
            var atEndData = useThis.getDrawChartData(dragChartDataBetweenEndPoint, xMin, xMax, yMin, yMax);
            // @ts-ignore
            var graphDataKSet = useThis.data.getBetweenData(atStartData, atEndData);
            if (graphDataKSet.length > 0 && atStartData && atEndData) {
              useThis.chartAxisYDataMin = Number(atEndData.y);
              useThis.chartAxisYDataMax = Number(atStartData.y);
              useThis.chartAxisXDataMin = Number(atStartData.x);
              useThis.chartAxisXDataMax = Number(atEndData.x);
            } else {
              useThis.chartAxisYDataMin = undefined;
              useThis.chartAxisYDataMax = undefined;
              useThis.chartAxisXDataMin = undefined;
              useThis.chartAxisXDataMax = undefined;
            }

            useThis.rendering();
          }
          dragStartPoint = undefined;
          dragChartDataStartPoint = undefined;
          dragEndPoint = undefined;
          dragChartDataEndPoint = undefined;
        } else if (event.type == 'mouseout') {
        } else if (event.type == 'mouseover') {
        }
      }


    }
    this.canvas.addEventListener('mousedown', handleMouseEvent, false);
    this.canvas.addEventListener('mousemove', handleMouseEvent, false);
    this.canvas.addEventListener('mouseup', handleMouseEvent, false);
    this.canvas.addEventListener('mouseout', handleMouseEvent, false);
    this.canvas.addEventListener('mouseover', handleMouseEvent, false);
  }

  rendering() {
    this.endCanvas = SimpleGraphUtils.copyCanvas(this.canvas);
    this.canvas.height = this.canvas.clientHeight;
    this.canvas.width = this.canvas.clientWidth;
    this.endCanvas.height = this.endCanvas.clientHeight;
    this.endCanvas.width = this.endCanvas.clientWidth;

    this.context = this.canvas.getContext('2d');
    if (this.context) {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      // this.context.clearRect(0, 0, this.context.width, this.context.height);
      this.context.lineWidth = 1;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
    }


    //container
    this.containerRect = new Rect(0, 0, this.canvas.width, this.canvas.height);
    if (this.chartContainerRectVisible && this.context)
      this.containerRect.strokeRect(this.context);


    //content  margin set     (t,r,b,l)
    this.contentRect = this.containerRect.getPadding(this.tmargin, this.rmargin, this.bmargin, this.lmargin);
    this.contentRect.fillRect(this.context, this.contentFillStyle);
    if (this.chartMarginRectVisible && this.context)
      this.contentRect.strokeRect(this.context, this.contentStrokeStyle);


    //chart padding set  (t,r,b,l)
    this.chartRect = this.contentRect.getPadding(this.tpadding, this.rpadding, this.bpadding, this.lpadding);
    this.chartRect.fillRect(this.context, this.chartFillStyle);
    if (this.chartPaddingRectVisible && this.context)
      this.chartRect.strokeRect(this.context, this.chartStrokeStyle);

    this.chartDataRect = this.chartRect.getPadding(this.tChartPadding, this.rChartPadding, this.bChartPadding, this.lChartPadding);
//	this.chartDataRect.strokeRect(this.context, this.chartStrokeStyle);

    //title draw
    if (this.context) {
      var metrix = this.context.measureText(this.contentTitle);
      var line_width = metrix.width;
      this.context.textBaseline = 'bottom';
      this.context.fillText(this.contentTitle, this.contentRect.getCentX(), this.contentRect.getStartY());
      //context.fillText(this.contentTitle, contentRect.getCentX()-(line_width/2), this.tmargin);
    }
    //


    this.chartAxisXDataMin = (this.chartAxisXDataMin == undefined ? this.data.getDataXMin() : this.chartAxisXDataMin);
    this.chartAxisYDataMin = (this.chartAxisYDataMin == undefined ? this.data.getDataYMin() : this.chartAxisYDataMin);
    this.chartAxisXDataMax = (this.chartAxisXDataMax == undefined ? this.data.getDataXMax() : this.chartAxisXDataMax);
    this.chartAxisYDataMax = (this.chartAxisYDataMax == undefined ? this.data.getDataYMax() : this.chartAxisYDataMax);


    /////////chart  draw
    this.drawChartCosssGrid();
    this.drawChartData(this.data);
    this.drawChartAxisGuide();


    this.endCanvas = SimpleGraphUtils.copyCanvas(this.canvas);
//	this.endCanvas.width = this.canvas.width;
//	this.endCanvas.height = this.canvas.height;

  };


  drawChartData(graphDataKSet: GraphDataSet) {
    if (this.context) {
      this.context.textAlign = 'center';
      this.context.textBaseline = 'bottom';
      var w = this.canvas.width;
      var h = this.canvas.height;
      this.context.save();
      if (this.chartRect)
        this.context.rect(this.chartRect.getStartX(), this.chartRect.getStartY(), this.chartRect.width, this.chartRect.height);
//	this.context.fillStyle = "#aa0000";  this.context.fill();
      // 그래프 부분을 클리핑
      this.context.clip();

      //chart grid Data
      for (var i = 0; i < graphDataKSet.length; i++) {//GraphDataKSet :  [GraphDataK,.....]
        var atGraphKData = graphDataKSet.get(i); // GraphKData
        //draw...
        if (atGraphKData.type == 'line') {
          this.drawChartLineData(atGraphKData);
        } else if (atGraphKData.type == 'linefill') {
          this.drawChartLineFillData(atGraphKData);
        } else if (atGraphKData.type == 'linegroup') {
          this.drawChartLineGroupData(atGraphKData);
        } else if (atGraphKData.type == 'dot') {
          this.drawChartDotData(atGraphKData);
        } else if (atGraphKData.type == 'arc') {
          this.drawChartArcData(atGraphKData);
        } else if (atGraphKData.type == 'stick') {
          this.drawChartStickData(atGraphKData);
        } else if (Object.prototype.toString.call(atGraphKData.type) == '[object Function]') {
          this.drawChartCustomData(atGraphKData);
        }
        if (atGraphKData.type == 'bezoer') {
          this.drawChartBezoerLineData(atGraphKData);
        } else {
        }
      }
      this.context.restore()
    }
  }

  drawChartLineData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.beginPath();

      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        if (i == 0) { //처음
          this.context.moveTo(atPoint.x, atPoint.y);
        } else {
          this.context.lineTo(atPoint.x, atPoint.y);
        }


        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
      }
      //this.context.fillStyle = '#8ED6FF';
      //this.context.fill();
//	this.context.closePath();
      this.context.stroke();
    }

  }

  drawChartBezoerLineData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.beginPath();

      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        if (i == 0) { //처음
          this.context.moveTo(atPoint.x, atPoint.y);
        } else {
          this.context.bezierCurveTo(atPoint.x, atPoint.y, atPoint.x + 55, atPoint.y + 55, atPoint.x, atPoint.y);
        }


        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
      }
      //this.context.fillStyle = '#8ED6FF';
      //this.context.fill();
//	this.context.closePath();
      this.context.stroke();
    }
  }

  drawChartLineFillData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.beginPath();

      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        if (i == 0) { //처음
          //this.context.moveTo(atPoint.x, atPoint.y);
          this.context.moveTo(atPoint.x, this.canvas.height);
          this.context.lineTo(atPoint.x, atPoint.y);
        } else {
          this.context.lineTo(atPoint.x, atPoint.y);
        }

        if ((i + 1) == pointArray.length) {
          this.context.lineTo(atPoint.x, this.canvas.height);

        }

        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
      }
      //this.context.fillStyle = '#8ED6FF';
      this.context.fill();
      this.context.closePath();
      this.context.stroke();
    }

  }

  drawChartLineGroupData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.beginPath();
      var width = graphKData.width;
      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        if (width !== undefined && i % width == 0) {
          this.context.moveTo(atPoint.x, atPoint.y);
        }
        if (i == 0) { //처음
          this.context.moveTo(atPoint.x, atPoint.y);
        } else {
          this.context.lineTo(atPoint.x, atPoint.y);
        }

        var widthH = 10 / 2;
        var startX = atPoint.x - widthH;
        var startY = atPoint.y - widthH;
        this.context.fillRect(startX, startY, widthH, widthH);

        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
      }
      //this.context.fillStyle = '#8ED6FF';
      //this.context.fill();
//	this.context.closePath();
      this.context.stroke();

    }
  }

  drawChartDotData(graphData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphData.strokeStyle;
      this.context.fillStyle = graphData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';


      var pointArray = this.getDrawChartPoints(graphData);
      console.log('----->pointArray', graphData, pointArray)
      for (var i = 0; i < pointArray.length; i++) {
        this.context.beginPath();
        var atPoint = pointArray[i];
        var widthH = (graphData.width / 2);
        var startX = atPoint.x - widthH;
        var startY = atPoint.y - widthH;
        // console.log('atPoint : x:'+atPoint.x+"   y:"+atPoint.y);
        // console.log('start : x:'+startX+"   y:"+startY);
        this.context.fillRect(startX, startY, graphData.width, graphData.width);
        this.context.fillStyle = '#000000';
        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
        this.context.fillStyle = graphData.strokeStyle;
        this.context.stroke();
      }

    }
  }

  drawChartArcData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';

      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        this.context.beginPath();
        var atPoint = pointArray[i];
        var widthH = (graphKData.width / 2);
        this.context.arc(atPoint.x, atPoint.y, graphKData.width, 0, Math.PI * 2, true);
        this.context.fill();
        this.context.fillStyle = '#000000';
        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
        this.context.fillStyle = graphKData.strokeStyle;
        this.context.stroke();
      }
    }
  }

  drawChartStickData(graphKData: GraphData) { //GraphDataK
    if (this.context && this.chartRect) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.beginPath();

      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        var widthH = (graphKData.width / 2);

        var startX = atPoint.x - widthH;
        var startY = atPoint.y;
        this.context.fillRect(startX, startY, graphKData.width, this.chartRect.getEndY() - startY);
        if (this.chartDataVisible)
          this.context.fillText(atPoint.value, atPoint.x, atPoint.y);
      }
      this.context.stroke();
    }

  }

////Point, GraphDataKSet
//차트데이터 데이터값을주면  상대좌표를 픽셀을 돌려준다.  복합.
  getDrawChartPoints(graphData: GraphData) {

    var dataArray = graphData.data;  //[Object,....]
    var pointArray = new Array();
    for (var i = 0; dataArray && i < dataArray.length; i++) {
      var atData = dataArray[i];	//Object   ex: {x:1,y:1}
      //console.log('atData : x:'+atData.x+"   y:"+atData.y);
      var point = this.getDrawChartPoint(
        // @ts-ignore
        new Point(atData[graphData.xVarName], atData[graphData.yVarName]),
        this.chartAxisXDataMin ?? 0, this.chartAxisXDataMax ?? 0,
        this.chartAxisYDataMin ?? 0, this.chartAxisYDataMax ?? 0
      );
      if (point) {
        // @ts-ignore
        point.value = atData[graphData.yVarName] + ', ' + atData[graphData.xVarName];
        // @ts-ignore
        // point.yvalue = Number(atData[graphData.yVarName]);
        // @ts-ignore
        // point.xvalue = Number(atData[graphData.xVarName]);
        pointArray.push(point);
      }
    }
    return pointArray;
  }


  drawChartCustomData(graphKData: GraphData) {//GraphDataK
    if (this.context) {
      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle; //스타일있으면 그걸로셋팅.
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';


      var pointArray = this.getDrawChartPoints(graphKData);
      for (var i = 0; i < pointArray.length; i++) {
        var atPoint = pointArray[i];
        // TODO: 뭐지?
        // graphKData.type(this.context, atPoint, graphKData);
      }

      this.context.strokeStyle = graphKData.strokeStyle;
      this.context.fillStyle = graphKData.strokeStyle;
      this.context.stroke();
    }
  }


//Point, GraphDataKSet
//차트데이터 데이터값을주면  상대좌표를 픽셀을 돌려준다.
  getDrawChartPoint(point: Point, xMin: number, xMax: number, yMin: number, yMax: number) {
    xMin = Number(xMin);
    xMax = Number(xMax);
    yMin = Number(yMin);
    yMax = Number(yMax);
    var yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);
    var xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);

    var yMinMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
    var yMaxMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
    var xMinMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
    var xMaxMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);

    if (yMinMargin == 0) {//2016027 크기가 하나로 다동일할떄 차이값이 0이 나와서 화면에 제대로 안그려진다 이떄 조치.
      yMinMargin = this.chartAxisYDataMinMarginPercent;
    }
    if (yMaxMargin == 0) {
      yMaxMargin = this.chartAxisYDataMaxMarginPercent;
    }
    if (xMinMargin == 0) {
      xMinMargin = this.chartAxisXDataMinMarginPercent;
    }
    if (xMaxMargin == 0) {
      xMaxMargin = this.chartAxisXDataMaxMarginPercent;
    }

    //datamargin
    yMin = yMin - yMinMargin;
    yMax = yMax + yMaxMargin;
    xMin = xMin - xMinMargin;
    xMax = xMax + xMaxMargin;
    yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);//yMinMargin;
    xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);//xMinMargin;
    ////////

    var yAtData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, point.y); //ex) 10(원하는거) - 7(민) = 3(차)
    var xAtData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, point.x);

    var yDataPercent = SimpleGraphUtils.getPercentByTot(yData_BetweenLength, yAtData_BetweenLength); // 전체차에서  원하는값의차는 몇%인가
    var xDataPercent = SimpleGraphUtils.getPercentByTot(xData_BetweenLength, xAtData_BetweenLength);
    if (this.chartDataRect && this.containerRect) {
      var yPoint = SimpleGraphUtils.getValueByTotInPercent(this.chartDataRect.height, yDataPercent);//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
      var xPoint = SimpleGraphUtils.getValueByTotInPercent(this.chartDataRect.width, xDataPercent);
      var ySet = this.chartDataRect.getEndY() - yPoint;
      var xSet = this.chartDataRect.getStartX() + xPoint;
      if (ySet && xSet) {
        return new Point(Number(xSet.toFixed(2)), Number(ySet.toFixed(2)));
      } else {
        return new Point(this.containerRect.getEndX() / 2, this.containerRect.getEndY() / 2);
      }
    }
  }

//Point, GraphDataKSet
//차트데이터 안쪽에서의 상대좌표를 픽셀을주면  이에따른   데이터 값을 돌려준다.
  getDrawChartData(point: Point, xMin: number, xMax: number, yMin: number, yMax: number) {
    xMin = Number(xMin);
    xMax = Number(xMax);
    yMin = Number(yMin);
    yMax = Number(yMax);
    var yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);
    var xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);
    var yMinMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
    var yMaxMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
    var xMinMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
    var xMaxMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);


    //datamargin
    yMin = yMin - yMinMargin;
    yMax = yMax + yMaxMargin;
    xMin = xMin - xMinMargin;
    xMax = xMax + xMaxMargin;
    yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);//yMinMargin;
    xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);//xMinMargin;
    ////////


    if (this.chartDataRect) {
      var yPointPercent = SimpleGraphUtils.getPercentByTot(this.chartDataRect.height, point.y); // 전체차에서  원하는값의차는 몇%인가
      var xPointPercent = SimpleGraphUtils.getPercentByTot(this.chartDataRect.width, point.x);

      var yData = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, yPointPercent);//전체값의 몇 퍼센트는 얼마? 계산법 공식 ;  전체값 X 퍼센트 ÷ 100
      var xData = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, xPointPercent);

      var ySet = yMax - yData;
      var xSet = xMin + xData;
      return new Point(Number(xSet.toFixed(2)), Number(ySet.toFixed(2)));
    }
  }


//Chart에 격자무늬그려라..
  drawChartCosssGrid() {
    if (this.context && this.chartRect) {
      var xcrossCharP = this.chartRect.width / this.chartCrossGrideXCount;
      var ycrossCharP = this.chartRect.height / this.chartCrossGrideYCount;

      this.context.strokeStyle = this.chartCrossStrokeStyle;
      this.context.beginPath();
      for (var i = 0; this.chartCrossGrideVisible && i <= this.chartCrossGrideXCount; i++) {
        this.context.moveTo(this.chartRect.getStartX() + (xcrossCharP * i), this.chartRect.getStartY());
        this.context.lineTo(this.chartRect.getStartX() + (xcrossCharP * i), this.chartRect.getEndY());
      }
      for (var i = 0; this.chartCrossGrideVisible && i <= this.chartCrossGrideYCount; i++) {
        this.context.moveTo(this.chartRect.getStartX(), this.chartRect.getStartY() + (ycrossCharP * i));
        this.context.lineTo(this.chartRect.getEndX(), this.chartRect.getStartY() + (ycrossCharP * i));
      }
      this.context.stroke();
    }

  }

  drawChartAxisGuide() {
    if (this.context && this.chartDataRect && this.chartRect) {
      this.context.strokeStyle = this.chartStrokeStyle;
      this.context.fillStyle = this.chartStrokeStyle; //스타일있으면 그걸로셋팅.
      //data Gride
      var yMin = this.chartAxisYDataMin ?? 0;;
      var yMax = this.chartAxisYDataMax ?? 0;;
      var xMin = this.chartAxisXDataMin ?? 0;;
      var xMax = this.chartAxisXDataMax ?? 0;;

      var yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);
      var xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);


      var yMinMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMinMarginPercent);
      var yMaxMargin = SimpleGraphUtils.getValueByTotInPercent(yData_BetweenLength, this.chartAxisYDataMaxMarginPercent);
      var xMinMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMinMarginPercent);
      var xMaxMargin = SimpleGraphUtils.getValueByTotInPercent(xData_BetweenLength, this.chartAxisXDataMaxMarginPercent);

      //datamargin
      yMin = yMin - yMinMargin;
      yMax = yMax + yMaxMargin;
      xMin = xMin - xMinMargin;
      xMax = xMax + xMaxMargin;
      yData_BetweenLength = SimpleGraphUtils.getBetweenLength(yMin, yMax);//yMinMargin;
      xData_BetweenLength = SimpleGraphUtils.getBetweenLength(xMin, xMax);//xMinMargin;
      ////////

      var xChar = (xMax - xMin);
      var xP = xChar / this.chartAxisXCount;
      var xGP = this.chartDataRect.width / this.chartAxisXCount;
      var yChar = (yMax - yMin);
      var yP = yChar / this.chartAxisYCount;
      var yGP = this.chartDataRect.height / this.chartAxisYCount;
      //>> X
      this.context.textAlign = 'left';
//	this.context.textBaseline	= "end";
      this.context.textBaseline = 'top';

      this.context.strokeStyle = this.chartStrokeStyle;
      for (var i = 0; this.chartAxisXVisible && i <= this.chartAxisXCount; i++) {
        this.context.beginPath();
        var setX = this.chartDataRect.getStartX() + (xGP * i);
        var setY = this.chartRect.getEndY();
        var atData = (xMin + (xP * i)).toFixed(1);					//사용자가 정의한 트랜스퍼 함수있으면 그거태워라
        atData = this.chartAxisXFnc ? this.chartAxisXFnc(atData, i) : atData;
        this.context.fillText(atData, setX, setY);  //chart padding값..추가
        //눈꿈그리기
        this.context.moveTo(setX, setY);
        this.context.lineTo(setX, setY - this.chartAxisXGuideSize);
        this.context.stroke();
      }
      //>> Y
      this.context.textAlign = 'left';
      this.context.textBaseline = 'bottom';
      for (var i = 0; this.chartAxisYVisible && i <= this.chartAxisYCount; i++) {
        this.context.beginPath();
        var setX = this.chartRect.getStartX();
        var setY = this.chartDataRect.getEndY() - (yGP * i);
        var atData = (yMin + (yP * i)).toFixed(1);					//사용자가 정의한 트랜스퍼 함수있으면 그거태워라
        atData = this.chartAxisYFnc ? this.chartAxisYFnc(atData) : atData;
        this.context.fillText(atData, setX, setY);  //chart padding값..추가
        //눈꿈그리기
        this.context.moveTo(setX, setY);
        this.context.lineTo(setX + this.chartAxisYGuideSize, setY);
        this.context.stroke();
      }


      if (this.chartAxisScaleVisible) {
        this.context.fillStyle = 'rgba(225, 225, 225, 0.5)';//"#EAEAEA";
        this.context.fillRect(this.chartDataRect.getStartX(), this.chartDataRect.getEndY(), this.chartDataRect.width, 10);
        this.context.fillRect(this.chartDataRect.getEndX(), this.chartDataRect.getStartY(), 10, this.chartDataRect.height);
        //xMin
        //xMax
        //yData_BetweenLength
        //xData_BetweenLength

        var xBetweenLength = SimpleGraphUtils.getBetweenLength(this.chartDataRect.getStartX(), this.chartDataRect.getEndX());
        var yBetweenLength = SimpleGraphUtils.getBetweenLength(this.chartDataRect.getStartY(), this.chartDataRect.getEndY());
        //	console.log("var xBetweenLength		= Utils.getBetweenLength(this.chartDataRect.getStartX(), this.chartDataRect.getEndX());");
        //	console.log(xBetweenLength +"  " +this.chartDataRect.getStartX()+"  "+this.chartDataRect.getEndX());
        var xDataBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataXMin()??0, this.data.getDataXMax()??0);
        var yDataBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataYMin()??0, this.data.getDataYMax()??0);
        //	console.log("var dataBetweenLength 	= Utils.getBetweenLength(this.data.getDataXMin(), this.data.getDataXMax());");
        //	console.log(dataBetweenLength +"  " +this.data.getDataXMin()+"  "+this.data.getDataXMax());
        var xMinBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataXMin()??0, xMin);
        var yMinBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataYMin()??0, yMin);
        //	console.log("var xMinBetweenLength 	= Utils.getBetweenLength(this.data.getDataXMin(), xMin);");
        //	console.log(xMinBetweenLength +"  " +this.data.getDataXMin()+"  "+xMin);
        var xMaxBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataXMin()??0, xMax);
        var yMaxBetweenLength = SimpleGraphUtils.getBetweenLength(this.data.getDataYMin()??0, yMax);
        //	console.log("var xMaxBetweenLength 	= Utils.getBetweenLength(this.data.getDataXMin(), xMax);");
        //	console.log(xMaxBetweenLength +"  " +this.data.getDataXMin()+"  "+xMax);

        var xMinPercent = SimpleGraphUtils.getPercentByTot(xDataBetweenLength, xMinBetweenLength);
        var yMinPercent = SimpleGraphUtils.getPercentByTot(yDataBetweenLength, yMinBetweenLength);
        //	console.log("var xMinPercent			= Utils.getPercentByTot(dataBetweenLength, xMinBetweenLength);");
        //	console.log(xMinPercent +"  " +dataBetweenLength+"  "+xMinBetweenLength);
        var xMaxPercent = SimpleGraphUtils.getPercentByTot(xDataBetweenLength, xMaxBetweenLength);
        var yMaxPercent = SimpleGraphUtils.getPercentByTot(yDataBetweenLength, yMaxBetweenLength);
        //	console.log("var xMaxPercent			= Utils.getPercentByTot(dataBetweenLength, xMaxBetweenLength);");
        //	console.log(xMaxPercent +"  " +dataBetweenLength+"  "+xMaxBetweenLength);

        var startX = SimpleGraphUtils.getValueByTotInPercent(xBetweenLength, xMinPercent);
        var startY = SimpleGraphUtils.getValueByTotInPercent(yBetweenLength, yMinPercent);
        //	console.log("var startX				= Utils.getValueByTotInPercent(xBetweenLength, xMinPercent);");
        //	console.log(startX +"  " +xBetweenLength+"  "+xMinPercent);
        var setWidth = SimpleGraphUtils.getValueByTotInPercent(this.chartDataRect.width, xMaxPercent);
        var setHeight = SimpleGraphUtils.getValueByTotInPercent(this.chartDataRect.height, yMaxPercent);
        //	console.log("var setWidth			= Utils.getValueByTotInPercent(this.chartDataRect.width, xMaxPercent);");
        //	console.log(setWidth +"  " +this.chartDataRect.width+"  "+xMaxPercent);
        if (startX < 0) {
          startX = 0;
        }
        if (startY < 0) {
          startY = 0;
        }
        if (setWidth > this.chartDataRect.width) {
          setWidth = this.chartDataRect.width;
        }
        if (setHeight > this.chartDataRect.height) {
          setHeight = this.chartDataRect.height;
        }
        //	console.log (
        //			" xMin                " + xMin               +
        //			"\r\n xMax                " + xMax               +
        //			"\r\n"+
        //			"\r\n this.data.getDataXMax() " + this.data.getDataXMax()               +
        //			"\r\n this.data.getDataXMin() " + this.data.getDataXMin()               +
        //			"\r\n"+
        //			"\r\n yData_BetweenLength " + yData_BetweenLength+
        //			"\r\n xData_BetweenLength " + xData_BetweenLength+
        //			"\r\n"+
        //			"\r\n xBetweenLength		 " + xBetweenLength		+
        //			"\r\n dataBetweenLength 	 " + dataBetweenLength 	+
        //			"\r\n"+
        //			"\r\n xMinBetweenLength 	 " + xMinBetweenLength 	+
        //			"\r\n xMaxBetweenLength 	 " + xMaxBetweenLength 	+
        //			"\r\n"+
        //			"\r\n xMinPercent		 " + xMinPercent		+
        //			"\r\n xMaxPercent		 " + xMaxPercent		+
        //			"\r\n"+
        //			"\r\n startX				 " + startX				+
        //			"\r\n setWidth			 " + setWidth
        //	);
        this.context.fillStyle = 'rgba(30, 30, 30, 0.5)';//"#EAEAEA";
        this.context.fillRect(this.chartDataRect.getStartX() + startX, this.chartDataRect.getEndY() + 2, setWidth - startX, 5);
        this.context.fillRect(this.chartDataRect.getEndX() + 2, this.chartDataRect.getEndY() - startY, 5, -setHeight + startY);

      }


    }
  }






  addData (data: GraphData){
    this.data.push(data);
  }

  setData (data: GraphDataSet){
    this.chartAxisXDataMin      = undefined;
    this.chartAxisXDataMax      = undefined;
    this.chartAxisYDataMin      = undefined;
    this.chartAxisYDataMax      = undefined;
    this.data = data;
  }






  setContentFillStyle (contentFillStyle: string | CanvasGradient | CanvasPattern){
    this.contentFillStyle = contentFillStyle;
  }
  setContentStrokeStyle (contentStrokeStyle: string | CanvasGradient | CanvasPattern){
    this.contentStrokeStyle = contentStrokeStyle;
  }
  setChartFillStyle (chartFillStyle: string | CanvasGradient | CanvasPattern){
    this.chartFillStyle = chartFillStyle;
  }
  setchartStrokeStyle (chartStrokeStyle: string | CanvasGradient | CanvasPattern){
    this.chartStrokeStyle = chartStrokeStyle;
  }
  setPadding (tpadding: number, rpadding: number, bpadding: number, lpadding: number){
    this.tpadding = tpadding;
    this.rpadding = rpadding;
    this.bpadding = bpadding;
    this.lpadding = lpadding;
  }

  setMargin (tmargin: number, rmargin: number, bmargin: number, lmargin: number){
    this.tmargin = tmargin;
    this.rmargin = rmargin;
    this.bmargin = bmargin;
    this.lmargin = lmargin;
  }
}