<!-- =========================================================================================
    File Name: TheFooter.vue
    Description: Footer component
    Component Name: TheFooter
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->
<!--

  methods: {
    myFunction() {
      this.$vs.notify({
        title: 'Function click',
        text: 'Click on me to execute function',
        color: 'primary',
        fixed: true,
        click: () => {
          // Secondary function
          this.$vs.notify({
            title: 'Secondary function',
            text: 'Executed the function when clicking',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        },
      })
    }
     }

          <vs-button @click="myFunction()" type="gradient" color="success" class="my-4">Run Example</vs-button>

-->

<template functional>
  <footer class="the-footer flex-wrap justify-between" :class="classes">
    <p>
      <span>COPYRIGHT &copy;</span>
      <span>{{ new Date().getFullYear() }}</span>

      <span class="hidden sm:inline-block">, All rights Reserved</span>
    </p>
    <span class="md:flex hidden items-center">
      <!-- <span>Hand-crafted & Made with</span>
      <feather-icon icon="HeartIcon" svgClasses="stroke-current text-danger w-6 h-6" class="ml-2" />-->
    </span>
  </footer>
</template>

<script>
export default {
  name: "the-footer",
  props: {
    classes: {
      type: String
    }
  }
};
</script>
