import React from "react";
import EZUIKit from "ezuikit-js";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.player = null;
        this.state = {
            deviceList: [
                {
                    width: 600,
                    height: 400,
                    accessToken: 'at.79xun36c3txmf3j452p1vc8ubaaf9r0q-361vhe7edi-1cekmll-f541jowsm',
                    url: 'ezopen://open.ys7.com/C69625501/1.live',
                    template: 'pcLive'
                },
                {
                    width: 600,
                    height: 400,
                    accessToken: 'at.79xun36c3txmf3j452p1vc8ubaaf9r0q-361vhe7edi-1cekmll-f541jowsm',
                    url: 'ezopen://open.ys7.com/BC7799091/1.live',
                    template: 'pcLive'
                }
            ]
        }
    }
    componentDidMount() {
        this.init();
    }

    init = () => {
        console.log(document.getElementById('player'), this.state.deviceList);
        const inspection = new EZUIKit.EZUIKitInspectionUI(this.playerRef.current, { list: this.state.deviceList, pageSize: 2 })
    };

    render() {
        return (
            <div className="demo">
                <h2>视频模式使用示例：</h2>
                <div>
                    <div id="player"></div>
                </div>
                <div>
                    <button onClick={this.init}>init</button>
                </div>
            </div>
        );
    }
}

export default App;
