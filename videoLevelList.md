## 清晰度列表 videoLevelList

自定义清晰度列表，默认null, 如果有值 sdk 内部不在进行获取, 为 null 使用接口获取的清晰度列表, videoLevelList.length === 0 不展示清晰度控件 sdk 内部不在进行获取, videoLevelList.length > 0 展示控件 sdk 内部不在进行获取 (v8.1.10版本及以上支持)

清晰度支持七种： 0: 流畅； 1: 标清; 2: 高清; 3: 超清; 4: 极清; 5: 3K; 6: 4K

```ts
interface VideoLevel{
    /** 清晰度 0 ｜ 1 ｜ 2 ｜ 3｜ 4 ｜ 5 ｜ 6 */
    level: number,
    /** 名称 */
    name: string,
    /** 1: 主码流, 2: 子码流 （仅支持这两种）*/
    streamTypeIn: 1 | 2 
    /** 如果 type === 'compatible' 代表兼容模式，兼容模式下 streamTypeIn 默认为 1， 因为 */
    type?: 'compatible' | undefined,
}
```

⚠️ 注意：如果设备不支持子码流 (streamTypeIn = 2), 用其取流则不会成功（内部不会强制进行切换），以往的老版本可能会出现这个问题。

⚠️ 注意：如果设备不支持子码流 (streamTypeIn = 2), 用其取流则不会成功（内部不会强制进行切换），以往的老版本可能会出现这个问题。

⚠️ 注意：如果设备不支持子码流 (streamTypeIn = 2), 用其取流则不会成功（内部不会强制进行切换），以往的老版本可能会出现这个问题。

### 查询列表

请求 http 接口查询：[/api/service/device/capacity/video/quality]
<!-- https://open.ys7.com/api/service/device/capacity/video/quality?accessToken=ra.dngskvuq8fyiv7vy8v34vq391ime66zn-1lc2iw4l7p-05oxx55-unjdfvpas&deviceSerial=FU4877853&channelNo=1 -->

#### 清晰度接口相应结果示例

```json
{
    "meta": {
        "code": 200,
        "message": "操作成功",
        "moreInfo": null
    },
    "data": [
        {
            "id": 7293450,
            "channelNo": 1,
            /** 清晰度 2 高清, 对应level  */
            "videoLevel": 2,
            "cameraType": "CS-C6Wi-8D8W2DF",
            /** 1: 主码流, 2: 子码流 （仅支持这两种）*/
            "streamTypeIn": 2,
            "streamType": 1,
            "resolution": 19,
            "picQuality": 2,
            "bitRateType": 0,
            "videoBitRate": 15,
            "maxBitRate": 0,
            "videoFrameRate": 14,
            "intervalBPFrame": 2,
            "intervalFrameI": 60,
            "encodeComplex": 1
        },
        {
            "id": 7293452,
            "channelNo": 1,
            /** 清晰度 3 超清 对应level */
            "videoLevel": 3,
            "cameraType": "CS-C6Wi-8D8W2DF",
            /** 1: 主码流, 2: 子码流 （仅支持这两种）*/
            "streamTypeIn": 1,
            "streamType": 1,
            "resolution": 27,
            "picQuality": 2,
            "bitRateType": 0,
            "videoBitRate": 17,
            "maxBitRate": 0,
            "videoFrameRate": 14,
            "intervalBPFrame": 2,
            "intervalFrameI": 60,
            "encodeComplex": 1
        },
        {
            "id": 7293454,
            "channelNo": 1,
            /** 清晰度 4 极清 对应level */
            "videoLevel": 4,
            "cameraType": "CS-C6Wi-8D8W2DF",
            /** 1: 主码流, 2: 子码流 （仅支持这两种）*/
            "streamTypeIn": 1,
            "streamType": 1,
            "resolution": 70,
            "picQuality": 2,
            "bitRateType": 0,
            "videoBitRate": 21,
            "maxBitRate": 0,
            "videoFrameRate": 14,
            "intervalBPFrame": 2,
            "intervalFrameI": 60,
            "encodeComplex": 1
        },
        {
            "id": 7344044,
            "channelNo": 1,
            /** 清晰度 6 4K 对应level */
            "videoLevel": 6,
            "cameraType": "CS-C6Wi-8D8W2DF",
            /** 1: 主码流, 2: 子码流 （仅支持这两种）*/
            "streamTypeIn": 1,
            "streamType": 1,
            "resolution": 64,
            "picQuality": 2,
            "bitRateType": 0,
            "videoBitRate": 22,
            "maxBitRate": 4096,
            "videoFrameRate": 14,
            "intervalBPFrame": 2,
            "intervalFrameI": 60,
            "encodeComplex": 1
        }
    ]
}
```

⚠️ 注意：如果接口没有返回，sdk 会默认认为设备不支持子码流，内部会给一个默认列表（但是都是主码流， 进行切换后是没有变换的）。如下

```js
/**
 * streamTypeIn: 1 | 2  //  1-主码流，2-子码流
 * 能力集没有报备的都默认使用主码流，防止没有子码流
 */
export const VIDEO_LEVEL = [
  {
    level: 1, // 标清
    streamTypeIn: 1, //  1-主码流，2-子码流
    type: 'compatible',
  },
  {
    level: 2, // 高清
    streamTypeIn: 1, //  1-主码流，2-子码流
    type: 'compatible',
  },
];
```

⚠️ 注意： 清晰度列表需要设备端开发上报能力集，可以联系供应商或硬件开发进行上报。


### 示例

如果开发者想自定义清晰度列表或设备没有上报能力集，但是设备型号本身支持可以进行自定义， 如下

```js
// >= v8.1.2  ESM
import { EZUIKitPlayer } from "ezuikit-js";

const player = new EZUIKitPlayer({
    // ...
    videoLevelList: [
      { level: 1, name: "标清", streamTypeIn: 2 }, // 需要保证支持子码流
      { level: 2, name: "高清", streamTypeIn: 1 },
    ],
})
```

⚠️ 注意：如果清晰度切换时，码流对应的 `level` 不存在，取流则取码流对应的上一次设置的 `level` 值的流。

⚠️ 注意：清晰度切换成功会改变设备对应码流的设置（如分辨率，帧率等）， 如果不想进行改变设备设置，请设置 `level` 的值在对应的码流中不存在， 但是这样同一种码流进行清晰度切换就没有变化了，具体可以根据业务进行自行调整。


⚠️ 注意：如果清晰度没有在已有的列表中，请联系客服或在 github 提issue，我们会组织开发同学进行添加新的清晰度。


