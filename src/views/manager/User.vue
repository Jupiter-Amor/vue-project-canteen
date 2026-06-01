<template>
  <div class="user-container">
    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="search-content">
        <el-input 
          prefix-icon="Search" 
          class="search-input"
          placeholder="请输入用户名称查询" 
          v-model="data.name"
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
          <span>+ 新增用户</span>
        </el-button>
      </div>
      <el-table :data="data.tableData" stripe class="user-table">
        <el-table-column prop="id" label="序号" width="70" align="center"/>
        <el-table-column prop="username" label="账号" min-width="120"/>
        <el-table-column prop="name" label="名称" min-width="120"/>
        <el-table-column label="头像" width="100" align="center">
          <template v-slot="scope">
            <div v-if="scope.row.avatar" class="avatar-container">
              <img :src="scope.row.avatar" alt="" class="user-avatar">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="80" align="center"/>
        <el-table-column prop="phone" label="手机号" min-width="120"/>
        <el-table-column prop="account" label="账户余额" width="110" align="right">
          <template #default="scope">
            <span class="balance-text">￥{{ parseFloat(scope.row.account || 0).toFixed(2) }}</span>
          </template>
        </el-table-column>
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
    <el-dialog v-model="data.formVisible" :title="data.form.id ? '编辑用户信息' : '新增用户'" width="500px" class="user-dialog" destroy-on-close>
      <el-form :model="data.form" label-width="100px" class="user-form">
        <el-form-item label="账号" required>
          <el-input v-model="data.form.username" placeholder="请输入账号" autocomplete="off" :disabled="!!data.form.id" />
        </el-form-item>
        <el-form-item label="名称" required>
          <el-input v-model="data.form.name" placeholder="请输入名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="头像">
          <el-upload :show-file-list="false" class="avatar-uploader" @change="(file) => handleFileUpload(file)">
            <div v-if="data.form.avatar" class="avatar-preview">
              <img :src="data.form.avatar" alt="" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
            </div>
            <div v-else class="avatar-placeholder">
              <el-icon><Plus /></el-icon>
              <p>上传头像</p>
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="data.form.sex">
            <el-radio label="男">男</el-radio>
            <el-radio label="女">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="data.form.phone" placeholder="请输入手机号" autocomplete="off" />
        </el-form-item>
        <el-divider></el-divider>
        <el-form-item label="账户余额" required>
          <el-input-number v-model.number="data.form.account" :min="0" :precision="2" placeholder="请输入余额" style="width: 100%" />
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
import { Plus } from '@element-plus/icons-vue'

const data = reactive({
  tableData: [],
  total: 0,
  pageNum: 1,  // 当前的页码
  pageSize: 5,  // 每页的个数
  formVisible: false,
  form: {},
  name: ''
})

const load = () => {
  request.get('/user/selectPage', {
    params: {
      pageNum: data.pageNum,
      pageSize: data.pageSize,
      name: data.name
    }
  }).then(res => {
    data.tableData = res.data?.list || []
    data.total = res.data.total
  })
}

load()

const reset = () => {
  data.name = null
  load()
}

const handleAdd = () => {
  data.form = {}  // 初始化表单
  data.formVisible = true  // 打开弹窗
}

// 保存数据
const save = () => {
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/user/update' : '/user/add',
    data: data.form
  }).then(res => {
    if (res.code === '200') {  //成功
      ElMessage.success('操作成功')
      data.formVisible = false // 关闭弹窗
      load()  // 重新加载表格数据
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
    request.delete('/user/delete/' + id).then(res => {
      if (res.code === '200') {  //成功
        ElMessage.success('操作成功')
        load()  // 重新加载表格数据
      } else {
        ElMessage.error(res.msg)
      }
    })
  }).catch(err => {
    console.log(err)
  })
}

const handleFileUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    data.form.avatar = e.target.result
  }
  reader.readAsDataURL(file.raw || file)
}

</script>

<style scoped>
.user-container {
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

.user-table {
  width: 100%;
}

:deep(.user-table .el-table__header-wrapper) {
  background-color: #f8f9fb;
}

:deep(.user-table .el-table__header th) {
  background-color: #f8f9fb;
  color: #2c3e50;
  font-weight: 500;
  border-color: #e8ecf1;
}

:deep(.user-table .el-table__body td) {
  border-color: #e8ecf1;
  padding: 12px 0;
}

:deep(.user-table tbody tr:hover > td) {
  background-color: #f8f9fb;
}

.avatar-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e8ecf1;
}

.balance-text {
  color: #e74c3c;
  font-weight: 600;
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

.user-dialog {
  --el-dialog-border-radius: 12px;
}

:deep(.user-dialog .el-dialog__header) {
  border-bottom: 1px solid #e8ecf1;
  padding: 20px 20px 16px;
}

:deep(.user-dialog .el-dialog__body) {
  padding: 20px;
}

.user-form {
  padding-right: 20px;
}

:deep(.user-form .el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.user-form .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.user-form .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.user-form .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.avatar-uploader {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.avatar-uploader .el-upload) {
  width: 120px;
  height: 120px;
  border: 2px dashed #e8ecf1;
  border-radius: 10px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fb;
}

:deep(.avatar-uploader .el-upload:hover) {
  border-color: #5b7dd5;
  background-color: rgba(91, 125, 213, 0.05);
}

.avatar-preview {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #95a5a6;
}

:deep(.avatar-uploader .el-icon) {
  font-size: 32px;
  color: #5b7dd5;
  margin-bottom: 8px;
}

.avatar-placeholder p {
  margin: 0;
  font-size: 12px;
  color: #95a5a6;
}

:deep(.user-form .el-input-number__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
}

:deep(.user-form .el-input-number__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.user-form .el-input-number__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>