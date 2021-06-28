/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

const router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
  routes: [
    {
      // =============================================================================
      // MAIN LAYOUT ROUTES
      // =============================================================================
      path: "",
      component: () => import("./layouts/main/Main.vue"),
      children: [
        // =============================================================================
        // Theme Routes
        // =============================================================================

        {
          path: "/",
          name: "login-root",
          redirect: "/pages/login"
        },
        {
          path: "/",
          name: "login-register",
          redirect: "/pages/register"
        },
        {
          path: "/page2",
          name: "page-2",
          component: () => import("./views/Page2.vue")
        },
        // {
        //   path: "/Admin/Users",
        //   name: "Users",
        //   component: () => import("./views/Administration/Users.vue")
        // },
        {
          path: "/Administration/UrlList",
          name: "UrlList",
          component: () => import("./views/Administration/UrlList.vue")
        },

      ]
    },

    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
    {
      path: "",
      component: () => import("@/layouts/full-page/FullPage.vue"),
      children: [
        // =============================================================================
        // PAGES
        // =============================================================================
        {
          path: "/pages/login",
          name: "not-authorized",
          component: () => import("@/views/pages/Login.vue")
        },
        {
          path: "/pages/register",
          name: "not-logged",
          component: () => import("@/views/pages/Register.vue")
        },
        {
          path: "/pages/not-authorized",
          name: "page-login",
          component: () => import("@/views/pages/NotAuthorized.vue")
        },

      ]
    },
    // Redirect to 404 page, if no match found
    {
      path: "*",
      redirect: "/pages/error-404"
    }
  ]
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById("loading-bg");
  if (appLoading) {
    appLoading.style.display = "none";
  }
});

export default router;
