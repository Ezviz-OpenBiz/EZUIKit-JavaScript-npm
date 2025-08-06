<<<<<<< HEAD
import Vue from 'vue'
import App from './App.vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
app.$mount();
=======
import Vue from 'vue'
import App from './App.vue'
import './uni.promisify.adaptor'

Vue.config.productionTip = false

const app = new (typeof App === 'function' ? App : Vue.extend(Object.assign({ mpType: 'app' }, App)))
app.$mount();
>>>>>>> 210a1f252ad5cbfed5e05c854b2db97d7d42b800
