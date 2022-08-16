<template>
  <el-dialog title="新增角色" :model-value="modelValue" @close="closed">
    <el-checkbox-group v-model="userRoleTitleList">
      <el-checkbox
        v-for="item in allRoleList"
        :key="item.id"
        :label="item.title"
      ></el-checkbox>
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closed">取消</el-button>
        <el-button type="primary" @click="onConfirm"> 确定 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue'
import { roleList } from '@/api/role'
import { userRoles, updateRole } from '@/api/user-manage'
import { ElMessage } from 'element-plus'
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
})
const emits = defineEmits(['update:modelValue'])

// 所有角色
const allRoleList = ref([])

// 获取角色数据
const getListData = async () => {
  allRoleList.value = await roleList()
}

getListData()

// 当前用户角色
const userRoleTitleList = ref([])

// 获取当前用户角色
const getUserRoles = async () => {
  const res = await userRoles(props.userId)
  userRoleTitleList.value = res.role.map((item) => item.title)
}

watch(
  () => props.userId,
  (val) => {
    if (val) getUserRoles()
  }
)

/**
 确定按钮点击事件
*/
const onConfirm = async () => {
  const roles = userRoleTitleList.value.map((title) => {
    return allRoleList.value.find((role) => role.title === title)
  })

  await updateRole(props.userId, roles)
  ElMessage.success('用户角色更新成功')
  emits('updateRole')
  closed()
}

/**
 * 关闭
 */
const closed = () => {
  emits('update:modelValue', false)
}
</script>

<style lang="scss" scoped></style>
