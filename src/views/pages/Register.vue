<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div
    style="z-index: 100000"
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center vs-con-loading__container"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col hidden lg:block lg:w-1/2">
              <img
                src="@/assets/images/pages/login.png"
                alt="login"
                class="mx-auto"
              />
            </div>

            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">
                <div class="vx-card__title mb-4">
                  <h4 class="mb-4"></h4>
                  <p>
                  Register
                  </p>
                  <p style="color: red">{{ message }}</p>
                </div>

                <div>
                  <vs-input
                    name="username"
                    icon-no-border
                    icon="icon icon-user"
                    icon-pack="feather"
                    label-placeholder="username"
                    v-model="username"
                    class="w-full"
                    style="margin-bottom:20px;"
                  />

                  <vs-input
                    type="password"
                    name="password"
                    icon-no-border
                    @keypress.enter="Register()"
                    icon="icon icon-lock"
                    icon-pack="feather"
                    label-placeholder="Password"
                    v-model="password"
                    class="w-full mt-6"
                  />

                  <!-- <vs-button type="border"></vs-button> -->
                  <vs-button class="float-right mb-3" @click="Register()"
                    >Kayıt ol</vs-button
                  >

                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default {
  mounted() {
    // this.Login();
  },
  created() {
    this.$store.dispatch("updateToken", null);

  },
  methods: {
    Register() {

      this.callRegisterService();
    },

    async callRegisterService() {
      this.$vs.loading({
        container: "#page-login",
        scale: 0.6
      });

      try {
        const response = await this.$axios.post("/api/users/add", {
          username: this.username,
          password: this.password
        });
        console.log(JSON.stringify(response.data.data));
        const data = response.data;
        if (data!= null && data.success) {


          this.$router.push({ name: "login-root" });
        }
        this.$vs.loading.close("#page-login > .con-vs-loading");

      } catch (error) {
        console.log(error);

        this.message = "Kullanıcı adı veya şifre yanlış";

        this.$vs.loading.close("#page-login > .con-vs-loading");
      }
    }
  },
  data() {
    return {
      message: "",
      username: "",
      password: "",
      checkbox_remember_me: true
    };
  }
};
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook {
      background-color: #1551b1;
    }
    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
}
</style>
