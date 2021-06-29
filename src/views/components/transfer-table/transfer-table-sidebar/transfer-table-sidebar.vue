<!-- =========================================================================================
  File Name: AddNewDataSidebar.vue
  Description: Add New Data - Sidebar component
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <vs-sidebar
    click-not-close
    position-right
    parent="body"
    default-index="1"
    color="primary"
    class="add-new-data-sidebar items-no-padding"
    spacer
    v-model="isSidebarActiveLocal"
  >
    <div class="mt-6 flex items-center justify-between px-6">
      <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
      <feather-icon
        icon="XIcon"
        @click.stop="isSidebarActiveLocal = false"
        class="cursor-pointer"
      ></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component
      :is="scrollbarTag"
      class="scroll-area--data-list-add-new"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="p-6">
        <!-- Product Image -->
        <!-- <template v-if="dataImg">
          <div class="img-container w-64 mx-auto flex items-center justify-center">
            <img :src="dataImg" alt="img" class="responsive">
          </div>

          <div class="modify-img flex justify-between mt-5">
            <input type="file" class="hidden" ref="updateImgInput" @change="updateCurrImg" accept="image/*">
            <vs-button class="mr-4" type="flat" @click="$refs.updateImgInput.click()">Update Image</vs-button>
            <vs-button type="flat" color="#999" @click="dataImg = null">Remove Image</vs-button>
          </div>
        </template>-->

        <!-- NAME -->

        <div
          v-for="(element, elementIndex) in data.data"
          v-bind:key="elementIndex"
        >
          <!-- <vs-input
              :label="GetLabel(element)"
              v-model="element.value"
              class="mt-5 w-full"
              :name="element.label"
              :hidden="element.hidden"
          />-->
          <div class="mt-4">
            <label v-if="element.type != 'downloadBtn'" class="text-sm">{{
              GetLabel(element)
            }}</label>

            <v-select
              v-if="element.type == 'dropdown'"
              :closeOnSelect="true"
              v-model="element.value"
              :options="element.options"
              :name="element.name"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            ></v-select>

            <v-select
              v-if="element.type == 'vselect'"
              :closeOnSelect="true"
              v-model="element.customProperties.selectedList"
              :options="element.options"
              multiple
              :name="element.name"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            ></v-select>

            <multiselect
              v-if="element.type == 'multiselect'"
              id="ajax"
              :loading="isLoading"
              @input="onChange"
              v-model="value2"
              :options="options2"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="Pick some"
              label="name"
              track-by="name"
              :preselect-first="true"
            >
              <template
                slot="selection"
                slot-scope="{ values, search, isOpen }"
              >
                <span
                  class="multiselect__single"
                  v-if="values.length &amp;&amp; !isOpen"
                  >{{ values.length }} options selected</span
                >
              </template>
            </multiselect>

            <!--  <vs-select
                v-if="element.type == 'multipleSelect'"
                placeholder="Search and select"
                class="selectExample"
                label-placeholder="Autocomplete"

                autocomplete
                v-model="element.customProperties.selectedList"
              >

                <vs-select-item :key="index" :value="item.value" :text="item.label"
                                v-for="item,index in element.options"   />

              </vs-select>

              <template v-if="element.type == 'multipleSelect'" >
                {{element}}
                <v-select multiple :closeOnSelect="false" v-model="element.customProperties.selectedList" :options="element.options" :dir="$vs.rtl ? 'rtl' : 'ltr'" /><br>

              </template>
  -->

            <vs-input
              v-if="element.type == 'text' && element.name != 'userId'"
              v-model="element.value"
              class="mt-5 w-full"
              :name="element.label"
              :hidden="element.hidden"
            />
            <vs-upload
              v-if="element.type == 'upload'"
              ref="myFileUpload"
              :automatic="false"
              fileName="content"
              text="Dosya Sürükle veya Seç!"
              :single-upload="true"
              :show-upload-button="false"
              @change="handlePdf"
              action="#"
              @on-success="successUpload"
            />

            <!-- <input
              v-if="element.type == 'upload'"
              type="file"
              @change="handlePdf"
              accept="pplication/pdf"
            /> -->

            <!--            ":data="{id:30, extension:extension}"-->

            <vs-checkbox
              v-if="element.type == 'checkbox'"
              :name="element.name"
              v-model="element.value"
              color="danger"
            />

            <vs-button
              v-if="element.type == 'downloadBtn'"
              @click="DownloadRequest(elementIndex)"
              type="gradient"
              color="success"
              class="my-4"
              >{{ element.name }}</vs-button
            >
          </div>

          <!-- v-validate="'required'"

            <span
              class="text-danger text-sm"
              v-show="errors.has('item-name')"
          >{{ errors.first('item-name') }}</span>-->
        </div>

        <!-- CATEGORY -->
        <!-- <vs-select v-model="dataCategory" label="Category" class="mt-5 w-full" name="item-category" v-validate="'required'">
          <vs-select-item :key="item.value" :value="item.value" :text="item.text" v-for="item in category_choices" />
        </vs-select>
        <span class="text-danger text-sm" v-show="errors.has('item-category')">{{ errors.first('item-category') }}</span>-->

        <!-- ORDER STATUS -->
        <!-- <vs-select v-model="dataOrder_status" label="Order Status" class="mt-5 w-full">
          <vs-select-item :key="item.value" :value="item.value" :text="item.text" v-for="item in order_status_choices" />
        </vs-select>-->

        <!-- PRICE -->
        <!-- <vs-input
          icon-pack="feather"
          icon="icon-dollar-sign"
          label="Price"
          v-model="dataPrice"
          class="mt-5 w-full"
          v-validate="{ required: true, regex: /\d+(\.\d+)?$/ }"
          name="item-price" />
        <span class="text-danger text-sm" v-show="errors.has('item-price')">{{ errors.first('item-price') }}</span>-->

        <!-- Upload -->
        <!-- <vs-upload text="Upload Image" class="img-upload" ref="fileUpload" /> -->

        <!-- <div class="upload-img mt-5" v-if="!dataImg">
          <input type="file" class="hidden" ref="uploadImgInput" @change="updateCurrImg" accept="image/*">
          <vs-button @click="$refs.uploadImgInput.click()">Upload Image</vs-button>
        </div>-->
      </div>
    </component>

    <div class="flex flex-wrap items-center p-6" slot="footer">
      <vs-button class="mr-6" @click="submitData" :disabled="!isFormValid"
        >Save</vs-button
      >
      <vs-button type="border" color="danger" @click="close()">Cancel</vs-button>
    </div>
  </vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import vSelect from "vue-select";

