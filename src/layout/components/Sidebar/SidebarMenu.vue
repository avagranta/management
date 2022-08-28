<template>
  <el-menu
    :unique-opened="true"
    :default-active="activeMenu"
    :background-color="$store.getters.cssVar.menuBg"
    :text-color="$store.getters.cssVar.menuText"
    :active-text-color="$store.getters.cssVar.menuActiveText"
    router
    :collapse="!$store.getters.sidebarOpened"
  >
    <sidebar-item
      v-for="item in routes"
      :key="item.path"
      :route="item"
    ></sidebar-item>
  </el-menu>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'
import { filterRouters, generateMenus } from '@/utils/route'
import SidebarItem from './SidebarItem.vue'

const router = useRouter()
const routes = computed(() => {
  const filterRoutes = filterRouters(router.getRoutes())
  const resMenu = generateMenus(filterRoutes)
  console.log(router.getRoutes())
  console.log(filterRoutes)
  console.log(resMenu)
  return resMenu
})
const route = useRoute()
const activeMenu = computed(() => {
  const { path } = route
  return path
})
// console.log(JSON.stringify(routes.value))
</script>
