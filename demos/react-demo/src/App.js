import React from 'react';
import  EZUIKit from 'ezuikit-js';

import './App.css';


class App extends React.Component{
  constructor(props){
    super(props);
    this.player = null; //定义播放器
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
        // simple - 极简版; pcLive-pc直播；pcRec-pc回放；mobileLive-移动端直播；mobileRec-移动端回放;security - 安防版;voice-语音版;
        //template: 'simple', 
        plugin: ['talk'],                       // 加载插件，talk-对讲
        width: 600,
        height: 400,
      });
      window.player = this.player;
    });
  }
  play = () => {
    var playPromise = this.player.play();
    playPromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  stop = () => {
    var stopPromise = this.player.stop();
    stopPromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  getOSDTime = () => {
    var getOSDTimePromise = this.player.getOSDTime();
    getOSDTimePromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  capturePicture = () => {
    var capturePicturePromise = this.player.capturePicture(`${new Date().getTime()}`);
    capturePicturePromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  openSound = () => {
          var openSoundPromise = this.player.openSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  closeSound = () => {
    var openSoundPromise = this.player.closeSound();
    openSoundPromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  startSave = () => {
          var startSavePromise = this.player.startSave(`${new Date().getTime()}`);
    startSavePromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  stopSave = () => {
    var stopSavePromise = this.player.stopSave();
    stopSavePromise.then((data) => {
      console.log("promise 获取 数据", data)
    })
  }
  ezopenStartTalk = () => {
    this.player.startTalk();
  }
  ezopenStopTalk = () => {
    this.player.stopTalk();
  }
  fullScreen = () => {
    this.player.fullScreen();
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
          <button onClick={()=> this.stop()}>stop</button>
          <button onClick={()=> this.play()}>play</button>
          <button onClick={()=> this.openSound()}>openSound</button>
          <button onClick={()=> this.closeSound()}>closeSound</button>
          <button onClick={()=> this.startSave()}>startSave</button>
          <button onClick={()=> this.stopSave()}>stopSave</button>
          <button onClick={()=> this.capturePicture()}>capturePicture</button>
          <button onClick={()=> this.fullScreen()}>fullScreen</button>
          <button onClick={()=> this.getOSDTime()}>getOSDTime</button>
          <button onClick={()=> this.ezopenStartTalk()}>开始对讲</button>
          <button onClick={()=> this.ezopenStopTalk()}>结束对讲</button>
        </div>
      </div>
    )
  }
}


export default App;
