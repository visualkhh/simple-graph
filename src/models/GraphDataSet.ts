import { GraphData } from './GraphData';
import { Utils } from '../utils/Utils';
import { Point } from 'models/Point';

export class GraphDataSet extends Array {
  getDataXMax(name: string, defaultData = 0){
    var atData = this.getData(name);	//[GraphKData,...]
    var max = defaultData;
    for ( var i = 0; i < atData.length; i++) {
      var atMax = Utils.getMaxByObjectArray(atData[i].data, atData[i].xVarName);
      max = Math.max(max==undefined?atMax:max, atMax);
    }
    return max;
  }
  getDataXMin (name: string, defaultData = 0) {
    var atData = this.getData(name);	//[GraphKData,...]
    var min = defaultData;
    for ( var i = 0; i < atData.length; i++) {
      var atMin = Utils.getMinByObjectArray(atData[i].data, atData[i].xVarName); //[Object,..] -> min
      min = Math.min(min==undefined?atMin:min,atMin);
    }
    return min;
  }

  getDataYMax(name: string, defaultData = 0){
    var atData = this.getData(name);	//[GraphKData,...]
    var max = defaultData;
    for ( var i = 0; i < atData.length; i++) {
      var atMax = Utils.getMaxByObjectArray(atData[i].data,atData[i].yVarName);
      max = Math.max(max==undefined?atMax:max, atMax);
    }
    return max;
  }

  getDataYMin(name: string, defaultData = 0){
    var atData = this.getData(name);	//[GraphKData,...]
    var min = defaultData;
    for ( var i = 0; i < atData.length; i++) {
      var atMin = Utils.getMinByObjectArray(atData[i].data, atData[i].yVarName); //[Object,..] -> min
      min = Math.min(min==undefined?atMin:min,atMin);
    }
    return min;
  }

  getData(name: string){//[GraphKData,...]
    var getData = new GraphDataSet();
    if(name){
      for ( var i = 0; i < this.length; i++) {
        if(this[i].name == name)
          getData.push(this[i]);
      }
    }else{
      getData = this;
    }
    return getData;
  }


//min과 max의 사이의 길이.
  getDataXBetweenLength(name: string){//[GraphKData,...]
    return this.getDataXMax(name) - this.getDataXMin(name)
  }
//min과 max의 사이의 길이.
  getDataYBetweenLength(name: string){//[GraphKData,...]
    return this.getDataYMax(name) - this.getDataYMin(name)
  }
//PointK (data) ,PointK(data)
  getBetweenData(startData: Point, endData: Point, name: string){//[GraphKData,...]
    var newGraphDataKSet = new GraphDataSet();  	//data
    var graphDataKSet = this.getData(name); 		// [GraphDataK,...]
    for ( var i = 0 ;i < graphDataKSet.length; i++) {
      var atGraphDataK	= graphDataKSet[i];		//GraphDataK
      var dataArray		= atGraphDataK.data; 	//[{x:1,y:1},...]
      var newDataArray	= new Array();
      for ( var y = 0; y < dataArray.length; y++) {
        var atData 		= dataArray[y];	//Object   ex: {x:1,y:1} 
        var startX 	= Math.min(startData.x, endData.x);
        var endX 	= Math.max(startData.x, endData.x);
        var startY 	= Math.min(startData.y, endData.y);
        var endY 	= Math.max(startData.y, endData.y);
        if(startX <= Number(atData[atGraphDataK.xVarName]) && startY <= Number(atData[atGraphDataK.yVarName]) &&
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

}