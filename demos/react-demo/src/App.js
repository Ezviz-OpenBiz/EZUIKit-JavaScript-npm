import React from 'react';
import  EZUIKit from 'ezuikit-js';

import './App.css';


class App extends React.Component{
  constructor(props){
    super(props);
    this.playr = null; //定义播放器
  }
  componentDidMount(){
    this.playr = new EZUIKit.EZUIKitPlayer({
      id: 'video-container', // 视频容器ID
      accessToken: 'at.9ymd5rys4lk1zv6o2rtr51a624s9gl56-5fitodjuss-0tkvm8j-hras1ewfu',
      url: 'ezopen://open.ys7.com/203751922/1.live',
      template: 'security', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版；  
      // 视频上方头部控件
      // header: ['capturePicture','save','zoom'],            // 如果templete参数不为simple,该字段将被覆盖
      // // 视频下方底部控件
      // footer: ['talk','broadcast','hd','fullScreen'],      // 如果template参数不为simple,该字段将被覆盖
      audio: 1, // 是否默认开启声音 0 - 关闭 1 - 开启
      openSoundCallBack: (data) => console.log("开启声音回调",data),
      closeSoundCallBack: (data) => console.log("关闭声音回调",data),
      startSaveCallBack: (data) => console.log("开始录像回调",data),
      stopSaveCallBack: (data) => console.log("录像回调",data),
      capturePictureCallBack: (data) => console.log("截图成功回调",data),
      fullScreenCallBack: (data) => console.log("全屏回调",data),
      getOSDTimeCallBack: (data) => console.log("获取OSDTime回调",data),
      width:600,
      height:400,
    })
  }
  render(){
    return(
      <div className="demo">
        <h2>视频模式使用示例：</h2>
        <div id="video-container" 
          style={{width:600,height:600}}
        >
        </div>
        <div>
          <button onClick={()=> this.playr.stop()}>stop</button>
          <button onClick={()=> this.playr.openSound()}>openSound</button>
          <button onClick={()=> this.playr.closeSound()}>closeSound</button>
          <button onClick={()=> this.playr.startSave()}>startSave</button>
          <button onClick={()=> this.playr.stopSave()}>stopSave</button>
          <button onClick={()=> this.playr.capturePicture()}>capturePicture</button>
          <button onClick={()=> this.playr.fullScreen()}>fullScreen</button>
          <button onClick={()=> this.playr.getOSDTime()}>getOSDTime</button>
          <button onClick={()=> this.playr.startTalk()}>开始对讲</button>
          <button onClick={()=> this.playr.stopTalk()}>结束对讲</button>
        </div>
      </div>
    )
  }
}


export default App;
