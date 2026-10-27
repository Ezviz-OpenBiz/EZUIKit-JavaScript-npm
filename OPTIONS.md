## 初始化参数说明

<table>
<tr><th>参数名</th><th>类型</th><th>描述</th><th>是否必选</th></tr>
<tr><td>id</td><td>String</td><td>播放器容器DOM的id</td><td>Y</td></tr>
<tr><td>accessToken</td><td>String</td><td>授权过程获取的access_token</td><td>Y</td></tr>
<tr><td>url</td><td>String</td><td>

#### 直播

##### 标清

ezopen://open.ys7.com/${设备序列号}/{通道号}.live<br/>

##### 高清

ezopen://open.ys7.com/${设备序列号}/{通道号}.hd.live<br/>

#### 回放

##### sd 卡回放

初始化参数 url 值为：<br/> ezopen://open.ys7.com/${设备序列号}/{通道号}.rec?begin=yyyyMMddhhmmss

##### 云存储回放

初始化参数 url 值为：<br/> ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss 视频 ezopen 协议播放地址

##### 云录制回放

初始化参数 url 值为：<br/> ezopen://open.ys7.com/${设备序列号}/{通道号}.cloud.rec?begin=yyyyMMddhhmmss&busType=7 视频 ezopen 协议播放地址 详见：<a href="./cloudRecord.md" target="_blank">cloudRecord.md</a>

</td><td>Y</td></tr>

<tr><td>token</td><td>Object</td><td>小权限 token <a href="https://open.ys7.com/help/4293" target="_blank">https://open.ys7.com/help/4293</a> , 备注：accessToken 和 token 二选一 </td><td>N</td></tr>
<tr><td>audio</td><td>boolean</td><td>是否默认开启声音 true：打开（默认） false：关闭    </td><td>N</td></tr>
<tr><td>width</td><td>int</td><td>视频宽度，默认值为容器容器DOM宽度    </td><td>Y</td></tr>
<tr><td>height</td><td>int</td><td>视频高度，默认值为容器容器DOM高度</td><td>Y</td></tr>
<tr><td>staticPath</td><td>string</td><td>设置静态资源地址, 自定义可以自行下载 `ezuikit_static`放置在自己的服务器下， 设置 {staticPath: "/ezuikit_static"} </td><td>N</td></tr>
<tr><td>template</td><td>String</td><td>

<table style="display:inline-block;width:700px">
<tr><th>模板值</th><th>描述</th></tr>

<tr><td>simple</td><td>极简版 *固定模板 仅包含视频播放窗口，创建实例后通过方法集控制视频播<br />放相关功能</td></tr>

<tr><td>standard</td><td>标准版;   *固定模板 包含视频窗口，叠加了停止，录制，全屏控件（通过<br />控件快捷调用方法集合控制视频播放相关功能，但你仍然可以通过方法集直接控制视频播放相关功<br />能。下同）</td></tr>

<tr><td>security</td><td>安防版(预览回放);  *固定模板 包含视频窗口，叠加了录制，全屏控件，<br />标清/高清切换，预览录制切换控件*</td></tr>
<tr><td>voice</td><td>语音版;  *固定模板 包含视频窗口，叠加了录制，全屏控件，语音播报，语音<br />对讲控件*</td></tr>
<tr><td>pcLive</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定，可用于pc端预览，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用<br />themeData本地配置*</td></tr>
<tr><td>pcRec</td><td>    *固定模板 按钮列表，颜色，底部头部背景色固定， 可用于pc端回放，如需<br />修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileLive</td><td>    *固定模板  按钮列表，颜色，底部头部背景色固定，可用于移动端预<br />览，如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>mobileRec</td><td>*固定模板 按钮列表，颜色，底部头部背景色固定， 可用于移动端回放，<br />如需修改按钮配置，头部底部背景色，可参考 {{自定义themeId}}，或者使用themeData<br />本地配置*</td></tr>
<tr><td>自定义themeId</td><td>自定义主题，<a href="https://open.ys7.com/console/ezuikit/template.html" target="_blank">前往开放平台控制台配置页面获取</a><br />（v0.6.2版本及以上支持，建议使用 自定义themeId，或者使用themeData本地<br />配置）;</td></tr>
</table>

</td><td>N</td></tr>
<tr><td>themeData</td><td>Object</td><td>
themeData将主题数据本地化，设置本地数据，需要删除template参数 <br />
你可以通过themeData修改按钮位置，颜色，头部底部颜色等配置。

