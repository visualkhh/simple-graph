import { GraphData } from './GraphData';
import { SimpleGraphUtils } from 'utils/SimpleGraphUtils';
import { Point } from 'models/Point';

export class GraphDataSet  {
  public datas: GraphData[] = []
  getDataXMax(name?: string){
    var atData = this.getData(name);	//[GraphKData,...]
    var max = undefined;
    for ( var i = 0; i < atData.length; i++) {
      var atMax = SimpleGraphUtils.getMaxByObjectArray(atData.get(i).data, atData.get(i).xVarName);
      max = Math.max(max==undefined?atMax:max, atMax);
    }
    return max;
  }
  public getDataXMin (name?: string) {
    var atData = this.getData(name);	//[GraphKData,...]
    var min = undefined;
    for ( var i = 0; i < atData.length; i++) {
      var atMin = SimpleGraphUtils.getMinByObjectArray(atData.get(i).data, atData.get(i).xVarName); //[Object,..] -> min
      min = Math.min(min==undefined?atMin:min,atMin);
    }
    return min;
  }

  getDataYMax(name?: string){
    var atData = this.getData(name);	//[GraphKData,...]
    var max = undefined;
    for ( var i = 0; i < atData.length; i++) {
      var atMax = SimpleGraphUtils.getMaxByObjectArray(atData.get(i).data,atData.get(i).yVarName);
      max = Math.max(max==undefined?atMax:max, atMax);
    }
    return max;
  }

  getDataYMin(name?: string){
    var atData = this.getData(name);	//[GraphKData,...]
    var min = undefined;
    for ( var i = 0; i < atData.length; i++) {
      var atMin = SimpleGraphUtils.getMinByObjectArray(atData.get(i).data, atData.get(i).yVarName); //[Object,..] -> min
      min = Math.min(min==undefined?atMin:min,atMin);
    }
    return min;
  }

  getData(name?: string){//[GraphKData,...]
    var getData = new GraphDataSet();
    if(name){
      for ( var i = 0; i < this.datas.length; i++) {
        if(this.datas[i].name == name)
          getData.push(this.datas[i]);
      }
    }else{
      getData = this;
    }
    return getData;
  }


//min과 max의 사이의 길이.
  getDataXBetweenLength(name: string){//[GraphKData,...]
    return (this.getDataXMax(name)??0) - (this.getDataXMin(name)??0)
  }
//min과 max의 사이의 길이.
  getDataYBetweenLength(name: string){//[GraphKData,...]
    return (this.getDataYMax(name)??0) - (this.getDataYMin(name)??0)
  }
//PointK (data) ,PointK(data)
  getBetweenData(startData: Point, endData: Point, name: string){//[GraphKData,...]
    var newGraphDataKSet = new GraphDataSet();  	//data
    var graphDataKSet = this.getData(name); 		// [GraphDataK,...]
    for ( var i = 0 ;i < graphDataKSet.length; i++) {
      var atGraphDataK	= graphDataKSet.get(i);		//GraphDataK
      var dataArray		= atGraphDataK.data; 	//[{x:1,y:1},...]
      var newDataArray	= new Array<Point>();
      for ( var y = 0; dataArray && y < dataArray.length; y++) {
        var atData 		= dataArray[y];	//Object   ex: {x:1,y:1} 
        var startX 	= Math.min(startData.x, endData.x);
        var endX 	= Math.max(startData.x, endData.x);
        var startY 	= Math.min(startData.y, endData.y);
        var endY 	= Math.max(startData.y, endData.y);
        // @ts-ignore
        if(startX <= Number(atData[atGraphDataK.xVarName]) && startY <= Number(atData[atGraphDataK.yVarName]) &&
          // @ts-ignore
          endX >= Number(atData[atGraphDataK.xVarName]) && endY >= Number(atData[atGraphDataK.yVarName])){
          newDataArray.push(atData);
        }
      }

      if(newDataArray.length>0){ //나중에 복사하는거 손좀봐야됨 
        var newGraphDataK = new GraphData();
        for (var property in atGraphDataK) {	//copy
          // @ts-ignore
          newGraphDataK[property] = atGraphDataK[property];
        }
          // @ts-ignore
        newGraphDataK.data = newDataArray;
        newGraphDataKSet.push(newGraphDataK);
      }
    }
    return newGraphDataKSet;
  }

  push(data: GraphData){
    this.datas.push(data);
  }
  pop(){
    return this.datas.pop();
  }
  shift(){
    return this.datas.shift();
  }
  unshift(data: GraphData){
    this.datas.unshift(data);
  }
  get(index: number){
    return this.datas[index];
  }
  set(index: number, data: GraphData){
    this.datas[index] = data;
  }
  get length(){
    return this.datas.length;
  }
  set length(length: number){
    this.datas.length = length;
  }
  remove(index: number){
    this.datas.splice(index, 1);
  }


}