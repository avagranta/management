<template>
  <div class="">
    <el-card>
      <el-table :data="allRoles" border style="width: 100%">
        <el-table-column label="序号" type="index" width="120">
        </el-table-column>
        <el-table-column label="名称" prop="title"> </el-table-column>
        <el-table-column label="描述" prop="describe"> </el-table-column>
        <el-table-column
          label="操作"
          prop="action"
          width="260"
          #default="{ row }"
        >
          <el-button
            v-permission="['distributePermission']"
            type="primary"
            size="small"
            @click="onDistributePermissionClick(row)"
            >分配权限
          </el-button>
        </el-table-column>
      </el-table>
    </el-card>
    <distribute-permission
      v-model="distributePermissionVisible"
      :role-id="selectRoleId"
    ></distribute-permission>
  </div>
</template>

<script setup>
import { roleList } from '@/api/role'
import { ref } from 'vue'
import DistributePermission from './components/DistributePermission.vue'

const allRoles = ref([])
const getRoleList = async () => {
  allRoles.value = await roleList()
}
const distributePermissionVisible = ref(false)
const selectRoleId = ref('')

getRoleList()

/**
 * 分配权限
 */
const onDistributePermissionClick = (row) => {
  selectRoleId.value = row.id
  distributePermissionVisible.value = true
}
</script>

<style></style>
