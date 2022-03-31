import React from 'react';
import  EZUIKit from 'ezuikit-js';

import './App.css';


class App extends React.Component{
  constructor(props){
    super(props);
    this.playr = null; //定义播放器
  }
  componentDidMount(){
    fetch('https://open.ys7.com/jssdk/ezopen/demo/token')
    .then(response => response.json())
    .then(res => {
      var accessToken = res.data.accessToken;
      this.player = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: accessToken,
        url: 'ezopen://open.ys7.com/G39444019/1.live',
        template: 'simple', // simple - 极简版;standard-标准版;security - 安防版(预览回放);voice-语音版; theme-可配置主题；
        plugin: ['talk'],                       // 加载插件，talk-对讲
        width: 600,
        height: 400,
      });
    });
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
