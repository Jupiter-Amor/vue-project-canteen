import { ElMessage } from 'element-plus'

//恢复初始值：localStorage.clear()

// 本地存储的模拟数据
const mockData = {
    // 模拟用户数据
    users: [
        { id: 1, username: 'admin', password: 'admin123', name: '管理员', role: 'ADMIN', avatar: '@/assets/imgs/avatar.png', sex: '男', phone: '13800138000', account: 1000 },
        { id: 2, username: 'user1', password: 'user123', name: '张三', role: 'USER', avatar: '@/assets/imgs/avatar.png', sex: '男', phone: '13800138001', account: 500 },
        { id: 3, username: 'user2', password: 'user123', name: '李四', role: 'USER', avatar: '@/assets/imgs/avatar.png', sex: '女', phone: '13800138002', account: 600 },
    ],
    // 模拟餐桌数据
    tables: [
        { id: 1, number: '1号桌', no: '1号桌', capacity: 4, unit: '4人', location: '靠窗', status: 0, free: '是', userName: '', userId: null },
        { id: 2, number: '2号桌', no: '2号桌', capacity: 6, unit: '6人', location: '靠窗', status: 0, free: '是', userName: '', userId: null },
        { id: 3, number: '3号桌', no: '3号桌', capacity: 4, unit: '4人', location: '中央', status: 1, free: '否', userName: '用户1', userId: null },
        { id: 4, number: '4号桌', no: '4号桌', capacity: 8, unit: '8人', location: '中央', status: 0, free: '是', userName: '', userId: null },
    ],
    // 模拟菜品数据
    foods: [
        { id: 1, name: '宫保鸡丁', price: 28, category: '热菜', descr: '经典川菜', description: '经典川菜', img: '@/assets/imgs/宫保鸡丁.png' },
        { id: 2, name: '西红柿炒鸡蛋', price: 18, category: '家常菜', descr: '家庭必备菜', description: '家庭必备菜', img: '@/assets/imgs/西红柿炒鸡蛋.jpg' },
        { id: 3, name: '清蒸鱼', price: 38, category: '鱼类', descr: '鲜美营养', description: '鲜美营养', img: '@/assets/imgs/清蒸鱼.jpg' },
        { id: 4, name: '红烧肉', price: 35, category: '热菜', descr: '香到不行', description: '香到不行', img: '@/assets/imgs/红烧肉.jpg' },
        { id: 5, name: '凉拌黄瓜', price: 12, category: '凉菜', descr: '清爽解腻', description: '清爽解腻', img: '@/assets/imgs/凉拌黄瓜.jpg' },
    ],
    // 模拟订单数据
    orders: [
        { id: 1, tableId: 1, userId: 1, userName: '管理员', orderNo: 'ORD001', foods: [{ foodId: 1, foodName: '宫保鸡丁', quantity: 2, price: 28 }], content: '宫保鸡丁x2', totalPrice: 56, total: 56, status: '待出餐', createTime: '2025-01-01 10:30', servingTime: '', settleTime: '' },
        { id: 2, tableId: 2, userId: 2, userName: '张三', orderNo: 'ORD002', foods: [{ foodId: 2, foodName: '西红柿鸡蛋', quantity: 1, price: 18 }], content: '西红柿鸡蛋x1', totalPrice: 18, total: 18, status: '待结算', createTime: '2025-01-01 11:00', servingTime: '', settleTime: '' },
    ]
}

// 初始化本地数据
function initMockData() {
    const stored = localStorage.getItem('canteen-mock-data')
    if (!stored) {
        // 首次初始化：将 mockData 中使用 @/assets 路径的图片解析为可被浏览器访问的绝对 URL
        const dataToStore = JSON.parse(JSON.stringify(mockData))

        // 解析用户头像
        if (Array.isArray(dataToStore.users)) {
            dataToStore.users.forEach(u => {
                if (u && typeof u.avatar === 'string' && u.avatar.startsWith('@/assets/imgs/')) {
                    const file = u.avatar.replace('@/assets/imgs/', '')
                    u.avatar = new URL(`../assets/imgs/${file}`, import.meta.url).href
                }
            })
        }

        // 解析菜品图片
        if (Array.isArray(dataToStore.foods)) {
            dataToStore.foods.forEach(f => {
                if (f && typeof f.img === 'string' && f.img.startsWith('@/assets/imgs/')) {
                    const file = f.img.replace('@/assets/imgs/', '')
                    f.img = new URL(`../assets/imgs/${file}`, import.meta.url).href
                }
            })
        }

        localStorage.setItem('canteen-mock-data', JSON.stringify(dataToStore))
    }
}

