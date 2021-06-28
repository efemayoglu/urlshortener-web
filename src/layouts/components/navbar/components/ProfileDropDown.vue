<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.displayName">
    <!-- <vs-button  @click="popupActive=true;popupEnable=true" color="primary" type="border">Open Default popup</vs-button> -->

    <vs-popup
      :button-close-hidden="true"
      class="holamundo"
      title="Dikkat"
      :active.sync="popupActive"
    >

    </vs-popup>

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
      <small></small>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
      <div class="con-img ml-3">
        <img

          key="onlineImg"
         src="@/assets/images/logo/logo.png"
          alt="user-img"
          width="40"
          height="40"
          class="rounded-full shadow-md cursor-pointer block"
        />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 9rem">
          <!-- <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Profile</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MailIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Inbox</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="CheckSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Tasks</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="MessageSquareIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Chat</span>
          </li>

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="HeartIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Wish List</span>
          </li> -->

          <!-- <vs-divider class="m-1" /> -->

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Logout</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import Vue from "vue";
import VueCountdown from "@chenfengyuan/vue-countdown";

Vue.component(VueCountdown.name, VueCountdown);

export default {
  data() {
    return {
      popupEnable: false,
      efe: true,
      popupActive: false,
      colorx: "#def1d1",
      totalTime: 240000,
      time: 60000,
      remainingTime: 60,
      notificationHeader: "Header",
      notificationText: "Text",
      notificationResponseHeader: "Header",
      notificationResponseText: "işlem başarılı",
      counting: false
    };
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    }
  },
  mounted() {
    this.startCountdown();
  },
  watch: {
    popupActive() {
      if (this.popupActive == false && this.popupEnable == false)
        this.popupActive = false;
      else if (this.popupActive == false) this.popupActive = true;
      // console.log("popupActive:"+this.popupActive)
    },
    remainingTime() {
      // this.efe = false;
      // this.totalTime =this.totalTime-1000;
      // this.efe = true;

      this.notificationText = this.remainingTime;

      // this.startAndShowCountdown()
      if (this.remainingTime == 60) this.startAndShowCountdown();
      else if (this.remainingTime < 2) {
        this.counting = false;
        this.popupEnable = false;
        this.popupActive = false;

        this.$nextTick(() => {
          // Add the component back in
          this.$router.push("/pages/login").catch(() => {});
        });
      }
    }
  },
  methods: {
    async RefreshToken() {
      const response = await this.$axios.post("/ui/auth/token/refresh", {
        token: this.$store.state.token
      });
      if (response.data.isSuccess) return true;
      else return false;
    },

    RefreshTimer() {
      console.log("Token refreshed");

      if (!this.RefreshToken()) this.logout();

      this.popupEnable = false;

      this.popupActive = false;

      this.remainingTime = this.totalTime / 1000;

      this.counting = false;

      this.$nextTick(() => {
        // Add the component back in
        this.counting = true;
      });
    },

    handleCountdownProgress(data) {
      // console.log(data.totalSeconds);
      this.remainingTime = data.totalSeconds;

      if(this.$store.state.refreshTimer){

        this.$store.state.refreshTimer=false;

        this.$nextTick(() => {
          this.RefreshTimer();

          // Add the component back in

        });



        return;
      }
     // console.log(this.remainingTime)
    },
    startAndShowCountdown() {
      this.startCountdown();
      // this.tokenNotify();
      this.popupActive = true;
      this.popupEnable = true;
    },
    startCountdown: function() {
      this.counting = true;
    },
    handleCountdownEnd: function() {
      this.counting = false;
    },
    logout() {
      this.$store.dispatch("updateToken", null);
      this.$router.push("/pages/login").catch(() => {});
    },

    tokenNotify() {
      this.$vs.notify({
        title: this.notificationHeaderF(),
        text: this.notificationTextF(),
        color: "primary",
        fixed: true,
        click: () => {
          // Secondary function
          this.$vs.notify({
            title: this.notificationResponseHeader(),
            text: this.notificationResponseText(),
            color: "success",
            iconPack: "feather",
            icon: "icon-check"
          });
        }
      });
    }
  }
};
</script>
