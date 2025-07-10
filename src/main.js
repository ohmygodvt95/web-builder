import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

import './style.css'
import App from './App.vue'

// Create routes
const routes = [
  {
    path: '/',
    name: 'Editor',
    component: () => import('./views/Editor.vue'),
  },
]

// Create router
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Create Pinia store
const pinia = createPinia()

// Create app
const app = createApp(App)

// Use plugins
app.use(router)
app.use(pinia)
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: toast.POSITION.BOTTOM_RIGHT,
})

app.mount('#app')