function getMockData() {
    const stored = localStorage.getItem('canteen-mock-data')
    return stored ? JSON.parse(stored) : mockData
}

function saveMockData(data) {
    localStorage.setItem('canteen-mock-data', JSON.stringify(data))
}

// 分页处理函数
function paginate(items, pageNum = 1, pageSize = 10) {
    pageNum = parseInt(pageNum) || 1
    pageSize = parseInt(pageSize) || 10
    const start = (pageNum - 1) * pageSize
    const end = start + pageSize
    return {
        list: items.slice(start, end),
        total: items.length
    }
}

// 模拟请求对象
const request = {
    // POST 请求
    post(url, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockDb = getMockData()

                if (url === '/login') {
                    const user = mockDb.users.find(u => u.username === data.username && u.password === data.password)
                    if (user) {
                        const userData = { ...user }
                        delete userData.password
                        resolve({ code: '200', data: userData, msg: '登录成功' })
                    } else {
                        resolve({ code: '400', msg: '用户名或密码错误' })
                    }
                }
                else if (url === '/register') {
                    const exists = mockDb.users.find(u => u.username === data.username)
                    if (exists) {
                        resolve({ code: '400', msg: '用户名已存在' })
                    } else {
                        const newUser = {
                            id: Math.max(...mockDb.users.map(u => u.id), 0) + 1,
                            username: data.username,
                            password: data.password,
                            name: data.username,
                            role: data.role || 'USER',
                            avatar: new URL('../assets/imgs/avatar.png', import.meta.url).href,
                            sex: '未设置',
                            phone: '',
                            account: 0
                        }
                        mockDb.users.push(newUser)
                        saveMockData(mockDb)
                        delete newUser.password
                        resolve({ code: '200', data: newUser, msg: '注册成功' })
                    }
                }
                else if (url === '/updateProfile' || url === '/user/update' || url === '/admin/update') {
                    const userIndex = mockDb.users.findIndex(u => u.id === data.id)
                    if (userIndex !== -1) {
                        const oldPassword = mockDb.users[userIndex].password
                        const oldAccount = mockDb.users[userIndex].account // 保存原有余额

                        // 更新用户信息
                        const updateData = { ...data }

                        // 如果是个人资料更新（/updateProfile），不允许更新余额
                        // 如果是管理员更新用户信息（/user/update），允许更新余额（用于充值）
                        if (url === '/updateProfile') {
                            delete updateData.account // 个人资料更新时，移除 account 字段
                        }
                        // 对于 /user/update 和 /admin/update，允许更新 account 字段（管理员操作）

                        mockDb.users[userIndex] = { ...mockDb.users[userIndex], ...updateData }

                        // 如果是个人资料更新，恢复原有余额
                        if (url === '/updateProfile') {
                            mockDb.users[userIndex].account = oldAccount
                        }

                        if (!data.password) {
                            mockDb.users[userIndex].password = oldPassword
                        }
                        saveMockData(mockDb)
                        const updated = { ...mockDb.users[userIndex] }
                        delete updated.password
                        resolve({ code: '200', data: updated, msg: '更新成功' })
                    } else {
                        resolve({ code: '400', msg: '用户不存在' })
                    }
                }
                else if (url === '/orders/add') {
                    const user = mockDb.users.find(u => u.id === data.userId)
                    if (!user) {
                        resolve({ code: '400', msg: '用户不存在' })
                        return
                    }

                    // 下单时不检查余额，也不扣除余额，等结算时再检查和扣除

                    const newOrder = {
                        id: Math.max(...mockDb.orders.map(o => o.id), 0) + 1,
                        tableId: data.tableId,
                        userId: data.userId,
                        userName: user.name,
                        foods: data.foods || [],
                        content: data.content,
                        totalPrice: data.total,
                        total: data.total,
                        orderNo: 'ORD' + String(Math.max(...mockDb.orders.map(o => parseInt(o.orderNo?.substring(3) || 0)), 0) + 1).padStart(3, '0'),
                        status: data.status || '待出餐',
                        createTime: new Date().toLocaleString(),
                        servingTime: '',
                        settleTime: ''
                    }
                    mockDb.orders.push(newOrder)

                    // 不在这里退桌，等结算时再退

                    saveMockData(mockDb)
                    resolve({ code: '200', data: newOrder, msg: '下单成功，请等待出餐' })
                }
                else if (url === '/orders/settle') {
                    // 结算订单：检查余额、扣除余额、退桌、更新订单状态
                    const order = mockDb.orders.find(o => o.id === data.id)
                    if (!order) {
                        resolve({ code: '400', msg: '订单不存在' })
                        return
                    }

                    const user = mockDb.users.find(u => u.id === order.userId)
                    if (!user) {
                        resolve({ code: '400', msg: '用户不存在' })
                        return
                    }

                    // 检查余额是否足够
                    if (user.account < order.total) {
                        resolve({ code: '400', msg: '余额不足，当前余额：￥' + user.account.toFixed(2) + '，订单金额：￥' + order.total.toFixed(2) + '，请先充值' })
                        return
                    }

                    // 扣除余额
                    user.account -= order.total

                    // 更新订单状态
                    order.status = data.status || '已完成'
                    order.settleTime = new Date().toLocaleString()

                    // 退桌 - 确保tableId是数字类型进行比较
                    const tableIndex = mockDb.tables.findIndex(t => t.id === parseInt(order.tableId))
                    if (tableIndex !== -1) {
                        mockDb.tables[tableIndex].userId = null
                        mockDb.tables[tableIndex].free = '是'
                        mockDb.tables[tableIndex].userName = ''
                    }

                    saveMockData(mockDb)
                    resolve({ code: '200', data: order, msg: '结算成功' })
                }
                else if (url === '/orders/update' || url === '/tables/update' || url === '/foods/update') {
                    let collection = url.includes('orders') ? mockDb.orders : url.includes('tables') ? mockDb.tables : mockDb.foods
                    const index = collection.findIndex(o => o.id === data.id)
                    if (index !== -1) {
                        // 如果是订单更新且状态改为"待结算"，自动记录出餐时间
                        if (url === '/orders/update' && data.status === '待结算' && !data.servingTime) {
                            data.servingTime = new Date().toLocaleString()
                        }
                        collection[index] = { ...collection[index], ...data }
                        saveMockData(mockDb)
                        resolve({ code: '200', data: collection[index], msg: '更新成功' })
                    } else {
                        resolve({ code: '400', msg: '数据不存在' })
                    }
                }
                else if (url === '/foods/add') {
                    const newFood = {
                        id: Math.max(...mockDb.foods.map(f => f.id), 0) + 1,
                        ...data,
                        img: data.img || new URL('../assets/imgs/food-placeholder.svg', import.meta.url).href
                    }
                    mockDb.foods.push(newFood)
                    saveMockData(mockDb)
                    resolve({ code: '200', data: newFood, msg: '菜品添加成功' })
                }
                else if (url === '/tables/add') {
                    const newTable = {
                        id: Math.max(...mockDb.tables.map(t => t.id), 0) + 1,
                        no: data.no || data.number,
                        number: data.no || data.number,
                        ...data,
                        free: data.free || '是',
                        userName: data.userName || '',
                        userId: data.userId || null
                    }
                    mockDb.tables.push(newTable)
                    saveMockData(mockDb)
                    resolve({ code: '200', data: newTable, msg: '餐桌添加成功' })
                }
                else if (url === '/tables/addOrder') {
                    // 选择餐桌开始点餐：更新餐桌的 userId 和状态
                    const tableIndex = mockDb.tables.findIndex(t => t.id === data.id)
                    if (tableIndex === -1) {
                        resolve({ code: '400', msg: '餐桌不存在' })
                        return
                    }

                    const table = mockDb.tables[tableIndex]
                    if (table.free !== '是') {
                        resolve({ code: '400', msg: '该餐桌已被占用' })
                        return
                    }

                    // 先释放该用户之前占用的餐桌（如果有）
                    const userPreviousTable = mockDb.tables.find(t => t.userId === data.userId)
                    if (userPreviousTable) {
                        userPreviousTable.userId = null
                        userPreviousTable.free = '是'
                        userPreviousTable.userName = ''
                    }

                    // 更新当前餐桌
                    const user = mockDb.users.find(u => u.id === data.userId)
                    table.userId = data.userId
                    table.free = '否'
                    table.userName = user ? user.name : ''

                    saveMockData(mockDb)
                    resolve({ code: '200', data: table, msg: '选择餐桌成功' })
                }
                else if (url === '/tables/removeOrder') {
                    // 退桌：释放餐桌
                    const tableIndex = mockDb.tables.findIndex(t => t.id === data.id)
                    if (tableIndex === -1) {
                        resolve({ code: '400', msg: '餐桌不存在' })
                        return
                    }

                    const table = mockDb.tables[tableIndex]
                    table.userId = null
                    table.free = '是'
                    table.userName = ''

                    saveMockData(mockDb)
                    resolve({ code: '200', data: table, msg: '退桌成功' })
                }
                else if (url === '/user/add' || url === '/admin/add') {
                    const newUser = {
                        id: Math.max(...mockDb.users.map(u => u.id), 0) + 1,
                        username: data.username,
                        password: data.password || '123456',
                        name: data.name,
                        role: url === '/admin/add' ? 'ADMIN' : 'USER',
                        avatar: data.avatar || new URL('../assets/imgs/avatar.png', import.meta.url).href,
                        sex: data.sex || '男',
                        phone: data.phone || '',
                        account: data.account || 0
                    }
                    mockDb.users.push(newUser)
                    saveMockData(mockDb)
                    const responseData = { ...newUser }
                    delete responseData.password
                    resolve({ code: '200', data: responseData, msg: '用户添加成功' })
                }
                else {
                    resolve({ code: '200', msg: '操作成功' })
                }
            }, 300)
        })
    },

    // GET 请求
    get(url, config = {}) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockDb = getMockData()
                const params = config.params || {}

                if (url === '/foods/selectAll') {
                    resolve({ code: '200', data: mockDb.foods })
                }
                else if (url === '/foods/selectPage') {
                    let items = mockDb.foods
                    if (params.name) {
                        items = items.filter(f => f.name.includes(params.name))
                    }
                    const result = paginate(items, params.pageNum, params.pageSize)
                    resolve({ code: '200', data: result })
                }
                else if (url === '/tables/selectAll') {
                    resolve({ code: '200', data: mockDb.tables })
                }
                else if (url === '/tables/selectPage') {
                    let items = mockDb.tables
                    if (params.no) {
                        items = items.filter(t => t.no.includes(params.no))
                    }
                    const result = paginate(items, params.pageNum, params.pageSize)
                    resolve({ code: '200', data: result })
                }
                else if (url.startsWith('/tables/selectByUserId/')) {
                    const userId = parseInt(url.split('/').pop())
                    const table = mockDb.tables.find(t => t.userId === userId)
                    resolve({ code: '200', data: table || {} })
                }
                else if (url === '/orders/selectPage') {
                    let items = mockDb.orders
                    if (params.userName) {
                        items = items.filter(o => o.userName.includes(params.userName))
                    }
                    if (params.userId) {
                        items = items.filter(o => o.userId === params.userId)
                    }
                    const result = paginate(items, params.pageNum, params.pageSize)
                    resolve({ code: '200', data: result })
                }
                else if (url === '/getOrders') {
                    resolve({ code: '200', data: mockDb.orders })
                }
                else if (url === '/user/selectPage') {
                    let items = mockDb.users.filter(u => u.role === 'USER')
                    if (params.name) {
                        items = items.filter(u => u.name.includes(params.name))
                    }
                    const result = paginate(items, params.pageNum, params.pageSize)
                    resolve({ code: '200', data: result })
                }
                else if (url === '/admin/selectPage') {
                    let items = mockDb.users.filter(u => u.role === 'ADMIN')
                    if (params.name) {
                        items = items.filter(u => u.name.includes(params.name))
                    }
                    const result = paginate(items, params.pageNum, params.pageSize)
                    resolve({ code: '200', data: result })
                }
                else if (url.startsWith('/user/selectById/') || url.startsWith('/admin/selectById/')) {
                    const userId = parseInt(url.split('/').pop())
                    const user = mockDb.users.find(u => u.id === userId)
                    if (user) {
                        const userData = { ...user }
                        delete userData.password
                        resolve({ code: '200', data: userData })
                    } else {
                        resolve({ code: '400', msg: '用户不存在' })
                    }
                }
                else {
                    resolve({ code: '200', data: [] })
                }
            }, 300)
        })
    },

    // DELETE 请求
    delete(url) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockDb = getMockData()

                if (url.startsWith('/foods/delete/')) {
                    const id = parseInt(url.split('/').pop())
                    mockDb.foods = mockDb.foods.filter(f => f.id !== id)
                    saveMockData(mockDb)
                    resolve({ code: '200', msg: '菜品删除成功' })
                }
                else if (url.startsWith('/tables/delete/')) {
                    const id = parseInt(url.split('/').pop())
                    mockDb.tables = mockDb.tables.filter(t => t.id !== id)
                    saveMockData(mockDb)
                    resolve({ code: '200', msg: '餐桌删除成功' })
                }
                else if (url.startsWith('/orders/delete/')) {
                    const id = parseInt(url.split('/').pop())
                    mockDb.orders = mockDb.orders.filter(o => o.id !== id)
                    saveMockData(mockDb)
                    resolve({ code: '200', msg: '订单删除成功' })
                }
                else if (url.startsWith('/user/delete/')) {
                    const id = parseInt(url.split('/').pop())
                    mockDb.users = mockDb.users.filter(u => u.id !== id)
                    saveMockData(mockDb)
                    resolve({ code: '200', msg: '用户删除成功' })
                }
                else if (url.startsWith('/admin/delete/')) {
                    const id = parseInt(url.split('/').pop())
                    mockDb.users = mockDb.users.filter(u => u.id !== id)
                    saveMockData(mockDb)
                    resolve({ code: '200', msg: '用户删除成功' })
                }
                else {
                    resolve({ code: '200', msg: '删除成功' })
                }
            }, 300)
        })
    },

    // 通用 request 方法
    request(config) {
        const method = (config.method || 'GET').toUpperCase()
        const url = config.url
        const data = config.data

        if (method === 'GET') {
            return this.get(url, { params: data })
        } else if (method === 'POST') {
            return this.post(url, data)
        } else if (method === 'PUT') {
            return this.post(url, data) // 在模拟中 PUT 和 POST 处理方式相同
        } else if (method === 'DELETE') {
            return this.delete(url)
        }
    }
}

