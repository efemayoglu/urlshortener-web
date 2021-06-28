/*=========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

/*


pano cardlarda toplu normal yazmalı



Admin
Auditor-> Yönetim paneli  hariç. & pano aç kapat ve iade gönder  özellikleri yok
Operator->Bankalar ve Rapor & AÇ KAPA ve iade gönder VAR
Reporter = Opertor ve panelde herşey 0



 */

module.exports = {
lintOnSave:false,
  publicPath: '/',
  transpileDependencies: [
    'vue-echarts',
    'resize-detector'
  ],
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
}