import Multiselect from "vue-multiselect";

export default {
  name: "transfer-table-sidebar",
  props: {
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    data: {
      type: Object,
      default: () => []
    },
    actionType: {
      type: String,
      default: () => ""
    }
  },
  components: {
    VuePerfectScrollbar,
    vSelect,
    Multiselect
  },

  created() {
    console.log(JSON.stringify(this.data));
    //loading options async
    //stop loading state (show select)
  },
  data() {
    return {
      base64List: [],
      fileList: [],
      isLoading: true,
      options2: [],
      value2: [],
      initValues: {
        id: 0,
        After: [],
        Before: [],
        Clicked: false
      },
      /* value2: [
        { name: 'Adonis', language: 'JavaScript' }
      ],
      options2: [
        { name: 'Vue.js', language: 'JavaScript' },
        { name: 'Adonis', language: 'JavaScript' },
        { name: 'Rails', language: 'Ruby' },
        { name: 'Sinatra', language: 'Ruby' },
        { name: 'Laravel', language: 'PHP' },
        { name: 'Phoenix', language: 'Elixir' }
      ],*/
      modalMessages: [],
      popupActive: false,
      options: [],
      selected: [],
      local_data: [],
      model: null,
      dataId: null,
      dataName: "",
      dataCategory: null,
      dataImg: null,
      dataOrder_status: "pending",
      dataPrice: 0,

      category_choices: [
        { label: "Audio", value: "audio" },
        { label: "Computers", value: "computers" },
        { label: "Fitness", value: "fitness" },
        { label: "Appliance", value: "appliance" }
      ],

      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6
      }
    };
  },
  watch: {
    data() {
      // alert("watch:" + JSON.stringify(this.data));
    },
    isSidebarActive(val) {
      return;
      // Object.entries(this.data).length === 0 ? this.initValues() : { this.dataId, this.dataName, this.dataCategory, this.dataOrder_status, this.dataPrice } = JSON.parse(JSON.stringify(this.data))
    }
  },
  computed: {
    isSidebarActiveLocal: {
      get() {
        return this.isSidebarActive;
      },
      set(val) {
        if (!val) {
          this.$emit("closeSidebar", false, true);
          // this.$validator.reset()
          // this.initValues()
        }
      }
    },
    isFormValid() {
      return true;
      // return (
      //   !this.errors.any() &&
      //   this.dataName &&
      //   this.dataCategory &&
      //   this.dataPrice > 0
      // );
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    }
  },

  mounted() {
    this.data.data.map(x => {
      if (x.type == "multiselect") {
        this.Get(x);
      }
    });
    // setTimeout(function(){
    // 	//loading options async
    // 	this.data[3].options = [
    //   	{value: 1, label: 'value1'},
    //   	{value: 2, label: 'value2'}
    //   ];
    //   //stop loading state (show select)
    // }.bind(this), 0);
    //  for (let index = 0; index < this.data.length; index++) {
    //   let element = this.data[index];
    //   this.GetDataFromApi(element);
    // }
    // for (let index = 0; index < this.data.length; index++) {
    //   const element = this.data[index];
    //   if (element.type == "dropdown") {
    //     // this.GetDataFromApi(element, index);
    //     fetch(element.endpoint)
    //       .then(response => {
    //         return response.json();
    //       })
    //       .then(myJson => {
    //         const arrayName = this.GetArraysName(myJson);
    //         const data = arrayName == null ? myJson : myJson[arrayName];
    //         element.options = data
    //       alert(JSON.stringify(HTMLAudioElement))
    //       });
    //   }
    // }
  },
  methods: {
    async handlePdf() {
      for (
        let index = 0;
        index < this.$refs.myFileUpload[0].filesx.length;
        index++
      ) {
        let val = await this.createBase64Pdf(
          this.$refs.myFileUpload[0].filesx[index]
        );
        this.base64List[index] = val;
      }
    },
    async createBase64Pdf(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
    },
    onChange(value) {
      this.initValues.After = value;
      this.initValues.Clicked = true;
    },
    async Get(element) {
      const el = element;

      const responseAllData = await this.$axios.post(
        el.customProperties.endpoint,
        { page: this.$store.state.page, pageSize: this.$store.state.pageSize }
      );

      this.options2 = responseAllData.data.accounts.map(x => {
        return { name: x.description, id: x.id };
      });

      const response = await this.$axios.post(
        el.customProperties.selectedDataFromApiLink,
        { [el.customProperties.postName]: el.value }
      );

      this.value2 = response.data.bulkAccIds.map(x => {
        let n = this.options2.filter(y => {
          if (y.id == x) return y.name;
        });

        return {
          name: n[0].name,
          id: x
        };
      });

      this.initValues.Before = this.value2;
      this.initValues.id = el.value;
      this.isLoading = false;
    },
    GetExtensionNames() {
      let names = this.$refs["myFileUpload"][0].filesx.map(x => {
        return x.name.split(".")[1];
      });
      return names.join("$");
      //return  this.$refs['myFileUpload'][0].filesx[0].name.split('.')[1];
    },
    GetExtensionContents() {
      // let contents = "";
      // for (let i = 0; i < this.base64List.length; i++) {
      //   contents += this.base64List[i].split(",")[1] + "$";
      // }

      let contents = this.base64List.map(x => {
        return x;
        // return x.split(",")[1];
      });

      //  console.log(contents.join())

      return contents.join("$");
    },
    successUpload() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Yükleme işlemi başarılı"
      });
    },
    downloadPDF(
      base64Data,
      contentType = "application/pdf",
      fileName = "abc.pdf"
    ) {
      const linkSource = `data:${contentType};base64,${base64Data}`;
      const downloadLink = document.createElement("a");
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    },

    DownloadRequest(index) {
      const previousData = this.data.data[index - 1];
      this.Request(previousData);

      ///
    },
    async Request(element) {
      if (Array.isArray(element.value)) element.value = element.value[0];

      const response = await this.$axios.post(
        element.customProperties.downloadLink,
        { [element.customProperties.postBody]: element.value }
      );

      this.downloadPDF(response.data.content, "application/pdf", element.value);
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
    GetData() {
      return this.category_choices;
    },
    close() {
      this.$emit("closeSidebar", false, true);
    },
    GetLabel(element) {
      if(element.name == 'userId')return "";
      else return "Shorten your link ";
      if (
        element.customProperties != null &&
        element.customProperties.labelText != null
      )
        return element.hidden ? "" : element.customProperties.labelText;
      return element.hidden ? "" : element.name;
    },
    async postData() {
      let isUpload = false;
      let toBePostObject = {};
      for (let index = 0; index < this.data.data.length; index++) {
        const element = this.data.data[index];
        if (element.type == "dropdown")
          toBePostObject[element.name] = element.value.value;
        else if (
          element.type == "multiselect" &&
          this.initValues.Clicked == true
        ) {
          let toBeAdded = [];
          let toBeRemoved = [];
          this.initValues.After.map(x => {
            const s = this.initValues.Before.some(y => y.id == x.id);
            if (!s) {
              toBeAdded.push(x.id);
            }
          });
          this.initValues.Before.map(x => {
            const s = this.initValues.After.some(y => y.id == x.id);
            if (!s) {
              toBeRemoved.push(x.id);
            }
          });

          for (let i = 0; i < toBeAdded.length; i++) {
            await this.$axios.post(element.customProperties.Create.endpoint, {
              [element.customProperties.Create.postNames[0]]: element.value,
              [element.customProperties.Create.postNames[1]]: toBeAdded[i]
            });
          }
          for (let i = 0; i < toBeRemoved.length; i++) {
            await this.$axios.post(element.customProperties.Remove.endpoint, {
              [element.customProperties.Remove.postNames[0]]: element.value,
              [element.customProperties.Remove.postNames[1]]: toBeRemoved[i]
            });
          }
        } else if (element.type == "upload") isUpload = true;
        else if (element.type == "checkbox")
          if (element.options != null)
            if ((element.value == "") | (element.value == null))
              toBePostObject[element.name] = element.options["false"];
            else toBePostObject[element.name] = element.options["true"];
          else toBePostObject[element.name] = element.value;
        else {
          if (
            element.customProperties != null &&
            element.customProperties.postName != null
          )
            toBePostObject[element.customProperties.postName] = element.value;
          else toBePostObject[element.name] = element.value;
        }
      }

      let dynamicObject = {};
      if (
        this.data.endpoint.objectName != null &&
        this.data.endpoint.objectName != ""
      )
        dynamicObject[this.data.endpoint.objectName] = toBePostObject;
      else dynamicObject = toBePostObject;
      // toBePostObject = { partner: toBePostObject };
      console.log("dynamicObject data:" + JSON.stringify(dynamicObject));
//debugger
      if (this.actionType == "create") {
        if (isUpload) {
          const extensionNames = this.GetExtensionNames().split("$");
          const contents = this.GetExtensionContents().split("$");
          for (let i = 0; i < extensionNames.length; i++) {
            let contentFullText = contents[i];
            let base64Area = contentFullText.split(",")[1];
            console.log(base64Area);
            let myObject = {
              extension: extensionNames[i],
              content: base64Area
            };
            let mergedObject = { ...dynamicObject, ...myObject };

            const uResponse = await this.$axios.post(
              this.data.endpoint.create,
              mergedObject
            );
            this.$parent.refreshHandler(true);
          }
        } else {
          const response = await this.$axios.post(
            this.data.endpoint.create,
            dynamicObject
          );

          let itHasModal = false;

          if (!itHasModal) this.$parent.refreshHandler(true);
        }

        // alert(JSON.stringify(response.data));
      } else if (this.actionType == "update") {
        const response = await this.$axios.post(
          this.data.endpoint.update,
          dynamicObject
        );
        this.$parent.refreshHandler(true);
      }
    },

    submitData() {
      this.$validator.validateAll().then(result => {
        this.postData();
        // if (result) {
        //   const obj = {
        //     id: this.dataId,
        //     name: this.dataName,
        //     img: this.dataImg,
        //     category: this.dataCategory,
        //     order_status: this.dataOrder_status,
        //     price: this.dataPrice
        //   };
        //   if (this.dataId !== null && this.dataId >= 0) {
        //     // this.$store.dispatch("dataList/updateItem", obj).catch(err => { console.error(err) })
        //     console.log("dataId!=null");
        //   } else {
        //     delete obj.id;
        //     obj.popularity = 0;
        //     // this.$store.dispatch("dataList/addItem", obj).catch(err => { console.error(err) })
        //     console.log("dataId!!=null");
        //   }
        this.$emit("closeSidebar", this.data, this.actionType);
        //   this.initValues();
        // }
      });
    }
  }
};
</script>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss" scoped>
.selectExample {
  margin: 10px;
}
.con-select-example {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
}
.con-select .vs-select {
  width: 100%;
}
@media (max-width: 550px) {
  .con-select {
    flex-direction: column;
  }
  .con-select .vs-select {
    width: 100%;
  }
}

.add-new-data-sidebar {
  ::v-deep .vs-sidebar--background {
    z-index: 52010;
  }

  ::v-deep .vs-sidebar {
    z-index: 52010;
    width: 400px;
    max-width: 90vw;

    .img-upload {
      margin-top: 2rem;

      .con-img-upload {
        padding: 0;
      }

      .con-input-upload {
        width: 100%;
        margin: 0;
      }
    }
  }
}

.scroll-area--data-list-add-new {
  // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
  height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>
