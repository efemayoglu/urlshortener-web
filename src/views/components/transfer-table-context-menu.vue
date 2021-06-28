<template>
  <div>
    <div class="demo-alignment">
      <vs-popup title="Para Adetleri Detayı" :active.sync="popupActive">
        <div v-if="popupActive" id="data-list-list-view" class="data-list-container">
          <h1>get : {{contextMenu.get}}</h1>

        </div>
      </vs-popup>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    contextMenu: {
      type: Object
    }
  },
  data() {
    return {
      popupActive: false
    };
  },
  mounted() {
    console.log("transfer-table-context menu mounted")

  },
  created() {

  }
};
</script>



<style scoped>
</style>
