<template>
  <el-breadcrumb class="breadcrumb" separatpr="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item
        v-for="(item, index) in breadcrumbData"
        :key="item.path"
      >
        <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{
          item.meta.title
        }}</span>
        <a v-else class="redirect" @click.prevent="onLinkClick(item)">{{
          item.meta.title
        }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const route = useRoute()
const breadcrumbData = ref([])
const getBreadcrumbData = () => {
  console.log(route.matched)
  breadcrumbData.value = route.matched.filter((item) => {
    return item.meta && item.meta.title
  })
}

watch(
  route,
  () => {
    getBreadcrumbData()
  },
  { immediate: true }
)

const router = useRouter()
const onLinkClick = (item) => {
  router.push(item.path)
}

const store = useStore()
const linkHoverColor = ref(store.getters.cssVar.menuBg)
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;

  .redirect {
    color: #666;
    font-weight: 600;
  }
  .redirect:hover {
    color: v-bind(linkHoverColor);
  }
  ::v-deep .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
