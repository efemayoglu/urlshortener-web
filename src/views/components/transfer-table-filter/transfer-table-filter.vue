<template>
  <vx-card
    ref="filterCard"
    title="Filters"
    class="user-list-filters mb-8"
    collapseAction
  >


    <countdown
        @progress="handleCountdownProgress"
        ref="countdownFilter"
        v-if="counting"
        :time="totalTime"
        @end="handleCountdownEnd"
      >
      </countdown>


    <!-- actionButtons
        @refresh="resetColFilters"
    @remove="resetColFilters"-->

    <div v-if="hasDatetimeRange()" class="vx-row">
      <div class="vx-col md:w/1/3">
        <!-- <template v-if="filterElement.type == 'datetimeRange'"> -->
        <flat-pickr
          v-model="startDate"
          :config="configFromdateTimePicker"
          placeholder="Başlangıç Tarihi"
          @on-change="onFromChange"
        />

        <flat-pickr
          v-model="endDate"
          :config="configTodateTimePicker"
          placeholder="Bitiş Tarihi"
          @on-change="onToChange"
        />
        <!-- </template> -->
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full md:w-1/3">
        <!-- <input
          type="button"
          value="current pagE?"
          @click="test()"
        /> -->

        <transfer-table-element v-bind:elements="Grid1" />
      </div>
      <div class="vx-col w-full md:w-1/3">
        <transfer-table-element v-bind:elements="Grid2" />
      </div>
      <div class="vx-col w-full md:w-1/3">
        <transfer-table-element v-bind:elements="Grid3" />
      </div>
    </div>

    <div class="vx-row">
      <div class="vx-col w-full">
        <div class="mt-8 flex flex-wrap items-center justify-end">
          <vs-button
            @click="search"
            class="ml-auto mt-2"
            :disabled="!validateForm"
            >Refresh</vs-button
          >
          <!-- @click="save_changes" -->

        </div>
      </div>
    </div>
  </vx-card>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import vSelect from "vue-select";

import transferTableElement from "./transfer-table-element.vue";

import VueCountdown from "@chenfengyuan/vue-countdown";




