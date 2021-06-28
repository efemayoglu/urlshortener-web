<template>
  <div :style="{ direction: $vs.rtl ? 'rtl' : 'ltr' }">
    <vs-dropdown vs-trigger-click>
      <span class="flex items-center" style="cursor:pointer" href="#">
        <feather-icon
          icon="SettingsIcon"
          svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
          @click="editRecord"
        />
      </span>

      <vs-dropdown-menu>
        <vs-dropdown-item
          v-for="(contextMenu, index) in params.tableContextMenu"
          v-bind:key="index"
        >
          <div class="myFlex" @click="handler(contextMenu)">
            <vx-tooltip
              :text="GetLabel(contextMenu)"
              color="success"
              class="innerFlex"
            >
              <feather-icon
                :icon="contextMenu.icon"
                svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
              />
            </vx-tooltip>
            {{ GetLabel(contextMenu) }}
          </div>
        </vs-dropdown-item>

        <!-- <vs-dropdown-item v-if="!IsAddNew">
        <vx-tooltip text="Save" color="success">
          <feather-icon icon="SaveIcon"  svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmSaveNewRecord" />
        </vx-tooltip>
      </vs-dropdown-item>

       <vs-dropdown-item v-if="IsAddNew">
        <vx-tooltip text="Save" color="success">
          <feather-icon icon="SaveIcon"  svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="confirmSaveNewRecord" />
        </vx-tooltip>
        </vs-dropdown-item>-->

        <!-- <vs-dropdown-item divider>
          <vx-tooltip text="Delete" color="danger">
            <feather-icon
              icon="Trash2Icon"
              svgClasses="h-5 w-5 hover:text-danger cursor-pointer"
              @click="confirmDeleteRecord"
            />
          </vx-tooltip>
        </vs-dropdown-item>-->

        <!-- <vs-dropdown-item>
          <vx-tooltip text="Detail" color="primary">
            <feather-icon
              icon="ZoomInIcon"
              svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer"
              @click="detail()"
            />
          </vx-tooltip>
        </vs-dropdown-item>-->
        <!-- <vs-dropdown-item divider>
        Option 3
        </vs-dropdown-item>-->
      </vs-dropdown-menu>
    </vs-dropdown>

    <!-- <feather-icon icon="SettingsIcon" svgClasses="h-5 w-5 mr-4 hover:text-primary cursor-pointer" @click="editRecord" />
    <feather-icon icon="Trash2Icon" svgClasses="h-5 w-5 hover:text-danger cursor-pointer" @click="confirmDeleteRecord" />-->
  </div>
</template>

<script>
export default {
  name: "CellRendererActions",
  data() {
    return {
      CustomContexts: [],
      thisContextMenu: ""
    };
  },
  created() {
    console.log(this.params);
  },

  computed: {
    IsAddNew() {
      if (this.params.data.id < 1) {
        return true;
      }
      return false;
    }
  },
  methods: {
    GetLabel(contextMenu) {
      if (contextMenu.label != "" && contextMenu.label != null) {
        return contextMenu.label;
      } else {
        return contextMenu.name;
      }
    },
    deleteHandler() {
      let contextMenu = this.thisContextMenu;
      let type = contextMenu.name;

      if (type == "delete") {
        this.$parent.$parent.ActionHandler(this.params.data, type);
      } else {
        this.$parent.$parent.$parent.ContextMenuHandler(
          this.params.data,
          contextMenu
        );
      }
    },
    handler(contextMenu, i = 0) {
      this.thisContextMenu = contextMenu;
      let type = contextMenu.name;
      if (type == "undefined" || type == undefined) return;
      else if (type == "delete" && i == 0) {
        this.confirmDeleteRecord();
        return;
      } else if (type == "update" || type == "delete" || type == "create") {
        this.$parent.$parent.ActionHandler(this.params.data, type);
      }
      //  else if (type != "") {
      //   this.$parent.$parent.ActionHandler(this.params.data, type, contextMenu.custom);
      // }
      else {
        this.$parent.$parent.$parent.ContextMenuHandler(
          this.params.data,
          contextMenu
        );
      }
    },

    editRecord() {
      this.$router.push("/apps/user/user-edit/" + 268).catch(() => {});

      /*
              Below line will be for actual product
              Currently it's commented due to demo purpose - Above url is for demo purpose

              this.$router.push("/apps/user/user-edit/" + this.params.data.id).catch(() => {})
            */
    },
    confirmSaveRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `Confirm Save`,
        text: `Your are saving data which is Id="${this.params.data.id} "`,
        accept: this.showSaveSuccess,
        acceptText: "Save"
      });
    },
    confirmSaveNewRecord() {
      this.$vs.dialog({
        type: "confirm",
        color: "success",
        title: `Confirm Save`,
        text: `Your are saving new data "`,
        accept: this.showNewSaveSuccess,
        acceptText: "Save"
      });
    },
    confirmDeleteRecord() {
    //  debugger
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Confirm Delete`,
        text: `Are you sure ?`,
        accept: this.deleteHandler,
        acceptText: "Delete"
      });
    },

    showNewSaveSuccess() {
      this.$vs.notify({
        color: "success",
        title: "Data Added",
        text: "The new data successfully save"
      });
    },
    showSaveSuccess() {
      console.log(this.params.tableStruct.endpoint);
      this.$vs.notify({
        color: "success",
        title: "Data Saved",
        text: "The selected data successfully save"
      });
    },
    showDeleteSuccess() {
      this.$vs.notify({
        color: "success",
        title: "Data Deleted",
        text: "The selected user was successfully deleted"
      });
    }
  }
};
</script>

<style scoped>
.myFlex {
  display: flex;
}
.innerFlex {
  margin-right: 2px;
  justify-content: center;
  align-items: center;
}
</style>
