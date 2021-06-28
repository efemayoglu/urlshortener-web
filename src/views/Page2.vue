<template lang="">
		<generate-page
			v-bind:endpoint="endpoint"
      v-bind:elements="elements"
      v-bind:autoSearch="false"
			/>
</template>

<script>
import generatePage from "./components/generate-page.vue";
//import apiService from "../service/ApiService.ts";

export default {
  created() {
    //alert(apiService.getVersion());
    this.getPostsAsync();
  },
  methods: {
    async getPostsAsync() {
      try {
        const response = await this.$axios.get("/ui/version");
        // alert(JSON.stringify (response.data))
        // this.posts = response.data;
      } catch (error) {
        this.errors.push(error);
      }
    }
  },
  components: { generatePage },
  data() {
    return {
      models: [],
      endpoint: {
        get: "http://www.mocky.io/v2/5e32d5a83200005f0094d1a7",
        post: "http://www.mocky.io/v2/5e32d5a83200005f0094d1a7"
      },
      elements: [
        {
          filter: false,
          name: "id",
          type: "text",
          hidden: true,
          editable: true,
          creatable: false
        },
        {
          filter: true,
          name: "name",
          type: "text",
          editable: true,
          creatable: true
        },
        {
          filter: true,
          name: "username",
          type: "text",
          editable: true,
          creatable: true
        },
        {
          filter: true,
          name: "email",
          type: "text",
          editable: true,
          creatable: true
        },
        {
          filter: false,
          name: "password",
          type: "text",
          editable: false,
          creatable: true
        },
        {
          filter: true,
          name: "il1",
          type: "dropdown",
          endpoint: "https://jsonplaceholder.typicode.com/users"
        },
        // {
        //   name: "il2",
        //   type: "dropdown",
        //   endpoint: "https://jsonplaceholder.typicode.com/users"
        // },
        // {
        //   name: "il3",
        //   type: "dropdown",
        //   endpoint: "https://jsonplaceholder.typicode.com/users"
        // },
        // {name:"ilce", type: "multiple" },
        // {name:"ilce", type: "multiple" },
        // {name:"ilce", type: "multiple" },
        // {name:"birthDate", type: "singleDate" },
        // {name:"birthDate", type: "singleDate" },
        // {name:"birthDate", type: "singleDate" },
        {
          filter: true,
          name: "baslangicBitis",
          type: "datetimeRange",
          startDateName: "startDate",
          endDateName: "endDate"
        }
        // { name: "baslangicBitis", type: "datetimeRange" },
        // { name: "baslangicBitis", type: "datetimeRange" }
        // { type: "text" },

        // {
        //   type: "text",
        //   endpoint: "https://jsonplaceholder.typicode.com/users"
        // },
        // { type: "datetimeBasic" }
      ]
    };
  }
};
</script>

