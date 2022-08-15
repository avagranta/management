<template>
  <el-timeline>
    <el-timeline-item
      v-for="item in chapterData"
      :key="item.id"
      :timestamp="item.timestamp"
      placement="top"
    >
      <el-card>
        <h4>{{ item.content }}</h4>
      </el-card>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup>
const chapterData = [
  {
    id: 1,
    timestamp: '阶段一',
    content: '完成项目初始化'
  },
  {
    id: 2,
    timestamp: '阶段二',
    content: '完成项目初始化'
  },
  {
    id: 3,
    timestamp: '阶段三',
    content: '完成项目初始化'
  }
]
</script>
