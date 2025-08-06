## themeData

themeData将主题数据本地化，设置本地数据，需要删除template参数, 你可以通过themeData修改按钮位置，颜色，头部底部颜色等配置。

```ts
/**
 * 控件按钮或文本
 */
interface ThemeDataBtn {
    /**
     * 按钮图标ID
     */
    "iconId": string,
    /**
     * left: 左侧 right: 右侧
     */
    "part": "left" | "right",
    /**
     * 默认选中
     */
    "defaultActive": 0 | 1,
    /** 按钮名称*/
    "memo": "顶部设备名称",
    /** 0: 显示 1: 隐藏 */
    "isrender": 1 | 0
}

/**
 * 主题数据
 */
interface ThemeData {
    /**
     * header/ footer 聚焦时间 (单位秒)，默认 5 秒后自动隐藏; 0 一直展示； 
     */
    "autoFocus": number,
    /**
     * 封面图片
     * 默认 https://resource.eziot.com/group1/M00/00/89/CtwQEmLl8r-AZU7wAAETKlvgerU237.png
     */
    "poster": string,
    /**
     * 顶部
     */
    "header": {
        /** 字体/图标颜色 */
        "color": string,
        /**
         * 按钮激活色
         */
        "activeColor": string,
        /**
         * 按钮背景色
         */
        "backgroundColor": string,
        /**
         * 控件按钮列表
         */
        "btnList": ThemeDataBtn[]
    },
    /**
     * 底部
     */
    "footer": {
         /** 字体/图标颜色 */
        "color": string,
        /**
         * 按钮激活色
         */
        "activeColor": string,
        /**
         * 按钮背景色
         */
        "backgroundColor": string,
        /**
         * 控件按钮列表
         */
        "btnList": ThemeDataBtn[]
    }
}
```


#### 配置示例

```json
{
    "autoFocus": 5,
    "poster":"https://resource.eziot.com/group1/M00/00/89/CtwQEmLl8r-AZU7wAAETKlvgerU237.png",
    "header": {
        "color": "#1890ff",
        "activeColor": "#FFFFFF",
        "backgroundColor": "#000000",
        "btnList": [
            {
                "iconId": "deviceID",
                "part": "left",
                "defaultActive": 0,
                "memo": "顶部设备名称",
                "isrender": 1
            },
            {
                "iconId": "deviceName",
                "part": "left",
                "defaultActive": 0,
                "memo": "顶部设备ID",
                "isrender": 1
            },
            {
                "iconId": "cloudRec",
                "part": "right",
                "defaultActive": 0,
                "memo": "头部云存储回放",
                "isrender": 0
            },
            {
                "iconId": "rec",
                "part": "right",
                "defaultActive": 0,
                "memo": "头部本地回放",
                "isrender": 0
            }
        ]
    },
    "footer": {
        "color": "#FFFFFF",
        "activeColor": "#1890FF",
        "backgroundColor": "#00000021",
        "btnList": [
            {
                "iconId": "play",
                "part": "left",
                "defaultActive": 1,
                "memo": "播放",
                "isrender": 1
            },
            {
                "iconId": "capturePicture",
                "part": "left",
                "defaultActive": 0,
                "memo": "截屏按钮",
                "isrender": 1
            },
            {
                "iconId": "sound",
                "part": "left",
                "defaultActive": 0,
                "memo": "声音按钮",
                "isrender": 1
            },
            {
                "iconId": "pantile",
                "part": "left",
                "defaultActive": 0,
                "memo": "云台控制按钮",
                "isrender": 1
            },
            {
                "iconId": "recordvideo",
                "part": "left",
                "defaultActive": 0,
                "memo": "录制按钮",
                "isrender": 1
            },
            {
                "iconId": "talk",
                "part": "left",
                "defaultActive": 0,
                "memo": "对讲按钮",
                "isrender": 1
            },
            {
                "iconId": "zoom",
                "part": "left",
                "defaultActive": 0,
                "memo": "电子放大",
                "isrender": 1
            },
            {
                "iconId": "hd",
                "part": "right",
                "defaultActive": 0,
                "memo": "清晰度切换按钮",
                "isrender": 1
            },
            {
                "iconId": "webExpend",
                "part": "right",
                "defaultActive": 0,
                "memo": "网页全屏按钮",
                "isrender": 1
            },
            {
                "iconId": "expend",
                "part": "right",
                "defaultActive": 0,
                "memo": "全局全屏按钮",
                "isrender": 1
            }
        ]
    }
}
```

### 配置示例

<a href="https://github.com/Ezviz-OpenBiz/EZUIKit-JavaScript-npm/blob/master/demos/base-demo/themeData.html" target="_blank">本地主题配置示例</a>