export default {
  name: "transfer-table-filter",
  components: { flatPickr, vSelect, transferTableElement ,VueCountdown},
  props: {
    elements: {
      type: Array,
      required: true
    },
    autoSearch: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  created() {
    this.$store.state.reduceButton = true;
    // this.SetName();

    this.CalculateGrid();

    if (this.autoSearch) {
      const qryPost = this.GenerateQryPost();
      this.$emit("postDataGenerated", qryPost);
    }
    // this.SetData();
  },
  data() {
    return {
      counting:false,
      totalTime:60000,
      filterElements: JSON.parse(JSON.stringify(this.elements)),

      options: [],

      Grid1: [],
      Grid2: [],
      Grid3: [],
      // OptionsDF

      models: {},
      dropdownData: [],

      date: null,
      startDate: new Date(),
      endDate: new Date(),
      configFromdateTimePicker: {
        minDate: null,
        maxDate: new Date(),
        dateFormat: "d-m-Y"
      },
      configTodateTimePicker: {
        minDate: null,
        maxDate: null,
        dateFormat: "d-m-Y"
      }
    };
  },
  methods: {
    startCountdown: function() {
      this.counting = true;
    },
    handleCountdownEnd: function() {
      this.search()
   
      this.counting = false;

      this.$nextTick(x=> {
        this.startCountdown()
      })
    },
    handleCountdownProgress(data) {
 
      },
     // console.log(this.remainingTime)
    test() {
      alert(this.$store.state.currentPage);
    },
    refresh(val) {
      if (val) this.search();
    },
    SetDefaultValues() {
      this.startDate = null;
      this.endDate = null;
    },
    hasDatetimeRange() {
      for (let index = 0; index < this.filterElements.length; index++) {
        const element = this.filterElements[index];
        if (element.type == "datetimeRange") return true;
      }
      return false;
    },

    getFormValues(submitEvent) {
      // alert(JSON.stringify(submitEvent.target.elements));
    },
    checkForm() {
      return true;
    },

    search() {
      if (!this.validateForm) return;
      // const qry = this.GenerateQryString();
      const qryPost = this.GenerateQryPost();

      console.log("qry:" + JSON.stringify(qryPost));
      this.$emit("formSubmitted", qryPost);

      // Here will go your API call for updating data
      // You can get data in "this.data_local"
    },
    reset_data() {
      this.filterElements = JSON.parse(JSON.stringify(this.elements));

      // (this.date = null),
      //   (this.startDate = null),
      //   (this.endDate = null),
      //   (this.configFromdateTimePicker = {
      //     minDate: null,
      //     maxDate: new Date()
      //   }),
      //   (this.configTodateTimePicker = {
      //     minDate: null,
      //     maxDate: null
      //   });

      this.$nextTick(x => {
        var myDate = new Date();
        myDate.setDate(myDate.getDate() - 1);
        this.startDate = myDate;
        this.endDate = new Date();
      });

      this.configFromdateTimePicker = {
        minDate: null,
        maxDate: new Date()
      };
      this.configTodateTimePicker = {
        minDate: null,
        maxDate: null
      };

      this.CalculateGrid();
    },
    onFromChange(selectedDates, dateStr, instance) {
      this.$set(this.configTodateTimePicker, "minDate", dateStr);
    },
    onToChange(selectedDates, dateStr, instance) {
      this.$set(this.configFromdateTimePicker, "maxDate", dateStr);
    },
    CalculateGrid() {
      this.Grid1 = [];
      this.Grid2 = [];
      this.Grid3 = [];
      let counter = 0;
      let newElements = [];
      for (let index = 0; index < this.filterElements.length; index++) {
        const element = this.filterElements[index];

        if (element.filter && element.type !== "datetimeRange") {
          element.index = counter;
          newElements.push(element);
          counter++;
        }
      }

      for (let index = 0; index < newElements.length; index++) {
        let element = newElements[index];
        if (index % 3 === 0) this.Grid1.push(element);
        else if (index % 3 === 1) this.Grid2.push(element);
        else if (index % 3 === 2) this.Grid3.push(element);
        // }
      }
    },

    // SetData() {
    //   for (let index = 0; index < this.filterElements.length; index++) {
    //     const element = this.filterElements[index];
    //     if (element.type == "dropdown") {
    //       this.GetDataFromEndPoint(element, index);
    //     }
    //   }
    // },

    GenerateQryPost() {
      const qryPost = {};
      for (let index = 0; index < this.filterElements.length; index++) {
        const element = this.filterElements[index];
        if (element.filter) {
          if (element.type == "datetimeRange") {
            qryPost[element.startDateName] = this.startDate;
            qryPost[element.endDateName] = this.endDate;
          } else {
            qryPost[element.name] =
              element.type == "dropdown" ? element.value.value : element.value;
          }
        }
      }
      // alert(JSON.stringify(qryPost))
      return qryPost;
    },
    GenerateQryString() {
      let qry = "";
      for (let index = 0; index < this.filterElements.length; index++) {
        const element = this.filterElements[index];

        if (element.filter) {
          qry += "?";
          if (element.type == "datetimeRange") {
            qry += element.startDateName + "=" + this.startDate;
            qry += "&";
            qry += element.endDateName + "=" + this.endDate;
          } else {
            qry +=
              element.name +
              "=" +
              (element.type == "dropdown"
                ? element.value.value
                : element.value);
          }
          if (index + 1 != this.filterElements.length) qry += "&";
        }
      }

      return qry;
    },
    GetModelName(filterElement, index) {
      return filterElement.type + index;
    },

    GetArraysName(data) {
      if (data === null || data === undefined || data.length === 0) return null;

      if (Object.prototype.toString.call(data) == "[object Array]") {
        return null;
      } else {
        for (const property in data) {
          if (
            Object.prototype.toString.call(data[property]) == "[object Array]"
          ) {
            return property;
          }
        }
      }
    },
    submitForm2() {},
    submitForm() {
      this.$validator.validateAll().then(result => {
        if (result) {
          // if form have no errors
          // alert("form submitted!");
        } else {
          console.log(result);
          // form have errors
        }
      });
    }
  },
  mounted() {

    if(this.$route.path.toLowerCase().includes('report/transfers')){

      this.counting = true

    }

    var myDate = new Date();

    // add a day
    myDate.setDate(myDate.getDate() - 1);
    this.startDate = myDate;
    this.endDate = new Date();
  },

  beforeMount() {
    //https://reqres.in/api/users?page=1
  },
  computed: {
    validateForm() {
      return !this.errors.any();
    }
  }
};
</script>

<style></style>
