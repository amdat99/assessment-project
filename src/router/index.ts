import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import FormView from "@/views/FormView.vue";
import AddressFormView from "@/views/AddressFormView.vue";
import ErrorView from "@/views/ErrorView.vue";
import store from "@/store";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/:userId",
    name: "form",
    component: AddressFormView,
    beforeEnter: async (to, _from, next) => {
      const userId = to.params.userId;
      if (isNaN(Number(userId))) {
        return next({
          name: "error",
          params: { errorMessage: "Invalid user ID" },
        });
      }
      try {
        await store.dispatch("fetchUserData", userId);
        next();
      } catch (error) {
        next({
          name: "error",
          params: { errorMessage: "Failed to fetch user data" },
        });
      }
    },
  },
  {
    path: "/",
    name: "form",
    component: FormView,
  },
  {
    path: "/error",
    name: "error",
    component: ErrorView,
    props: (route) => ({ errorMessage: route.params.errorMessage }),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
