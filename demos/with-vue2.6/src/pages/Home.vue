<template>
  <div class="page">
    <div style="padding-bottom: 30px">
      <Player />
    </div>
    <router-link to="/multi">多屏实例(Multi screen)</router-link>
  </div>
</template>

<script>
import Player from "../components/Player.vue";

export default {
  name: "Home",
  components: {
    Player,
  },
  mounted: () => {
    console.group("mounted 组件挂载完毕状态===============》");
  },
  methods: {},
};
</script>
