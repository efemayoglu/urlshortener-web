<template lang="">
  <generate-page
    v-bind:endpoint="endpoint"
    v-bind:elements="elements"
    v-bind:columns="columns"
    v-bind:autoSearch="true"
  />
</template>

<script>
import generatePage from "../components/generate-page.vue";
//import apiService from "../service/ApiService.ts";

export default {
  created() {
  },
  mounted() {

  },
  methods: {

  },
  components: { generatePage },

  data() {
    return {
      pageId: "partners",
      models: [],
      columns: ["userId","username", "fromLink", "toLink"],
      endpoint: {
        get: ``,
        list: `/api/urls/getByCreatedUser`,
        create: `/api/urls/add`,
        update: `/ui/admin/partners/update`,
        delete: `/api/urls/delete`,
        contextMenu: [
          {
            name: "delete",
            href: "/api/urls/delete",
            active: true,
            icon: "TrashIcon"
          }
        ],
      },
      elements: [
        {
          filter: true,
          filterHidden: true,
          value: this.$store.state.token,
          name: "userId",
          type: "text",
          uniqueId: true,
          hidden: true,
          editable: true,
          creatable: true,
        },
        {
          filter: false,
          name: "toLink",
          type: "text",
          editable: false,
          creatable: true
        },
      ]
    };
  }
};
</script>
