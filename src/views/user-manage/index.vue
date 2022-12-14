<template>
  <div class="user-manage-container">
    <el-card class="header">
      <div>
        <el-button
          type="primary"
          v-permission="['importUser']"
          @click="onImportExcelClick"
        >
          excel 导入</el-button
        >
        <el-button type="success" @click="onExportToExcelClick">
          excel 导出
        </el-button>
      </div>
    </el-card>
    <el-card>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="#" type="index" />
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="mobile" label="联系方式"> </el-table-column>
        <el-table-column label="头像" align="center">
          <template v-slot="{ row }">
            <el-image
              class="avatar"
              :src="row.avatar"
              :preview-src-list="[row.avatar]"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column label="角色">
          <template #default="{ row }">
            <div v-if="row.role && row.role.length > 0">
              <el-tag v-for="item in row.role" :key="item.id" size="small">{{
                item.title
              }}</el-tag>
            </div>
            <div v-else>
              <el-tag size="small">员工</el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="openTime" label="开通时间">
          <template #default="{ row }">
            {{ $filters.dateFilter(row.openTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="260">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="onDetailClick"
              >查看</el-button
            >
            <el-button
              v-permission="['distributeRole']"
              type="info"
              size="small"
              @click="onShowRoleClick(row)"
              >角色</el-button
            >
            <el-button
              v-permission="['removeUser']"
              type="danger"
              size="small"
              @click="onRemoveClick(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
  <export-to-excel v-model="exportToExcelVisible"></export-to-excel>
  <roles-dialog
    v-model="roleDialogVisible"
    :user-id="selectUserId"
    @updateRole="getListData"
  ></roles-dialog>
</template>

<script setup>
import { ref, onActivated, watch } from 'vue'
import { getUserManageList, deleteUser } from '@/api/user-manage'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ExportToExcel from './components/Export2Excel'
import RolesDialog from './components/role.vue'

const router = useRouter()

const selectUserId = ref('')

/**
 * excel导入点击事件
 */
const onImportExcelClick = () => {
  router.push('/user/import')
}

/**
 * excel导出事件
 */
const exportToExcelVisible = ref(false)
const onExportToExcelClick = () => {
  exportToExcelVisible.value = true
}

/**
 * 查看详情信息
 */
const onDetailClick = () => {
  ElMessageBox.alert('功能暂未开放，敬请期待', '提示', {
    confirmButtonText: '确定'
  })
}

/**
 * 查看角色
 */
const roleDialogVisible = ref(false)
const onShowRoleClick = (row) => {
  selectUserId.value = row._id
  roleDialogVisible.value = true
}

watch(roleDialogVisible, (val) => {
  if (!val) selectUserId.value = ''
})

// 数据相关
const tableData = ref([])
const total = ref(0)
const page = ref(1)
const size = ref(2)
// 获取数据的方法
const getListData = async () => {
  const result = await getUserManageList({
    page: page.value,
    size: size.value
  })
  tableData.value = result.list
  total.value = result.total
}
getListData()

// 分页相关
/**
 * size 改变触发
 */
const handleSizeChange = (currentSize) => {
  size.value = currentSize
  getListData()
}

/**
 * 页码改变触发
 */
const handleCurrentChange = (currentPage) => {
  page.value = currentPage
  getListData()
}

/**
 * 删除
 */

const onRemoveClick = (row) => {
  ElMessageBox.confirm('确定要删除用户' + row.username + '吗', {
    type: 'warning'
  }).then(async () => {
    await deleteUser(row._id)
    ElMessage.success('删除成功')
    getListData()
  })
}

// 导入用户后刷新数据
onActivated(getListData)
</script>

<style lang="scss" scoped>
.user-manage-container {
  .header {
    margin-bottom: 22px;
    text-align: right;
  }
  ::v-deep .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }

  ::v-deep .el-tag {
    margin-right: 6px;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
