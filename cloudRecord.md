## 云录制

### url 说明

ezopen://open.ys7.com/BC7799091/1.cloud.rec?busType=7&spaceId=${spaceId}


- `cloud.rec` 表示云回放

- `busType=7` 表示云录制(需要结合 `cloud.rec`)

- `spaceId` 云录制空间 id 是必须的

### 版本说

8.1.x 开启云录制需要初始化时传入 `isCloudRecord: true`, 但是云录制和云存储互斥，不能同时开启

8.2.x 默认支持云录制，云存储和本地存储, 推荐

### 配置说明

spaceId 的取值可以是播放地址中获取，也可以是初始化时候传入的参数（初始化时传入的值不可以被修改）

```ts
{
    // 出事始化参数
   spaceId: "12345678" 
}
```



