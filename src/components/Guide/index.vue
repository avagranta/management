<template>
  <div>
    <el-tooltip content="功能引导">
      <svg-icon id="guide-start" icon="guide" @click="onClick" />
    </el-tooltip>
  </div>
</template>

<script setup>
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
import { onMounted } from 'vue'
import steps from './steps'

let driver = null
onMounted(() => {
  driver = new Driver({
    animate: false,
    allowClose: false,
    closeBtnText: '关闭',
    nextBtnText: '下一个',
    prevBtnText: '上一个'
  })
})

const onClick = () => {
  driver.defineSteps(steps())
  driver.start()
}
</script>

<style scoped></style>
