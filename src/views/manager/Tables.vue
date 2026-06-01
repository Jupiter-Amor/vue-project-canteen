<template>
  <div class="tables-container">
    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="search-content">
        <el-input 
          prefix-icon="Search" 
          class="search-input"
          placeholder="请输入餐桌号查询" 
          v-model="data.no"
          clearable
        />
        <div class="search-actions">
          <el-button type="primary" @click="load" class="action-btn">查询</el-button>
          <el-button plain @click="reset" class="action-btn">重置</el-button>
        </div>
      </div>
    </div>

    <!-- 表格卡片 -->
    <div class="table-card">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd" class="add-btn">
          <span>+ 新增餐桌</span>
        </el-button>
      </div>
      <el-table :data="data.tableData" stripe class="tables-table">
        <el-table-column prop="id" label="序号" width="70" align="center"/>
        <el-table-column prop="no" label="餐桌号" width="120" align="center"/>
        <el-table-column prop="unit" label="规格" width="120" align="center"/>
        <el-table-column prop="free" label="状态" width="100" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.free === '是'" type="success">空闲</el-tag>
            <el-tag v-else type="info">占用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="userName" label="占用顾客" min-width="120"/>
        <el-table-column label="操作" width="180" align="center" fixed="right">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)" class="action-btn-small">编辑</el-button>
            <el-button type="danger" size="small" @click="del(scope.row.id)" class="action-btn-small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页卡片 -->
    <div class="pagination-card" v-if="data.total">
      <el-pagination 
        background 
        layout="total, prev, pager, next, jumper" 
        @current-change="load" 
        :page-size="data.pageSize" 
        v-model:current-page="data.pageNum" 
        :total="data.total"
        class="pagination-style"
      />
    </div>

    <!-- 编辑对话框 -->
    <el-dialog v-model="data.formVisible" :title="data.form.id ? '编辑餐桌' : '新增餐桌'" width="450px" class="table-dialog" destroy-on-close>
      <el-form :model="data.form" label-width="100px" class="table-form">
        <el-form-item label="餐桌号" required>
          <el-input v-model="data.form.no" placeholder="请输入餐桌号" autocomplete="off" />
        </el-form-item>
        <el-form-item label="规格" required>
          <el-input v-model="data.form.unit" placeholder="例如：2人" autocomplete="off" />
        </el-form-item>
        <el-form-item label="是否空闲" required>
          <el-radio-group v-model="data.form.free">
            <el-radio label="是">空闲</el-radio>
            <el-radio label="否">占用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="data.formVisible = false">取消</el-button>
          <el-button type="primary" @click="save">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {reactive} from "vue"
import request from "@/utils/request";
import {ElMessage, ElMessageBox} from "element-plus";

const data = reactive({
  tableData: [],
  total: 0,
  pageNum: 1,
  pageSize: 5,
  formVisible: false,
  form: {},
  no: '',
})

const load = () => {
  request.get('/tables/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      no: data.no
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.no = null
  load()
}

const handleAdd = () => {
  data.form = {}
  data.formVisible = true
}

const save = () => {
  if (data.form.free === '是') {
    data.form.userId = null
    data.form.userName = ''
  }
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/tables/update' : '/tables/add',
    data: data.form
  }).then(res => {
    if (res.code === '200') {
      ElMessage.success('操作成功')
      data.formVisible = false
      load()
    } else {
      ElMessage.error(res.msg)
    }
  })
}

const handleEdit = (row) => {
  data.form = JSON.parse(JSON.stringify(row))
  data.formVisible = true
}

const del = (id) => {
  ElMessageBox.confirm('删除后数据无法恢复，您确认删除吗？', '确认删除', { type: 'warning' }).then(res => {
    request.delete('/tables/delete/' + id).then(res => {
      if (res.code === '200') {
        ElMessage.success('操作成功')
        load()
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}
</script>

<style scoped>
.tables-container {
  padding: 16px;
}

.search-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-content {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  flex: 1;
  min-width: 250px;
}

:deep(.search-input .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.search-input .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.search-input .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.search-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  letter-spacing: 0.5px;
}

.table-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.table-header {
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-btn {
  letter-spacing: 0.5px;
}

.tables-table {
  width: 100%;
}

:deep(.tables-table .el-table__header-wrapper) {
  background-color: #f8f9fb;
}

:deep(.tables-table .el-table__header th) {
  background-color: #f8f9fb;
  color: #2c3e50;
  font-weight: 500;
  border-color: #e8ecf1;
}

:deep(.tables-table .el-table__body td) {
  border-color: #e8ecf1;
  padding: 12px 0;
}

:deep(.tables-table tbody tr:hover > td) {
  background-color: #f8f9fb;
}

.action-btn-small {
  font-size: 12px;
}

.pagination-card {
  background: white;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
}

.pagination-style {
  display: flex;
  justify-content: center;
}

.table-dialog {
  --el-dialog-border-radius: 12px;
}

:deep(.table-dialog .el-dialog__header) {
  border-bottom: 1px solid #e8ecf1;
  padding: 20px 20px 16px;
}

:deep(.table-dialog .el-dialog__body) {
  padding: 20px;
}

.table-form {
  padding-right: 20px;
}

:deep(.table-form .el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.table-form .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.table-form .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.table-form .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>