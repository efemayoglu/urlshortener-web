<!-- =========================================================================================
  File Name: UserList.vue
  Description: User List page
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="page-user-list">
    <div class="demo-alignment">
      <vs-popup
        class="holamundo"
        title="Information"
        :active.sync="popupActive"
      >
        <p v-for="(item, index) in modalMessages" v-bind:key="index">
          {{ item }}
        </p>

        <input type="button" @click="popupActive = false" value="Kapat" />
      </vs-popup>
    </div>

    <transfer-table-sidebar
      v-if="sideBarActive"
      :isSidebarActive="sideBarActive"
      @closeSidebar="ToggleDataSidebarAction"
      :data="passingData"
      :actionType="actionType"
    />

    <!-- Export Excel Dialog-->
    <vs-prompt
      title="Export Box"
      class="export-options"
      @cancle="clearFields"
      @accept="exportToExcel"
      accept-text="Export"
      @close="clearFields"
      :active.sync="activePrompt"
    >
      <vs-input
        v-model="fileName"
        placeholder="Enter File Name.."
        class="w-full"
      />
      <v-select v-model="selectedFormat" :optiongols="formats" class="my-4" />
      <div class="flex">
        <span class="mr-4">Cell Auto Width:</span>
        <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>
      </div>
    </vs-prompt>
    <!-- Export Excel Dialog-->

    <div id="transfertable" class="vx-card p-6 vs-con-loading__container">
      <div class="flex flex-wrap justify-between items-center">
        <!-- ITEMS PER PAGE -->
        <div class="mb-4 md:mb-0 mr-4 ag-grid-table-actions-left">
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div
              class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium"
            >
              <!-- currentPage * paginationPageSize - (paginationPageSize - 1) -->
              <!-- currentPageNumber*paginationPageSize +1 -->
              <span class="mr-2">
                {{
                  totalCount > 0
                    ? currentPageNumber * customPageSize - customPageSize + 1
                    : 0
                }}
                -

                {{
                  totalCount > 0
                    ? totalCount >
                      currentPageNumber * customPageSize -
                        (customPageSize - 1) +
                        customPageSize -
                        1
                      ? currentPageNumber * customPageSize -
                        (customPageSize - 1) +
                        customPageSize -
                        1
                      : totalCount
                    : 0
                }}
                <!-- {{
                  GetTableData.length - currentPage * paginationPageSize > 0
                    ? currentPage * paginationPageSize
                    : GetTableData.length
                }} -->
                of {{ totalCount > 0 ? totalCount : 0 }}
              </span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>
            <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->

            <!--TABLE TOP LEFT PAGINATION-->
            <vs-dropdown-menu>
              <vs-dropdown-item @click="customPaginationPageSize = 5">
                <span>5</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="customPaginationPageSize = 10">
                <span>10</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="customPaginationPageSize = 20">
                <span>20</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="customPaginationPageSize = 50">
                <span>50</span>
              </vs-dropdown-item>
              <vs-dropdown-item @click="customPaginationPageSize = 100">
                <span>100</span>
              </vs-dropdown-item>
                    <vs-dropdown-item @click="customPaginationPageSize = 1000">
                <span>1000</span>
              </vs-dropdown-item>
                 <vs-dropdown-item @click="customPaginationPageSize = 10000">
                <span>10000</span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
          <!--TABLE TOP LEFT PAGINATION-->
        </div>

        <div
          class="flex flex-wrap items-center justify-between ag-grid-table-actions-right"
        >
          <!-- TABLE QUICK SEARCH AREA -->
          <vs-input
            class="mb-4 md:mb-0 mr-4"
            v-model="searchQuery"
            @input="updateSearchQuery"
            placeholder="Search..."
          />
          <!-- TABLE QUICK SEARCH AREA -->
          <!-- TABLE ACTIONS AREA -->
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div
              class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer flex items-end justify-center text-lg font-medium w-32"
            >
              <span class="mr-2 leading-none">Actions</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu color="primary">
              <!-- <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="SaveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Save</span>
                </span>
              </vs-dropdown-item>-->

              <!-- <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Delete</span>
                </span>
              </vs-dropdown-item>-->

              <!-- <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="ArchiveIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Archive</span>
                </span>
              </vs-dropdown-item>-->

              <vs-dropdown-item v-if="showPlus" @click="Add">
                <span class="flex items-center">
                  <feather-icon
                    icon="PlusIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>Add New</span>
                </span>
              </vs-dropdown-item>
              <!--    <vs-dropdown-item>
                <span class="flex items-center">
                  <feather-icon icon="FileIcon" svgClasses="h-4 w-4" class="mr-2" />
                  <span>Print</span>
                </span>
              </vs-dropdown-item>-->

              <vs-dropdown-item @click="activePrompt = true">
                <span class="flex items-center">
                  <feather-icon
                    icon="FileIcon"
                    svgClasses="h-4 w-4"
                    class="mr-2"
                  />
                  <span>ExportFile</span>
                </span>
              </vs-dropdown-item>
            </vs-dropdown-menu>
          </vs-dropdown>
          <!-- TABLE ACTIONS AREA -->

          <!-- TABLE COLUMNS SHOW/HIDDEN AREA -->
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div
              class="p-3 shadow-drop rounded-lg d-theme-dark-light-bg cursor-pointer flex items-end justify-center text-lg font-medium w-32"
            >
              <span class="mr-2 leading-none">Columns</span>
              <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
            </div>

            <vs-dropdown-menu style="width:150px!important;" color="primary">
              <!-- <span class="flex items-center">
                <vs-list>
                  <vs-list-item>
                    <vs-checkbox color="danger" />
                  </vs-list-item>
                </vs-list>
              </span>-->

              <span
                v-for="column in GetHeadersName(GetTableData)"
                v-bind:key="column"
                class="flex items-center"
              >
                <span>
                  <!-- <vs-checkbox  value="true" @change="ColumnVisibility(column)" color="danger" />-->
                  <vs-checkbox
                    :value="getColumnVisibility(column)"
                    @change="ColumnVisibility(column)"
                    color="danger"
                  />
                </span>
                <span>{{ column }}</span>
              </span>

            </vs-dropdown-menu>
          </vs-dropdown>
          <!-- TABLE COLUMNS SHOW/HIDDEN AREA -->
        </div>
      </div>
      <!-- TABLE-->
      <ag-grid-vue
        ref="agGridTable"
        :components="components"
        :gridOptions="gridOptions"
        class="ag-theme-material w-100 my-4 ag-grid-table"
        :columnDefs="columnDefs"
        :columnTypes="columnTypes"
        @grid-ready="onReady"
        :defaultColDef="defaultColDef"
        :rowData="GetTableData"
        rowSelection="multiple"
        colResizeDefault="shift"
        :floatingFilter="true"
        @pagination-changed="onPaginationChanged"
        :paginationPageSize="paginationPageSize"
        :suppressPaginationPanel="true"
        :enableRtl="$vs.rtl"
      ></ag-grid-vue>
      <!--   :rowClassRules="rowClassRules"-->

      <!-- :suppressAggFuncInHeader="true"
      :enableCellChangeFlash="true"-->
      <!-- :modules="modules" -->

      <!-- :enableCellChangeFlash="true" -->
      <!-- :animateRows="true" -->
      <!-- :sideBar="true" -->

      <!-- TABLE-->
      <!-- TABLE BOTTOM PAGINATION-->

      <!-- <vs-pagination :total="100" v-model="10" /> -->

      <vs-pagination
        v-if="totalCount > -1"
        :total="totalPage"
        v-model="currentPageNumber"
      />
      <!-- TABLE BOTTOM PAGINATION-->
    </div>
  </div>
