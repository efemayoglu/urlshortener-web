<template lang="">
  <div>

    <transfer-table-filter
      ref="filter"
      v-if="filterActive"
      v-bind:elements="elements"
      v-on:formSubmitted="onSubmitForm"
      v-on:postDataGenerated="getPayload"
      v-bind:autoSearch="autoSearch"
    />

    <transfer-table
      v-if="filterActive && myFilter"
      ref="transferTable"
      v-bind:endpoint="endpoint"
      v-bind:elements="elements"
      v-bind:addButton="addButton"
      v-bind:autoSearch="autoSearch"
      :afterPayload="payload"
      v-bind:columns="columns"
      v-on:refreshHandler="refreshHandler"
      v-on:manualRefresh="onSubmitForm"
    />
  </div>
</template>

<script>
import transferTable from "./transfer-table/transfer-table.vue";
import transferTableFilter from "./transfer-table-filter/transfer-table-filter.vue";

import transferTableContextMenuGenerator from "./transfer-table-context-menu-generator.vue";

export default {
  name: "generate-page",
  data() {
    return {
      contextOptionEnable: false,
      refresh: false,
      isRefreshed: false,
      payload: {},
      myFilter: true
    };
  },
  props: {
    addButton: {
      type: Boolean,
      required: false,
      default: true
    },
    elements: {
      type: Array,
      required: true
    },
    endpoint: {
      type: Object
    },
    columns: {
      type: Array,
      default: null
    },
    autoSearch: {
      type: Boolean,
      default: false
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    filterActive() {
      return !this.isLoading && !this.isRefreshed;
    }
  },
  components: {
    transferTable,
    transferTableFilter,
    transferTableContextMenuGenerator
  },

  watch: {
    isLoading(value) {
      console.log("value:" + value);
      this.$vs.loading.close("#contentLoader > .con-vs-loading");
    }
  },
  created() {
    // alert(JSON.stringify(this.endpoint));
    // if (this.autoSearch) this.isLoading = false;
    // this.$on("event_parent", function(id) {
    //   console.log("Event from parent component emitted", id);
    // });
  },
  mounted() {
    if (this.isLoading) {
      this.$vs.loading({
        container: "#contentLoader",
        scale: 0.6
      });
      console.log("isloading:" + this.isLoading);
    }
    console.log(JSON.stringify(this.isLoading));
  },
  methods: {
    
    refreshHandler(val) {
      this.isRefreshed = false;

      this.refresh = val;
      this.$nextTick(() => {
        this.isRefreshed = false;
        this.isLoading = false;
      });

      this.$refs.filter.refresh(true);
    },
    async GetContextData(endpoint, sendParam) {
      //debugger
      try {
        const response = await this.$axios.post(endpoint, sendParam);
        let id = "";
        let myData = response.data[id];

        this.$refs.contextMenuGenerator.setData(myData);
      } catch (error) {
        console.log(error);
      } finally {
        this.$vs.loading.close(`#contentLoader > .con-vs-loading`);
      }
    },

    ContextMenuHandler(data, contextMenu) {
      this.$vs.loading({
        container: `#contentLoader`,
        scale: 0.6
      });

      try {
        let type = contextMenu.name;
        let sendParam = this.CalculateSendParameter(contextMenu, data);

        this.GetContextData(contextMenu.href, sendParam);
      } catch (error) {
        this.$vs.loading.close(`#contentLoader > .con-vs-loading`);
      }
    },
    CalculateSendParameter(contextMenu, data) {
      // alert(JSON.stringify(contextMenu));
      if (contextMenu.id != null) {
        let sendParam = {};
        let index = 0;
        for (var param in contextMenu.id) {
          if (contextMenu.postId != null && contextMenu.postId != undefined) {
            sendParam[contextMenu.postId[index]] = data[contextMenu.id[param]];
          } else sendParam[contextMenu.id[param]] = data[contextMenu.id[param]];
          index++;
        }
        return sendParam;
      } else return { id: data["id"] };
    },
    RefreshFilter() {
      this.isLoading = true;
      this.isLoading = false;
    },
    RefreshTable(payload) {
      this.myFilter = false;

      this.$nextTick(() => {
        this.myFilter = true;
      });
    },
    getPayload(payload) {
      if (payload) this.payload = payload;
      return this.payload;
    },
   
    onSubmitForm(payload) {
      this.payload = payload;
      this.RefreshTable(payload);
    }
  }
};
</script>

<style></style>
