<template>
  <el-collapse v-model="activeName" accordion>
    <el-collapse-item
      v-for="item in features"
      :key="item.id"
      :title="item.title"
      :name="item.id"
    >
      <div v-html="item.content"></div>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup>
import { ref } from 'vue'
const activeName = ref(0)
const features = [
  {
    id: 1,
    title: 'Vue3 + 全家桶',
    content: '使用 Vue3 + 全家桶搭建'
  },
  {
    id: 2,
    title: 'Vue3 + 全家桶',
    content: '使用 Vue3 + 全家桶搭建'
  },
  {
    id: 3,
    title: 'Vue3 + 全家桶',
    content: '使用 Vue3 + 全家桶搭建'
  },
  {
    id: 4,
    title: 'Vue3 + 全家桶',
    content: '使用 Vue3 + 全家桶搭建'
  }
]
</script>

<style lang="scss" scoped>
::v-deep .el-collapse-item__header {
  font-weight: bold;
}

.el-collapse-item {
  ::v-deep a {
    color: #2d62f7;
    margin: 0 4px;
  }
}
</style>
