
## Getting Started

First, run the development server:

```bash
# install dependencies
pnpm install

# development
pnpm run dev

# production build
pnpm run build

# deploy
pnpm run start
```

## 组件说明

```tsx
/**
 * 由于播放器sdk 内部有很多方法挂载在 window 上，所以需要将播放器组件放在客户端渲染
 */
const Player = dynamic(() => import('@/components/Player'), {
    ssr: false // This ensures the component is not SSR'd
});
```
