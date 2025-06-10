import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./pages/Home.vue";
import Multi from "./pages/Multi.vue";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Home,
    },
    {
      path: "/multi",
      component: Multi,
    },
  ],
});

export default router;
