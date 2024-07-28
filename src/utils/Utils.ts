export namespace Utils {
  export const getMinByObjectArray = (objectArray: any, varName: number | string) => {
    var min = undefined;
    if (varName && objectArray && objectArray.length > 0) {
      // @ts-ignore
      min = objectArray[0][varName];
      for (var i = 1; i < objectArray.length; i++) {
        // @ts-ignore
        min = Math.min(min, objectArray[i][varName]);
      }
    }
    return min;
  };
  export const getMaxByObjectArray = (objectArray: any, varName: number | string) => {
    var max = undefined;
    if (varName && objectArray && objectArray.length > 0) {
      // @ts-ignore
      max = objectArray[0][varName];
      for (var i = 1; i < objectArray.length; i++) {
        // @ts-ignore
        max = Math.max(max, objectArray[i][varName]);
      }
    }
    return max;
  };

  export const getSumByObjectArray = (objectArray: [][], varName: number | string) => {
    var sum = 0;
    if (varName && objectArray && objectArray.length > 0) {
      for (var i = 0; i < objectArray.length; i++) {
        // @ts-ignore
        sum += objectArray[i][varName];
      }
    }
    return sum;
  };


  export const createCanvas = (w: number, h: number) => {
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    return canvas;
  };
  const copyCanvas = (canvas: HTMLCanvasElement) => {
    var newCanvas = document.createElement('canvas');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    const context = newCanvas.getContext('2d');
    if (context) {
      context.drawImage(canvas, 0, 0);
    }
    return newCanvas;
  };
//end - start    끝과 시작의 사이길이를 취득한다.
  export const getBetweenLength = (start: number, end: number) => {
    return end - start;
  };

//전체값에서 일부값은 몇 퍼센트? 계산법 공식    tot에서  data는 몇%인가.
  export const getPercentByTot = (tot: number, data: number) => {
    /*
    전체값에서 일부값은 몇 퍼센트? 계산법 공식
    일부값 ÷ 전체값 X 100
    예제) 300에서 105는 몇퍼센트?
    답: 35%
    */
    return (data / tot) * 100;
  };
//전체값의 몇 퍼센트는 얼마? 계산법 공식    tot에서  wantPercent는 몇인가?
  export const getValueByTotInPercent = (tot: number, wantPercent: number) => {
    /*
    전체값 X 퍼센트 ÷ 100
    예제) 300의 35퍼센트는 얼마?
    답) 105
     */
    return (tot * wantPercent) / 100;
  };
//숫자를 몇 퍼센트 증가시키는 공식    tot에서  wantPercent을 증가 시킨다
  export const getValuePercentUp = (tot: number, wantPercent: number) => {
    /*
    숫자를 몇 퍼센트 증가시키는 공식
    숫자 X (1 + 퍼센트 ÷ 100)
    예제) 1548을 66퍼센트 증가하면?
    답) 2569.68
     */
    return tot * (1 + wantPercent / 100);
  };
//숫자를 몇 퍼센트 감소하는 공식    tot에서  wantPercent을 증감 시킨다
  export const getValuePercentDown = (tot: number, wantPercent: number) => {
    /*
    숫자를 몇 퍼센트 감소하는 공식
    숫자 X (1 - 퍼센트 ÷ 100)
    예제) 1548을 66퍼센트 감소하면?
    답) 526.32
     */
    return tot * (1 - wantPercent / 100);
  };

  export const getRandomColor = () => {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}