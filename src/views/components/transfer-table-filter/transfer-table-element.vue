<template>
  <div>
    <div v-bind:key="filterElement.index" v-for="filterElement in elements">
      <div v-show="!filterElement.filterHidden">
        <template v-if="filterElement.type == 'singleDate'">
          <div class="mt-4">
            <label class="text-sm">{{ filterElement.name }}</label>
            <!-- :config="{ dateFormat: 'd F Y', maxDate: new Date() }" -->
            <flat-pickr
              :config="{ dateFormat: 'd F Y', maxDate: new Date() }"
              class="w-full"
              :name="filterElement.name"
            />
            <span
              class="text-danger text-sm"
              v-show="errors.has(filterElement.name)"
              >{{ errors.first(filterElement.name) }}</span
            >
          </div>
        </template>
        <template v-if="filterElement.type == 'mobile'">
          <vs-input
            class="w-full mt-4"
            :label="filterElement.name"
            v-validate="{ regex: '^\\+?([0-9]+)$' }"
            :name="filterElement.name"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has(filterElement.name)"
            >{{ errors.first(filterElement.name) }}</span
          >
        </template>
        <template v-if="filterElement.type == 'website'">
          <vs-input
            class="w-full mt-4"
            label="Website"
            v-validate="'url:require_protocol'"
            name="website"
            data-vv-as="field"
          />
          <span class="text-danger text-sm" v-show="errors.has('website')">{{
            errors.first("website")
          }}</span>
        </template>
        <template v-if="filterElement.type == 'text'">
          <vs-input
            v-model="filterElement.value"
            class="w-full mt-4"
            :label="filterElement.labelText"
            :name="filterElement.name"
          />

          <!-- <span
                    class="text-danger text-sm"
                    v-show="errors.has(filterElement.name)"
        >{{ errors.first(filterElement.name) }}</span>-->
        </template>
        <template v-if="filterElement.type == 'radio'">
          <div class="mt-4">
            <label class="text-sm">Radio</label>
            <div class="mt-2">
              <!-- v-model aynı olmalı-->
              <vs-radio vs-value="male" class="mr-4">Male</vs-radio>
              <vs-radio vs-value="famale" class="mr-4">Famale</vs-radio>
            </div>
          </div>
        </template>
        <template v-if="filterElement.type == 'checkbox'">
          <div class="mt-6">
            <label>{{ filterElement.labelText }}</label>
            <div class="flex flex-wrap mt-1">
              <vs-checkbox :vs-value="filterElement.value" class="mr-4 mb-2">{{
                filterElement.name
              }}</vs-checkbox>
            </div>
          </div>
        </template>
        <template v-if="filterElement.type == 'dropdown'">
          <div class="mt-4">
            <!--  <label v-if="filterElement.name == 'bankCode'" class="text-sm">Bank Name</label>-->
            <label class="text-sm">{{ filterElement.labelText }}</label>
            <span
              class="text-danger text-sm"
              v-if="isRequire(filterElement) && !filterElement.value"
            >
              *(Zorunlu alan)</span
            >

            <v-select
              @input="sa"
              :closeOnSelect="true"
              v-model="filterElement.value"
              :options="filterElement.options"
              :name="filterElement.name"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            ></v-select>
          </div>
        </template>
        <template v-if="filterElement.type == 'multiple'">
          <div class="mt-4">
            <label class="text-sm">Multiple</label>
            <v-select
              multiple
              :closeOnSelect="false"
              :options="filterElement.options"
              name="lang_known"
              :dir="$vs.rtl ? 'rtl' : 'ltr'"
            />
            <span
              class="text-danger text-sm"
              v-show="errors.has('lang_known')"
              >{{ errors.first("lang_known") }}</span
            >
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import vSelect from "vue-select";

export default {
  name: "transfer-table-element",
  components: { flatPickr, vSelect },
  props: {
    elements: {
      type: Array,
      required: true
    }
  },
  methods: {
    isRequire(elm) {
      return elm.customProperties && elm.customProperties.isRequire;
      return false;
    }
  }
};
</script>

<style scoped></style>
