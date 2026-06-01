<template>
  <div class="foods-container">
    <!-- 搜索卡片 -->
    <div class="search-card">
      <div class="search-content">
        <el-input 
          prefix-icon="Search" 
          class="search-input"
          placeholder="请输入餐品名称查询" 
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
          <span>+ 新增餐品</span>
        </el-button>
      </div>
      <el-table :data="data.tableData" stripe class="foods-table">
        <el-table-column prop="id" label="序号" width="70" align="center"/>
        <el-table-column prop="name" label="餐品名称" min-width="120"/>
        <el-table-column prop="descr" label="餐品描述" min-width="150" show-overflow-tooltip/>
        <el-table-column prop="price" label="价格" width="100" align="right">
          <template #default="scope">
            <span class="price-text">￥{{ Number(scope.row.price).toFixed(2) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="餐品图片" width="120" align="center">
          <template v-slot="scope">
            <el-image 
              v-if="scope.row.img" 
              style="width: 80px; height: 80px" 
              :src="scope.row.img" 
              :preview-src-list="[scope.row.img]" 
              preview-teleported
              fit="cover"
            />
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
    <el-dialog v-model="data.formVisible" :title="data.form.id ? '编辑餐品' : '新增餐品'" width="500px" class="food-dialog" destroy-on-close>
      <el-form :model="data.form" label-width="100px" class="food-form">
        <el-form-item label="餐品名称" required>
          <el-input v-model="data.form.name" placeholder="请输入餐品名称" autocomplete="off" />
        </el-form-item>
        <el-form-item label="餐品描述" required>
          <el-input type="textarea" v-model="data.form.descr" placeholder="请输入餐品描述" :rows="3" autocomplete="off" />
        </el-form-item>
        <el-form-item label="餐品价格" required>
          <el-input v-model="data.form.price" placeholder="请输入价格" autocomplete="off" />
        </el-form-item>
        <el-form-item label="餐品图片" required>
          <el-upload :show-file-list="false" @change="(file) => handleFileUpload(file)" class="upload-area">
            <div v-if="data.form.img" class="upload-preview">
              <img :src="data.form.img" alt="预览" style="width: 100%; height: 100%; object-fit: cover">
            </div>
            <div v-else class="upload-placeholder">
              <el-icon class="upload-icon"><Plus /></el-icon>
              <p class="upload-text">点击选择图片</p>
            </div>
          </el-upload>
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
  pageNum: 1,
  pageSize: 5,
  formVisible: false,
  form: {},
  name: '',
})

const load = () => {
  request.get('/foods/selectPage', {
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
  data.form = {}
  data.formVisible = true
}

const save = () => {
  // 确保 price 是数字类型
  const formData = {
    ...data.form,
    price: Number(data.form.price)
  }
  request.request({
    method: data.form.id ? 'PUT' : 'POST',
    url: data.form.id ? '/foods/update' : '/foods/add',
    data: formData
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
    request.delete('/foods/delete/' + id).then(res => {
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

const handleFileUpload = (file) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    data.form.img = e.target.result
  }
  reader.readAsDataURL(file.raw || file)
}
</script>

<style scoped>
.foods-container {
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

.foods-table {
  width: 100%;
}

:deep(.foods-table .el-table__header-wrapper) {
  background-color: #f8f9fb;
}

:deep(.foods-table .el-table__header th) {
  background-color: #f8f9fb;
  color: #2c3e50;
  font-weight: 500;
  border-color: #e8ecf1;
}

:deep(.foods-table .el-table__body td) {
  border-color: #e8ecf1;
  padding: 12px 0;
}

:deep(.foods-table tbody tr:hover > td) {
  background-color: #f8f9fb;
}

.price-text {
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

.food-dialog {
  --el-dialog-border-radius: 12px;
}

:deep(.food-dialog .el-dialog__header) {
  border-bottom: 1px solid #e8ecf1;
  padding: 20px 20px 16px;
}

:deep(.food-dialog .el-dialog__body) {
  padding: 20px;
}

.food-form {
  padding-right: 20px;
}

:deep(.food-form .el-form-item__label) {
  color: #2c3e50;
  font-weight: 500;
}

:deep(.food-form .el-input__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.food-form .el-input__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.food-form .el-input__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

:deep(.food-form .el-textarea__wrapper) {
  background-color: #f8f9fb;
  border: 1px solid #e8ecf1;
  transition: all 0.3s ease;
}

:deep(.food-form .el-textarea__wrapper:hover) {
  border-color: #cbd5e0;
}

:deep(.food-form .el-textarea__wrapper.is-focus) {
  border-color: #5b7dd5;
  box-shadow: 0 0 0 2px rgba(91, 125, 213, 0.1);
}

.upload-area {
  width: 100%;
  padding: 0;
}

:deep(.upload-area .el-upload) {
  width: 100%;
}

:deep(.upload-area .el-upload-dragger) {
  width: 100%;
  height: 140px;
  border: 2px dashed #e8ecf1;
  border-radius: 8px;
  background-color: #f8f9fb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

:deep(.upload-area .el-upload-dragger:hover) {
  border-color: #5b7dd5;
  background-color: rgba(91, 125, 213, 0.05);
}

.upload-preview {
  width: 100%;
  height: 140px;
  border: 2px solid #e8ecf1;
  border-radius: 8px;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.upload-icon {
  font-size: 32px;
  color: #5b7dd5;
  margin-bottom: 8px;
}

.upload-text {
  margin: 0;
  color: #95a5a6;
  font-size: 14px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>