配置示例：<a href="./themeData.md" target="_blank">themeData.md</a>
</td><td>N</td></tr>
<tr><td>plugin</td><td>String</td><td>按需加载插件，可选值： talk：对讲，示例：plugin:["talk"] </td><td>N</td></tr>
<tr><td>handleSuccess</td><td>function</td><td>自动播放成功回调</td><td>N</td></tr>
<tr><td>handleError</td><td>function</td><td>错误回调</td><td>N</td></tr>
<tr><td>seekFrequency </td><td>function</td><td>为避免频繁拖动播放异常，可设置模板回放时间轴拖动防抖间隔，默认值为2000（2秒），可取2000（2秒），3000（3秒），4000（4秒），5000（5秒）</td><td>N</td></tr>
<tr><td>language</td><td>String</td><td>多语言 （zh | en）, 默认zh (v8.0.8版本及以上支持)</td><td>N</td></tr>
<tr><td>debugDownloadData</td><td>boolean</td><td>下载原始码流， 调试码流使用, 默认 false (v8.1.1版本及以上支持)</td><td>N</td></tr>
<tr><td>disableRenderPrivateData</td><td>boolean</td><td>禁止渲染私有数据(如智能分析， 移动侦测， 火点信息等), 默认 false (v8.1.1版本及以上支持)</td><td>N</td></tr>
<tr><td>quality</td><td>0 | 1 | 2 | 3 | 4 | 5 | 6 | pp | qp</td><td>预览初始化支持指定清晰度进行播放, 默认 undefined (v8.1.5版本及以上支持)， 0: 流畅； 1: 标清; 2: 高清; 3: 超清; 4: 极清; 5: 3K; 6: 4K ; "pp"： "性能优先 (Performance Priority)"; "qp": "画质优先(Quality Priority)"。</td><td>N</td></tr>
<tr><td>loggerOptions</td><td> {name: string, level: "INFO" | "LOG" | "WARN" | "ERROR" , showTime: boolean}</td><td>本地日志设置， 默认值 {name: "ezuikit", level: "INFO", showTime: true}, 支持动态设置请参考 <a href="#日志设置">setLoggerOptions(options)</a> (v8.1.9版本及以上支持)</td><td>N</td></tr>
<tr><td>streamInfoCBType</td><td>  0 | 1 </td><td>  流信息回调类型，监听 streamInfoCB 事件, 0 : 每次都回调（会影响性能）, 1 : 只回调一次, 默认值 1 (v8.1.9版本及以上支持)</td><td>N</td></tr>
<tr><td>playbackRange</td><td>{ begin: string, end: string }</td><td>播放区间约束（视频分享片段播放），begin 和 end 格式为 YYYYMMDDhhmmss（14 位），必须在同一天且 begin &lt; end。设置后回放将被约束在该区间内：时间轴、进度条、seek 操作均受区间限制，播放到区间末端自动触发 playbackEnd 事件。示例：<code>{ begin: '20260819103500', end: '20260819104500' }</code> (v9.0.18-beta.1 及以上支持)</td><td>N</td></tr>
<tr><td>segmentProgressOptions</td><td>Object | null</td><td>片段进度条控件配置，配合 playbackRange 使用时在移动端展示线性进度条。设为 null 关闭。需配合 mobileExtendOptions.controls 包含 'segmentProgress' 使用 (v9.0.18-beta.1 及以上支持)</td><td>N</td></tr>
<tr><td>mobileExtendOptions</td><td>{ controls: string[] }</td><td>移动端扩展控件配置，controls 数组可选值：'timeLine'（时间轴）、'segmentProgress'（片段进度条）、'date'（日期选择）、'time'（时间选择）、'rec'（回放类型切换）、'ptz'（云台）。示例：<code>{ controls: ['timeLine', 'segmentProgress'] }</code> (v9.0.17 及以上支持)</td><td>N</td></tr>
<tr><td>transport</td><td>jsdecoder | webtransport</td><td> 取流传输客户端， 默认 jsdecoder  (v9.0.23 及以上支持)</td><td>N</td></tr>
<tr><td>decoderType</td><td> auto | v1 | v3</td><td>指定解码类型，(v1: 软解， v3: 硬件)， 默认 auto</td><td>N</td></tr>
<tr><td>speedOptions</td><td><a href="./theme-docs/speedOptions.md" target="_blank">Object</a></td><td>自定义倍速列表  (v8.2.4 及以上支持)</td><td>N</td></tr>
</table>