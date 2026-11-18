import Vue from 'vue'
import App from './App.vue'
import store from './store'
// common panel component
import Panel from './components/panel'
import Copy from './components/copy'
import GlassSelect from './components/glass-select'
import '@fontsource/inter/latin-400'
import '@fontsource/inter/latin-500'
import '@fontsource/inter/latin-600'
import '@fontsource/inter/latin-700'
import './style.scss'

// use 'buefy/src' when running from git,
// import Buefy from 'buefy/src'
// or use 'buefy' when running from npm
import Buefy from 'buefy'

// add Buefy to Vue
Vue.use(Buefy)

// load panel component globally
Vue.component('panel', Panel)
// load clipboard copy button component globally
Vue.component('copy', Copy)
// load styled select menu component globally
Vue.component('GlassSelect', GlassSelect)

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
