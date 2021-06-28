<template>
  <div id="page-user-view">
    <div id="user-data">
      <vs-popup :title="title" :active.sync="popupActive">
        <vx-card class="mb-base">
          <vs-button
            v-if="processType == 1"
            style="float: right"
            v-clipboard:copy="message"
            v-clipboard:success="onCopy"
            v-clipboard:error="onError"
            type="gradient"
            color="success"
            >Copy</vs-button
          >
          <table v-if="contextOption != null && processType == 1">
            <tr v-for="(item, index) in contextOption" v-bind:key="index">
              <td class="font-semibold">{{ item.key }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </table>

          <vs-table
            v-else-if="contextOption != null && processType == 2"
            max-items="50"
            :data="contextOption"
          >
            <template slot="thead">
              <template v-for="(th, index) in columnsi18">
                <vs-th v-bind:key="index">
                  {{ th }}
                </vs-th>
              </template>
            </template>
            <template slot-scope="{ data }">
              <vs-tr
                :data="tr"
                :key="indextr"
                v-for="(tr, indextr) in contextOption"
              >
                <template v-for="(th, index) in columns">
                  <vs-td :key="index">
                    <template>
                      {{ tr[th] }}
                    </template>
                  </vs-td>
                </template>
              </vs-tr>
            </template>
          </vs-table>
        </vx-card>

        <template
          v-if="userActions.filter(x => x.url == 'SHOW_BELL').length > 0"
        >
          <vs-input
            v-if="checkStatus()"
            v-model="resultDescription"
            placeholder="DURUM AÇIKLAMASI GİRİNİZ.."
            class="w-full mb-5"
          >
          </vs-input>

          <vs-button
            v-if="checkStatus() && resultDescription == ''"
            disabled="true"
            style="float: right"
            type="gradient"
            color="primary"
            >Iadeye Çek</vs-button
          >

          <vs-button
            v-if="checkStatus() && resultDescription != ''"
            style="float: right"
            @click="UpdateTransfer()"
            type="gradient"
            color="primary"
            >Iadeye Çek</vs-button
          >
        </template>

        <!--   <div class="vx-col lg:w-1/1 w-full" style="margin-top: -20px;">

            </div>
-->
        <!--     <div class="vx-col lg:w-1/1 w-full">
              <table v-if="contextOption != null">
                <tr  v-for="(item,index) in contextOption" v-bind:key="index">
                  <td class="font-semibold">{{item.key}}</td>
                  <td>{{item.value}}</td>
                </tr>
              </table>
            </div>
-->
      </vs-popup>

      <vs-popup :title="'Kanıt Dosyası yükleyiniz'" :active.sync="popupActive2">
        <vx-card class="mb-base">
          <vs-row>
            <vs-upload
              v-if="popupActive2"
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

            <vs-button @click="post">Kanıt Yükle </vs-button>
          </vs-row>
        </vx-card>
      </vs-popup>
    </div>
  </div>
</template>

<script>
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
export default {
  name: "transfer-table-context-menu-genarator",
  data() {
    return {
      base64List: [],

      manualStatusTransitionId: null,
      title: "",
      processType: 0,
      columns: ["transferID", "opResult", "description", "createdAt"],
      columnsi18: ["Transfer Id", "Operasyon Sonucu", "Açıklama", "Tarih"],
      resultDescription: "",
      message: "",
      popupActive: false,
      popupActive2: false,
      contextOption: [],
      hiddenKeys: [
        "ReceiverId",
        "ReceiverPartnerId",
        "SenderId",
        "SenderPartnerId",
        "SenderType",
        "ReceiverType"
      ]
    };
  },
  computed: {
    userActions() {
      return this.$store.state.AppActiveUser.userActions;
    }
  },
  methods: {
    async post() {
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
        let mergedObject = {
          manualTransitionStatusId: this.manualStatusTransitionId,
          ...myObject
        };

        const uResponse = await this.$axios.post(
          "/ui/admin/transfers/status-transition/doc/upload",
          mergedObject
        );
      }
      this.popupActive2 = false;
      this.manualStatusTransitionId = null;
      this.$refs.myFileUpload.reset();

      this.base64List = [];
      this.$parent.refreshHandler(true);
    },
    successUpload() {
      this.$vs.notify({
        color: "success",
        title: "Upload Success",
        text: "Yükleme işlemi başarılı"
      });
    },
    async handlePdf() {
      for (
        let index = 0;
        index < this.$refs.myFileUpload.filesx.length;
        index++
      ) {
        let val = await this.createBase64Pdf(
          this.$refs.myFileUpload.filesx[index]
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
    GetExtensionNames() {
      let names = this.$refs["myFileUpload"].filesx.map(x => {
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

    UpdateTransfer() {
      this.asyncUpdateTransfer();
      ///ui/admin/transfers/update
    },
    /*async asyncUpdateTransfer(){

      const response = await this.$axios.post("/ui/admin/transfers/update", {
        transfer: {
          "id": this.getId(),
          "status": 1008,
          "resultDescription": this.resultDescription
        }
      });
      if(response!= null && response.statusText == "OK"){
        this.resultDescription=""
        this.popupActive= false
      }

    },*/

    async asyncUpdateTransfer() {
      //alert(JSON.stringify( this.contextOption))
      ///ui/admin/transfers/status-transition/request
      var itemStatus = this.contextOption.filter(function(item) {
        return item.key == "Status";
      })[0];

      if (itemStatus.value == 1003) {
        const responseM = await this.$axios.post("/ui/admin/transfers/update", {
          transfer: {
            id: this.getId(),
            status: 1008,
            resultDescription: this.resultDescription
          }
        });

        if (
          responseM != null &&
          (responseM.status == 200 || responseM.statusText == "OK")
        ) {
          this.resultDescription = "";
          this.popupActive = false;
        }
      } else if (itemStatus.value == 1002 || itemStatus.value == 1004) {
        const response = await this.$axios.post(
          "/ui/admin/transfers/status-transition/request",
          {
            // tranksfer:
            //  {
            transferId: this.getId(),
            toStatus: 1008,
            requestDesc: this.resultDescription
            // }
          }
        );

        if (
          response != null &&
          (response.status == 200 || response.statusText == "OK")
        ) {
          this.resultDescription = "";
          this.popupActive = false;
        }

        if (response != null && response.manualStatusTransitionId != null) {
          this.resultDescription = "";
          this.popupActive = false;
        }

        if (
          response != null &&
          response.data != null &&
          response.data.manualStatusTransitionId != null
        ) {
          this.manualStatusTransitionId =
            response.data.manualStatusTransitionId;
          this.popupActive2 = true;
        }
      }
    },

    checkStatus() {
      try {
        var itemStatus = this.contextOption.filter(function(item) {
          return item.key == "Status";
        })[0];

        return (
          itemStatus.value == 1002 ||
          itemStatus.value == 1003 ||
          itemStatus.value == 1004
        );
      } catch (e) {
        return false;
      }
    },

    getId() {
      var itemStatus = this.contextOption.filter(function(item) {
        return item.key == "Id";
      })[0];

      return itemStatus.value;
    },
    onCopy() {
      this.$toasted.show("Copied", {
        theme: "outline",
        position: "bottom-right",
        duration: 2000
      });
    },
    onError() {
      this.$toasted.show("Error", {
        theme: "outline",
        position: "bottom-right",
        duration: 2000
      });
    },
    showPopup() {},
    setData(data) {
      this.popupActive = true;
      this.GetValue(data);
    },

    GetValue(data) {
      if (Object.prototype.toString.call(data) == "[object Array]") {
        this.processType = 2;
        this.contextOption = data;
        this.title = "Transfer Logs";
      } else {
        this.processType = 1;
        this.title = "Transfer Details";
        this.contextOption = [];
        for (let variable in data) {
          let kebabCaseVariable =
            variable.charAt(0).toUpperCase() + variable.slice(1);
          let obj = {};
          obj["key"] = kebabCaseVariable;
          obj["value"] = data[variable];
          if (!this.hiddenKeys.includes(obj["key"]))
            this.contextOption.push(obj);
          this.message += kebabCaseVariable + ":" + data[variable] + "\n";
        }
      }
    }
  },
  created() {},
  mounted() {
    this.title = "Transfers Detail";
  }
};
</script>

<style lang="scss" scoped>
* {
  line-height: 1.7 !important;
}

avatar-col {
  width: 10rem;
}

#page-user-view {
  table {
    td {
      vertical-align: top;
      min-width: 140px;
      padding-bottom: 0.8rem;
      word-break: break-all;
    }

    &:not(.permissions-table) {
      td {
        @media screen and (max-width: 370px) {
          display: block;
        }
      }
    }
  }
}

// #account-info-col-1 {
//   // flex-grow: 1;
//   width: 30rem !important;
//   @media screen and (min-width:1200px) {
//     & {
//       flex-grow: unset !important;
//     }
//   }
// }

@media screen and (min-width: 1201px) and (max-width: 1211px),
  only screen and (min-width: 636px) and (max-width: 991px) {
  #account-info-col-1 {
    width: calc(100% - 12rem) !important;
  }

  // #account-manage-buttons {
  //   width: 12rem !important;
  //   flex-direction: column;

  //   > button {
  //     margin-right: 0 !important;
  //     margin-bottom: 1rem;
  //   }
  // }
}
</style>