</template>

<script>
// function formatNumber(params) {
//   var number = params.value;
//   return Math.floor(number)
//     .toString()
//     .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
// }

function toCamelCase(str) {
  return str
    .replace(/\s(.)/g, function($1) {
      return $1.toUpperCase();
    })
    .replace(/\s/g, "")
    .replace(/^(.)/, function($1) {
      return $1.toLowerCase();
    });
}


import { AgGridVue } from "ag-grid-vue";
import "@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss";
import vSelect from "vue-select";
// import { AllCommunityModules } from "@ag-grid-community/all-modules";
// import { AllCommunityModules } from "@ag-grid-community/all-modules";

// import "@ag-grid-community/all-modules/dist/styles/ag-grid.css";

// Store Module
// import moduleUserManagement from '@/store/user-management/moduleUserManagement.js'

// Cell Renderer
import CellRendererLink from "./cell-renderer/CellRendererLink.vue";
import CellRendererStatus from "./cell-renderer/CellRendererStatus.vue";
import CellRendererVerified from "./cell-renderer/CellRendererVerified.vue";
import CellRendererActions from "./cell-renderer/CellRendererActions.vue";

import TransferTableSidebar from "./transfer-table-sidebar/transfer-table-sidebar.vue";

export default {
  name: "transfer-table",
  components: {
    AgGridVue,
    vSelect,
    // Cell Renderer
    CellRendererLink,
    CellRendererStatus,
    CellRendererVerified,
    CellRendererActions,
    TransferTableSidebar
  },
  beforeMount() {
    this.gridOptions = {};
    // this.gridApi = this.gridOptions.api

    this.defaultColDef = {
      sortable: true,
      resizable: true,
      editable: true,
      filter: true
    };

    this.rowClassRules = {
      "sick-days-warning": params => {
        var numSickDays = params.data.status;
        return numSickDays == 1002;
      },
      "sick-days-red": "data.status == 1009",
      "sick-days-green": "data.status == 1004"
    };

    //    this.columnTypes = {
    //    quarterFigure: {
    //     editable: true,
    //     cellClass: "number-cell",
    //     aggFunc: "sum",
    //     valueFormatter: formatNumber,
    //     valueParser: function numberParser(params) {
    //       console.log(params)
    //       return Number(params.newValue);
    //     }
    //   }
    // };

    /* this.rowClassRules = {
      "sick-days-warning": params => {
        var numSickDays = params.data.id;
        return numSickDays == 0 && this.$store.state.theme == "dark";
      },
      "sick-days-breach": params => {
        var numSickDays = params.data.id;
        return numSickDays == 0 && this.$store.state.theme == "light";
      }
    };*/
  },
  props: [
    "endpoint",
    "elements",
    "autoSearch",
    "columns",
    "addButton",
    "afterPayload"
  ],
  data() {
    return {
      currentPageNumber: 1,
      totalCount: -1,
      customPaginationPageSize: 0,
      customPageSize: 1,
      rowClassRules: {},
      isComplete1Time: [],
      popupActive: false,
      modalMessages: [],
      actionType: "",
      uniqeId: [],
      passingData: [],
      // sendingOBJ:{"id":100,"category":"fitness","img":"https://pixinvent.com/demo/vuexy-vuejs-admin-dashboard-template/products/06.png","name":"Fitbit - Activity Tracker","order_status":"delivered","popularity":72,"price":99.99}
      tableData: [],
      columnDefs: null,
      tableReady: false,
      columnTypes: null,
      // modules:AllCommunityModules,
      sideBarActive: false,

      PaymentStatuses: [
        { id: 1000, name: "Bütün Statüler" },
        { id: 1001, name: "Yeni" },
        { id: 1002, name: "Bekliyor" },
        { id: 1003, name: "Gönderilecek" },
        { id: 1004, name: "Gönderildi" },
        { id: 1005, name: "Reddedildi" },
        { id: 1006, name: "Geri Ödendi" },
        { id: 1007, name: "İptal Edildi" },
        { id: 1008, name: "İade Edilecek" },
        { id: 1009, name: "İade Edildi" },
        { id: 1010, name: "Tutar Blokeye Alınacak" },
        { id: 2000, name: "Statü Bilinmiyor" },
        { id: 2001, name: "Statü Eşlendi" },
        { id: 2002, name: "Statü Eşlenmedi" },
        { id: 2003, name: "Statüsü ignore edildi" },
        { id: 2004, name: "Statü iade edildi" }
      ],
      // Filter Options
      // roleFilter: { label: 'All', value: 'all' },
      // roleOptions: [
      //   { label: 'All', value: 'all' },
      //   { label: 'Admin', value: 'admin' },
      //   { label: 'User', value: 'user' },
      //   { label: 'Staff', value: 'staff' },
      // ],

      // statusFilter: { label: 'All', value: 'all' },
      // statusOptions: [
      //   { label: 'All', value: 'all' },
      //   { label: 'Active', value: 'active' },
      //   { label: 'Deactivated', value: 'deactivated' },
      //   { label: 'Blocked', value: 'blocked' },
      // ],

      // isVerifiedFilter: { label: 'All', value: 'all' },
      // isVerifiedOptions: [
      //   { label: 'All', value: 'all' },
      //   { label: 'Yes', value: 'yes' },
      //   { label: 'No', value: 'no' },
      // ],

      // departmentFilter: { label: 'All', value: 'all' },
      // departmentOptions: [
      //   { label: 'All', value: 'all' },
      //   { label: 'Sales', value: 'sales' },
      //   { label: 'Development', value: 'development' },
      //   { label: 'Management', value: 'management' },
      // ],

      activePrompt: false,
      fileName: "",
      formats: ["xlsx", "csv", "txt"],
      cellAutoWidth: true,
      selectedFormat: "xlsx",

      searchQuery: "",
      gridOptions: {},
      maxPageNumbers: 7,
      gridApi: null,

      // Cell Renderer Components
      components: {
        CellRendererLink,
        CellRendererStatus,
        CellRendererVerified,
        CellRendererActions
      }
    };
  },
  watch: {
    async currentPageNumber(val) {
      if (this.tableReady == false) return;
      // this.gridApi.paginationGoToPage(val - 1)

      try {
        this.tableReady = false;
        const p = {
          ...this.afterPayload,
          page: val - 1,
          pageSize: this.customPageSize
        };
        this.$emit("manualRefresh", p);
        // await  this.GetFromAxiosWithPost(p, this.initialType);
        this.currentPageNumber = val;

        // this.gridApi.paginationGoToPage(val - 1);
      } catch (error) {
        console.log("pagination is failed due to fetching data");
      } finally {
        // this.$vs.loading.close("#transfertable > .con-vs-loading");
      }
    },
    async customPaginationPageSize(val) {
      if (this.tableReady == false) return;

      this.customPageSize = val;
      this.$store.state.customPageSize = val;
      this.currentPageNumber = 1;
      // this.gridApi.paginationGoToPage(val - 1)
      // this.$vs.loading({
      //   container: "#transfertable",
      //   scale: 0.6
      // });

      try {
        this.tableReady = false;
        const p = {
          ...this.afterPayload,
          page: 0,
          pageSize: val
        };
        this.$emit("manualRefresh", p);

        // await this.GetFromAxiosWithPost(p, this.initialType);
        // this.gridApi.paginationGoToPage(val - 1);
      } catch (error) {
        console.log("pagination is failed due to fetching data");
      } finally {
        this.$vs.loading.close("#transfertable > .con-vs-loading");
      }
    },
    tableReady(val) {
      if (val == true) {
      }
    }
    // roleFilter(obj) {
    //   this.setColumnFilter("role", obj.value)
    // },
    // statusFilter(obj) {
    //   this.setColumnFilter("status", obj.value)
    // },
    // isVerifiedFilter(obj) {
    //   let val = obj.value === "all" ? "all" : obj.value == "yes" ? "true" : "false"
    //   this.setColumnFilter("is_verified", val)
    // },
    // departmentFilter(obj) {
    //   this.setColumnFilter("department", obj.value)
    // },
  },
  computed: {
    totalPage() {
      let s = Math.ceil(
        parseInt(this.totalCount) / parseInt(this.customPageSize)
      );
      return s;
    },
    showPlus() {
      if (this.addButton)
        return this.elements.filter(x => x.creatable).length == 0
          ? false
          : true;
      else return false;
    },
    GetTableData() {
      if (this.tableData == null || this.tableData == undefined) return [];
      return this.tableData;
      // return this.$store.state.userManagement.users
    },
    paginationPageSize() {
      try {
        return this.customPaginationPageSize;
      } catch (error) {
        alert(error);
        return 10;
      }
      // if (this.gridApi) return this.gridApi.paginationGetPageSize();
      // else return 10;
    },
    totalPages() {
      if (this.gridApi) return this.gridApi.paginationGetTotalPages();
      else return 0;
    },
    currentPage: {
      get() {
        return this.currentPageNumber;
      },
      async set(val) {
        if (this.tableReady == false) return;
        // this.gridApi.paginationGoToPage(val - 1)
        try {
          this.tableReady = false;
          await this.GetFromAxiosWithPost({
            page: val - 1,
            pageSize: this.paginationPageSize
          });
          this.currentPageNumber = val;
          // this.gridApi.paginationGoToPage(val - 1);
        } catch (error) {
          console.log("pagination is failed due to fetching data");
        }
      }
    }
  },
  methods: {
    ConvertToTr(key) {
      let value = this.$store.state.headerToTr[key];
      if (value != null && value != "" && value != undefined) return value;
      else {
        let camelCaseValue = toCamelCase(key);
        camelCaseValue = this.$store.state.headerToTr[camelCaseValue];
        if (
          camelCaseValue != null &&
          camelCaseValue != "" &&
          camelCaseValue != undefined
        )
          return camelCaseValue;
        else return key;
      }
    },
    onBtFirst() {
      this.gridApi.paginationGoToFirstPage();
    },
    onBtLast() {
      console.log("here");
      this.gridApi.paginationGoToLastPage();
    },
    onBtNext() {
      this.gridApi.paginationGoToNextPage();
    },
    onBtPrevious() {
      this.gridApi.paginationGoToPreviousPage();
    },
    onBtPageFive() {
      this.gridApi.paginationGoToPage(4);
    },
    onBtPageFifty() {
      this.gridApi.paginationGoToPage(49);
    },
    onPaginationChanged() {
      console.log("onPaginationPageLoaded");
      if (this.gridApi) {
        // setLastButtonDisabled(!this.gridApi.paginationIsLastPageFound());
      }
    },
    ss() {
      this.ColumnVisibility("name");
    },
    getColumnVisibility(column) {
      // if (
      //   this.$store.state.Customization != null &&
      //   this.$store.state.Customization[this.$store.state.currentPage] != null
      // ) {
      //   debugger;
      //   this.columns = this.$store.state.Customization[
      //     this.$store.state.currentPage
      //   ];
      // }
      if (this.columns != null)
        for (var index2 = 0; index2 < this.columnDefs.length; index2++) {
          const el2 = this.columnDefs[index2];
          if (el2.field == column && el2.hide == true) return false;
          else if (el2.field == column && el2.hide == false) return true;
        }

      return true;
    },
    /*  getColumnVisible(column){
      let condition = false
      for (var i =0; i<this.isComplete1Time.length;i++){
        const elem = this.isComplete1Time[i]
        if(elem == column) condition=true
      }
      if(condition){
        console.log("aaa:"+column)
        return true
      }
      else{
        console.log("aaa:::2:"+column)

        this.isComplete1Time.push(column)
        this.ColumnVisibility(column)
        return false
      }*/

    /*   debugger
  if(this.isComplete1Time.includes(column)) return false
  else {
    console.log('+++++++++++++++++++++++++++')
    this.isComplete1Time =this.isComplete1Time+ column
    this.ColumnVisibility(column)
    console.log("efe:"+column)
    //console.log('column:'+column + "     ->"+ this.isComplete1Time)
  /*  console.log(".................")

    console.log(column)

  if(this.columns == null) return true

    for (var i=0; i <=this.columns.length; i++){
      const element = this.columns[i];
      if(element == column) {
        this.ColumnVisibility(column)
      }
    }*/

    //},
    refreshHandler(val) {
      this.$emit("refreshHandler", val);
    },
    showModalMessagesWith(messages) {
      this.modalMessages = messages;
      this.popupActive = true;
    },
    setOptions() {
      for (let index = 0; index < this.elements.length; index++) {
        const element = this.elements[index];
        if (!element.options) {
        } else {
        }
        // element.options = [
        //   { value: 0, label: "value0" },
        //   { value: 1, label: "value1" },
        //   { value: 2, label: "value2" }
        // ];
      }
    },
    ActionHandler(data, type, custom = null) {
      if (type == "update") this.Edit(data);
      else if (type == "create") this.AddWithData(data);
      else if (type == "delete") this.Delete(data);
      else if (custom != null) {
        this.DynamicActions(data, custom);
      } else {
      }
    },
    // CRUDRequest(){

    // },
    ColumnVisibility(columnName) {
      // console.log(columnName + " passed to ColumnVisibility");
      const columns = this.GetHeaders(this.GetTableData);
      console.log(JSON.stringify(columns) + " showed columns");
      // console.log(
      //   JSON.stringify(this.gridOptions.columnApi) + " showed columns"
      // );

      for (let index = 0; index < columns.length; index++) {
        const element = columns[index];
        if (element.field === columnName) {
          let originalElement = this.columnDefs[index];
          if (
            (originalElement.hide == null) |
            (originalElement.hide == "undefined")
          )
            originalElement.hide = true;
          else originalElement.hide = !originalElement.hide;
          this.gridOptions.columnApi.setColumnVisible(
            columnName,
            !originalElement.hide
          );

          //  x => {
          //   if (x.hide == false) return x => x.field;
          // }
          let onlyNotHide = this.gridOptions.columnApi.columnController.columnDefs.filter(
            x => {
              return x.hide == false;
            }
          );
          let toBeSettedColumns = onlyNotHide.map(x => {
            return x.field;
          });
          this.$store.state.Customization[
            this.$store.state.currentPage
          ] = toBeSettedColumns;

          $cookies.set(this.$store.state.currentPage, toBeSettedColumns); //return this

          // this.columnDefs[index] = originalElement;
          return true;
        }
      }
    },

    onReady(payload = null, type = false) {
      if (this.autoSearch) {
        this.$vs.loading({
          container: "#transfertable",
          scale: 0.6
        });

        this.GetFromAxiosWithPost(this.$parent.getPayload());
        // this.GetFromAxios();
      } else if (payload && type) {
        this.$vs.loading({
          container: "#transfertable",
          scale: 0.6
        });
        this.GetFromAxiosWithPost(payload);
      } else {
        if (this.afterPayload.page != null)
          this.GetFromAxiosWithPost(this.afterPayload);

        // this.tableReady = true;

        // this.$vs.loading.close("#transfertable > .con-vs-loading");
      }


      //this.sizeToFit()
    },

    //   onReadyWithPost(payload) {
    //     this.$vs.loading({
    //       container: "#transfertable",
    //       scale: 0.6
    //     });

    // },
    async GetFromAxiosWithPost(payload) {
      try {
        this.$vs.loading({
          container: "#transfertable",
          scale: 0.6
        });
        if (payload.pageSize != null && this.$store.state.customPageSize != 0)
          payload.pageSize = this.$store.state.customPageSize;

        if (
          payload["page_size"] != null &&
          this.$store.state.customPageSize != 0 &&
          payload['page_size'] != undefined
        ){
          payload["page_size"] = this.$store.state.customPageSize;
            delete payload.pageSize;
    //missing deletion from payload because only 1 page the page size inputs like 'page_size'
        }
        if (payload != null && payload.page != null)
          this.currentPageNumber = payload.page + 1;

        const response = await this.$axios.post(this.endpoint.list, payload);
        if (response.status != 200 || Object.keys(response.data).length === 0) {
          this.$vs.loading.close("#transfertable > .con-vs-loading");
          return;
        }
        //debugger

        const responseData = response.data;
        // fetch(this.endpoint.get)
        const arrayName = this.GetArraysName(responseData);

        this.columnDefs = this.GetHeaders(responseData[arrayName]);

        if (this.columns != null)
          for (var index = 0; index < this.columns.length; index++) {
            const el = this.columns[index];
            for (var index2 = 0; index2 < this.columnDefs.length; index2++) {
              const el2 = this.columnDefs[index2];
              if (el2.field == el) el2.hide = false;
            }
          }
        else
          for (var index2 = 0; index2 < this.columnDefs.length; index2++) {
            const el2 = this.columnDefs[index2];
            el2.hide = false;
          }

        console.log("column defs:" + JSON.stringify(this.columnDefs));
        if (arrayName != null)
          this.tableData = this.AddBankCodeToData(
            responseData[arrayName],
            payload
          );
        else this.tableData = this.AddBankCodeToData(responseData, payload);

        if (responseData.totalCount != null) {
          if (
            payload["page_size"] != null &&
            payload["page_size"] != undefined
          ) {
            this.customPageSize = payload["page_size"];
          } else this.customPageSize = payload.pageSize;
          this.totalCount = responseData.totalCount;
        } else {
          this.totalCount = this.$store.state.pageSize;
          console.log("total count has not been setted due to came undefined");
        }

        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;
        this.tableReady = true;
      } catch (error) {
      } finally {
        this.$vs.loading.close("#transfertable > .con-vs-loading");
      }

      // }
    },
    AddBankCodeToData(data, payload) {
      if (payload["bankCode"] != null)
        for (let index = 0; index < data.length; index++) {
          data[index].bankCode = payload["bankCode"];
        }
      console.log("new data:" + JSON.stringify(data));
      return data;
    },

    async GetFromAxios() {
      const response = await this.$axios.post(this.endpoint.get);
      const responseData = response.data;
      // fetch(this.endpoint.get)

      const arrayName = this.GetArraysName(responseData);

      this.columnDefs = this.GetHeaders(responseData[arrayName]);

      console.log(this.columnDefs);
      if (arrayName != null) this.tableData = responseData[arrayName];
      else this.tableData = responseData;

      this.tableReady = true;

      this.$vs.loading.close("#transfertable > .con-vs-loading");
    },
    ToggleDataSidebarAction(val = false, valDirect = false) {
      if (valDirect) {
        this.actionType = "";

        this.sideBarActive = false;
        return;
      }

      if (this.actionType == "add") {
      } else if (this.actionType == "edit") {
      }

      this.sideBarActive = false;
      this.actionType = "";
      // vs;
    },
    async Delete(data) {

      const response = await this.$axios.delete(this.endpoint.delete, {
        headers: {
        },
        data: {
          "userId": data.userId,
          "urlId": data.urlId
        }
      });

      this.$parent.refreshHandler(true);
    },

    async DynamicActions(data, custom) {
      if (custom.request.type == "post" && custom.request.method == "body") {
        const Request = custom.request;
        let payload = {};
        Request.payload.map(x => {
          if (x.value != null) {
            payload[x.key] = x.value;
          } else {
            payload[x.key] = data[x.key];
          }
        });

        const response = await this.$axios.post(Request.endpoint, {});
      }

      this.$parent.refreshHandler(true);
    },

    ContextGenerateElements(headers, param, local_sending_array, type) {
      for (let index = 0; index < headers.length; index++) {
        const element = headers[index];
        if (element[type])
          if (element.type == "dropdown") {
            let value = param[element.name];

            if (element.options != null && element.options.length > 0) {
              for (let index = 0; index < element.options.length; index++) {
                const array_element = element.options[index];
                if (param[element.name] == array_element.value) {
                  value = {
                    label: array_element.label,
                    value: array_element.value
                  };
                  local_sending_array.push({
                    name: element.name,
                    value: value,
                    hidden: element.hidden,
                    type: element.type,
                    options: element.options,
                    customProperties: element.customProperties
                  });
                }
                /* else{
                   local_sending_array.push({
                     name: element.name,
                     value: element.value,
                     hidden: element.hidden,
                     type: element.type,
                     options: element.options,
                     customProperties:element.customProperties
                   });
                 }*/
              }
            } else {
              let values = param[element.name];
              //let values = [ "M0000032_T0000192435_309c8c3c-641b-4b5e-a70a-02ddb505c129.pdf","EFE0000032_T0000192435_309c8c3c-641b-4b5e-a70a-02ddb505c129.pdf" ]
              //values.map(x=> {
              local_sending_array.push({
                name: element.name,
                value: value,
                hidden: element.hidden,
                type: element.type,
                options: values,
                customProperties: element.customProperties
                //   options: element.options
                // });
              });

              /* local_sending_array.push({
                 name: element.name,
                 value: value,
                 hidden: element.hidden,
                 type: element.type,
                 options: element.options
               });*/
            }
          } else {
            local_sending_array.push({
              name: element.name,
              value: param[element.name],
              hidden: element.hidden,
              type: element.type,
              options: element.options,
              customProperties: element.customProperties
            });
          }
      }

      return local_sending_array;
    },

    Edit(param) {
      console.log("param:" + JSON.stringify(param));
      console.log("this elements:" + JSON.stringify(this.elements));
      let local_sending_array = [];
      const headers = this.elements;
      local_sending_array = this.ContextGenerateElements(
        headers,
        param,
        local_sending_array,
        "editable"
      );
      this.actionType = "update";
      this.passingData = { data: local_sending_array, endpoint: this.endpoint };
      this.sideBarActive = true;
    },

    AddWithData(param) {
      console.log("param:" + JSON.stringify(param));
      console.log("this elements:" + JSON.stringify(this.elements));
      let local_sending_array = [];
      const headers = this.elements;
      local_sending_array = this.ContextGenerateElements(
        headers,
        param,
        local_sending_array,
        "creatable"
      );

      this.actionType = "create";
      this.passingData = { data: local_sending_array, endpoint: this.endpoint };
      this.sideBarActive = true;
    },

    Add() {
      let local_sending_array = [];
      const headers = this.elements;
      for (let index = 0; index < headers.length; index++) {
        const element = headers[index];
        if (element.creatable) {
          local_sending_array.push({
            name: element.name,
            value: element.value != undefined ? element.value : "",
            type: element.type,
            options: element.options
          });
        }
        // if (element.toLowerCase() == "id") obj[element] = 0;
        // else obj[element] = "";
      }
      // console.log(JSON.stringify(local_sending_array));
      this.actionType = "create";

      this.passingData = { data: local_sending_array, endpoint: this.endpoint };
      this.sideBarActive = true;

      // this.tableData.unshift(obj);
    },
    AddToApi(obj) {
      console.log(JSON.stringify(obj));
    },
    // GetHeadersName(data) {
    //   if (data === null || data === undefined || data.length === 0) return [];
    //   const myObject = data[0];
    //   let _headers = [];
    //   for (const property in myObject) {
    //     _headers.push(property);
    //   }
    //   return _headers;
    // },

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
    GetHeadersName(data) {
      let _headers = [];

      if (data === null || data === undefined || data.length === 0) return null;

      if (Object.prototype.toString.call(data) == "[object Array]") {
        const myObject = data[0];
        for (const property in myObject) {
          _headers.push(property);
        }
      } else {
        for (const property in data) {
          if (
            Object.prototype.toString.call(data[property]) == "[object Array]"
          ) {
            const myObject = data[property][0];
            for (const property2 in myObject) {
              _headers.push(property2);
            }
            return _headers;
          }
        }
      }

      return _headers;
    },
    GetHeaders(data) {
      //debugger

      let _headers = [];

      _headers.push({
        pinned: "left",
        headerName: "",
        field: "transactions",
        width: 50,
        cellRendererFramework: "CellRendererActions",
        cellRendererParams: {
          tableContextMenu: this.endpoint.contextMenu
          // endpoint: this.endpoint.post
        }
      });

      for (var property in data[0]) {

          _headers.push({
            hide: true,

            headerName: property,
            field: property,
            width: 300
            // checkboxSelection: true,
            // headerCheckboxSelectionFilteredOnly: true,
            // headerCheckboxSelection: true
          });
      }
      return _headers;
    },
    exportToExcel() {
      import("@/vendor/Export2Excel").then(excel => {
        const headers = this.GetHeadersName(this.GetTableData);
        const data = this.formatJson(headers, this.GetTableData);
        excel.export_json_to_excel({
          header: headers,
          data,
          filename: this.fileName,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        });
        this.clearFields();
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          // Add col name which needs to be translated
          // if (j === 'timestamp') {
          //   return parseTime(v[j])
          // } else {
          //   return v[j]
          // }

          return v[j];
        })
      );
    },
    clearFields() {
      (this.filename = ""),
        (this.cellAutoWidth = true),
        (this.selectedFormat = "xlsx");
    },
    setColumnFilter(column, val) {
      const filter = this.gridApi.getFilterInstance(column);
      let modelObj = null;

      if (val !== "all") {
        modelObj = { type: "equals", filter: val };
      }

      filter.setModel(modelObj);
      this.gridApi.onFilterChanged();
    },
    resetColFilters() {
      // Reset Grid Filter
      this.gridApi.setFilterModel(null);
      this.gridApi.onFilterChanged();

      // Reset Filter Options
      this.roleFilter = this.statusFilter = this.isVerifiedFilter = this.departmentFilter = {
        label: "All",
        value: "all"
      };

      // this.$refs.filterCard.removeRefreshAnimation();
    },
    updateSearchQuery(val) {
      this.gridApi.setQuickFilter(val);
    }
  },
  mounted() {
    if (
      this.$store.state.Customization != null &&
      this.$store.state.Customization[this.$store.state.currentPage] != null
    ) {
      this.columns = this.$store.state.Customization[
        this.$store.state.currentPage
      ];
    }

    this.gridApi = this.gridOptions.api;
    this.gridColumnApi = this.gridOptions.columnApi;

    if (this.$vs.rtl) {
      const header = this.$refs.agGridTable.$el.querySelector(
        ".ag-header-container"
      );
      header.style.left =
        "-" + String(Number(header.style.transform.slice(11, -3)) + 9) + "px";
    }
//comment
    // this.tableData=json;
    // this.tableData=[{ id:1, name: 'ali', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'},{ id:2, name: 'efe', email: 'Email'}]

    // this.gridApi = this.gridOptions.api

    /* =================================================================
      NOTE:
      Header is not aligned properly in RTL version of agGrid table.
      However, we given fix to this issue. If you want more robust solution please contact them at gitHub
    ================================================================= */
  },
  created() {
    this.setOptions();

    // this.uniqeId = this.GetUniqeId();
  }
  // if(!moduleUserManagement.isRegistered) {
  //   this.$store.registerModule('userManagement', moduleUserManagement)
  //   moduleUserManagement.isRegistered = true
  // }
  // this.$store.dispatch("userManagement/fetchUsers").catch(err => { console.error(err) })
};
</script>

<style lang="scss">
/* @media screen and (min-width: 1401px)  {
    transfertable {
      font-size: 10px!important;
    }
  }




  @media screen and (min-width: 1201px) and (max-width: 1400px) {
    #transfertable * {
      font-size: 9px!important;

    }
  }

  @media screen and (min-width: 900px) and (max-width: 1200px) {
    #transfertable *{
      font-size: 8px!important;
    }
  }

*/

#page-user-list {
  .user-list-filters {
    .vs__actions {
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-58%);
    }
  }
}
.sick-days-warning {
  border-radius: 3rem;
  background-color: #262c49 !important;
}
.sick-days-breach {
  border-radius: 3rem;

  background-color: #b8b8b8 !important;
}
.sick-days-green {
  border-radius: 3rem;

  background-color: #41b883 !important;
}
.sick-days-red {
  border-radius: 3rem;

  background-color: #f08080 !important;
}

.transfer-table-color {
  background-color: sandybrown !important;
}
</style>
