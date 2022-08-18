import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import installElementPlus from './plugins/element'
import installIcons from '@/icons'
import installFilter from '@/filter'
import installDirective from '@/directives'
import './styles/index.scss'
import './permission'

const app = createApp(App)
installIcons(app)
installElementPlus(app)
installFilter(app)
installDirective(app)
app.use(store).use(router).mount('#app')
