
<template >
  <div style="">
    <vs-popup
      style="z-index: 999999"
      width="300"
      class="holamundo"
      title="Information"
      :active.sync="popupActive"
    >
      <div class="mt-4" v-if="payloadOK">
        <vs-input
          v-model="payload"
          class="w-full mt-4"
          required
          label="Açıklama"
        />
      </div>
      <p>{{ message }}</p>

      <vs-button color="primary" @click="Confirm" type="filled">{{
        btnMessage
      }}</vs-button>
    </vs-popup>
  </div>
</template>

<style>
</style>


<script>
export default {
  name: "tx-popup",
  data() {
    return {
      popupActive: false,
      message: "",
      btnMessage: "",
      handlerName: "",
      payload: null,
      payloadOK: false,
    };
  },
  methods: {
    Confirm() {
      this.$emit("handler", this.payload);
    },
    setVariable(popupActive, message, btnMessage, handlerName, pay) {
      this.popupActive = popupActive;
      this.message = message;
      this.btnMessage = btnMessage;
      this.handlerName = handlerName;
      this.payloadOK = false;
      if (pay) {
        this.$nextTick(() => {
          this.payloadOK = true;
        });
      }
    },
  },
};
</script>