// 初始化数据
initMockData()

// 兼容旧 localStorage：如果本地数据中仍然存在 '@/assets/imgs/...' 字符串，则将其解析为绝对 URL（只在需要时更新）
function migrateAssetPaths() {
    const stored = localStorage.getItem('canteen-mock-data')
    if (!stored) return
    let db
    try {
        db = JSON.parse(stored)
    } catch (e) {
        return
    }
    let changed = false

    if (Array.isArray(db.users)) {
        db.users.forEach(u => {
            if (u && typeof u.avatar === 'string' && u.avatar.startsWith('@/assets/imgs/')) {
                const file = u.avatar.replace('@/assets/imgs/', '')
                u.avatar = new URL(`../assets/imgs/${file}`, import.meta.url).href
                changed = true
            }
        })
    }

    if (Array.isArray(db.foods)) {
        db.foods.forEach(f => {
            if (f && typeof f.img === 'string' && f.img.startsWith('@/assets/imgs/')) {
                const file = f.img.replace('@/assets/imgs/', '')
                f.img = new URL(`../assets/imgs/${file}`, import.meta.url).href
                changed = true
            }
        })
    }

    if (changed) {
        localStorage.setItem('canteen-mock-data', JSON.stringify(db))
    }
}

migrateAssetPaths()

export default request
