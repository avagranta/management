<template>
  <upload-excel :onSuccess="onSuccess"></upload-excel>
</template>

<script setup>
import UploadExcel from '@/components/UploadExcel'
import { formatDate, USER_RELATIONS } from './utils'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { userBatchImport } from '@/api/user-manage'

const router = useRouter()

/**
 * 数据解析成功之后的回调
 */
const onSuccess = async ({ header, results }) => {
  const updateData = generateData(results)
  await userBatchImport(updateData)
  ElMessage.success({
    message: results.length + ' 条员工数据导入成功',
    type: 'success'
  })
  router.push('/user/manage')
}

/**
 * 筛选数据
 */
const generateData = (results) => {
  const arr = []
  results.forEach((item) => {
    const userInfo = {}
    Object.keys(item).forEach((key) => {
      userInfo[USER_RELATIONS[key]] = formatDate(item[key])
    })
    arr.push(userInfo)
  })
  return arr
}
</script>
