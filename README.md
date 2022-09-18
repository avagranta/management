# 一、后台管理系统

## 1. 项目搭建

### ① ESLint + Prettier 代码规范

在`.eslintrc.js`文件中配置eslint

在`.prettierrc.js`文件中配置prettier

### ② Commitizen + hussky 提交 git 规范

`git cz`提供快捷提交语句

`husky`检测提交规范

## 2. 用户登录模块

创建`api`文件夹，在`sys.js`中封装 `login`请求。

创建 `store` 的`user`模块，在`action`中调用请求，并将密码用`MD5`加密处理，发送到服务器。

得到服务器返回的 `token`后，将其分别保存在 `vuex`和 `localStorage`中，前者是为了后续方便在其他地方使用，后者是为了方便实现自动登录。

**登录鉴权**：

- 当用户未登录时，只允许进入 `login`页面
- 用户登录后，token未过期或未退出登录时，不允许进入 `login`页面

**实现**：

将 `login`路由添加进白名单，在路由前置守卫中，如果存在有效 `token` 则能正常访问页面，否则只可以进入白名单中的路由。

**获取数据**

添加请求拦截器，给请求头部增加 `token`

```js
import store from '@/store'
// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在这个位置需要统一的去注入token
    if (store.getters.token) {
      // 如果token存在 注入token
      config.headers.Authorization = `Bearer ${store.getters.token}`
    }
    return config // 必须返回配置
  },
  error => {
    return Promise.reject(error)
  }
)
```

在进入主页前，检查有无用户信息，如果没有则发送请求获取用户信息，保存到`vuex`中

**用户退出**

- 清除当前用户数据
- 清理权限相关配置
- 返回到登录页

添加响应拦截器，如果返回状态码 `401`则触发登出操作



## 3. 动态 menu 方案

#### ① 制定 **menu 菜单结构规则**：

对于单个路由而言，如果拥有 `meta`属性并且 `meta.title && meta.icon`那么判定为要显示在 menu 菜单中，接着看是否有 `children`属性，如果有则为 `el-sub-menu`子菜单，没有则为`menu-item`菜单项

- `meta` && `meta.title` && `meta.icon`
  - `children`
    - `el-sub-menu`
  - !`children`
    - `menu-item`

- `!meta`
  - 不展示

#### ② 获取路由表

通过 `router.getRoutes`获取到完整的路由表，但是获得的路由表与理想的结构不同，需要处理两个问题

1. 存在重复的路由数据，通过 `getRoutes`获得的路由表中，子路由会重复出现在一级路由中
2. 删除不存在 `meta`属性的项
3. 父路由相同的子路由，会产生多个

#### ③ 处理路由数据

1. 剔除重复数据

遍历路由表，得到所有的子路由。再把没有出现在子路由数据中的路由过滤出来，就能得到正确的一级路由

2. 处理结构

遍历路由表，如果`!children && !meta`则跳过不加入 `res`；

`children && !meta`则将其 `children`迭代的结果加入 `res`；

`!children && meta || children && meta` 将其规则化后，推入 `res`结果中，这里要注意处理父路由重复的问题，如果`res`数组中已存在该路由，则不推入，继续递归处理路由的子节点





## 4. 动态面包屑

### ① 获取路由数据

通过 `route.match`获取当前匹配的路由数组，再过滤掉没有 `meta.title`的数据

### ② 监听路由变化

路由变化时，触发获取数据函数，渲染面包屑



## 5. tagsView

### ① 监听路由变化，取得数据源

对于有 `meta`属性的路由，直接取 `title`作为标签名；对于无 `meta`属性的路由， 通过 	`route.path.split('/')`获得路由。

通过 `watch` 监听路由的变化，当路由变化时，将新路由添加入 `vuex`中的 tagLiIst

```js
/**
 * 生成 title
 */
const getTitle = route => {
  let title = ''
  if (!route.meta) {
    // 处理无 meta 的路由
    const pathArr = route.path.split('/')
    title = pathArr[pathArr.length - 1]
  } else {
    title = generateTitle(route.meta.title)
  }
  return title
}
```

```js
/**
 * 监听路由变化
 */
const store = useStore()
watch(
  route,
  (to, from) => {
    if (!isTags(to.path)) return
    const { fullPath, meta, name, params, path, query } = to
    store.commit('app/addTagsViewList', {
      fullPath,
      meta,
      name,
      params,
      path,
      query,
      title: getTitle(to)
    })
  },
  {
    immediate: true
  }
)
```



### ② 根据数据源渲染 `tags`

```vue
<router-link
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        :style="{
          backgroundColor: isActive(tag) ? $store.getters.cssVar.menuBg : '',
          borderColor: isActive(tag) ? $store.getters.cssVar.menuBg : ''
        }"
        v-for="(tag, index) in $store.getters.tagsViewList"
        :key="tag.fullPath"
        :to="{ path: tag.fullPath }"
      >
        {{ tag.title }}
        <i
          v-show="!isActive(tag)"
          class="el-icon-close"
          @click.prevent.stop="onCloseClick(index)"
        />
      </router-link>
```

### ③ 右键菜单

传入右键事件，获取 `x` 和 `y` 的坐标并显示右键菜单，用于定位菜单位置

```js
// 展示menu
const openMenu = (e, index) => {
  const { x, y } = e
  menuStyle.left = x + 'px'
  menuStyle.top = y + 'px'
  selectIndex.value = index
  visible.value = true
}
```

刷新

```js
const router = useRouter()
const onRefreshClick = () => {
  router.go(0)
}
```

### 

## 6. excel 导入

首先，读取数据这一事件是一个异步事件，所以需要包裹在 `Promise`中，

通过 `fileReader`读取文件 `reader.readAsArrayBuffer`，在 `reader`读取完时，也就是 它的`onload`中开始解析数据，利用 `xlsx`解析数据 得到工作簿`workbook = XLSX.read`，读取第一张工作表的数据 `worksheet = workbook.Sheets[firstSheetName]`，解析数据体 `results = XLSX.utils.sheet_to_json(worksheet)` ，此时获得的数据中，每项的键名为中文，要符合接口的要求，要将中文映射为对应的英文字段，最后将所得数据通过接口发送给服务器。

对于数据表头，

```js
// 触发事件
const handleChange = (e) => {
  const files = e.target.files
  const rawFile = files[0] // only use files[0]
  if (!rawFile) return
  upload(rawFile)
}
/**
 * 读取数据（异步）
 */
const readerData = (rawFile) => {
  loading.value = true
  return new Promise((resolve, reject) => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader
    const reader = new FileReader()
    // 该事件在读取操作完成时触发
    // https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader/onload
    reader.onload = (e) => {
      // 1. 获取解析到的数据
      const data = e.target.result
      // 2. 利用 XLSX 对数据进行解析
      const workbook = XLSX.read(data, { type: 'array' })
      // 3. 获取第一张表格(工作簿)名称
      const firstSheetName = workbook.SheetNames[0]
      // 4. 只读取 Sheet1（第一张表格）的数据
      const worksheet = workbook.Sheets[firstSheetName]
      // 5. 解析数据表头
      const header = getHeaderRow(worksheet)
      // 6. 解析数据体
      const results = XLSX.utils.sheet_to_json(worksheet)
      // 7. 传入解析之后的数据
      generateData({ header, results })
      // 8. loading 处理
      loading.value = false
      // 9. 异步完成
      resolve()
    }
    // 启动读取指定的 Blob 或 File 内容
    reader.readAsArrayBuffer(rawFile)
  })
}
```

```js
import XLSX from 'xlsx'
/**
 * 获取表头（通用方式）
 */
export const getHeaderRow = sheet => {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}
```

```js
/**
 * 将中文 key 转换为英文
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

/**
 * 导入数据对应表
 */
export const USER_RELATIONS = {
  姓名: 'username',
  联系方式: 'mobile',
  角色: 'role',
  开通时间: 'openTime'
}
```



## 7. excel 导出

**核心思路**：将 `json`结构数据转换为 `excel`数据并下载

**数据转换**：返回的数据为一个二维数组，分别代表行和列。对于 `excel`表格来说，确定每个单元格 `cell`所需要的数据是类型和值，所以对返回的数组进行遍历，确定数据的类型和值，再通过行号和列号，使用 `xlsx`的 `encode_cell`函数取得对应单元格的指针，将数据赋值给它，完成数据的转换。

**写入数据**：创建工作簿和工作表，利用 `xlsx`写入 `excel`数据

```js
// 9. 添加工作表（解析后的 excel 数据）到工作簿
  wb.SheetNames.push(ws_name)
  wb.Sheets[ws_name] = ws
  // 10. 写入数据
  var wbout = XLSX.write(wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  })
```

**下载数据**：

```js
// 11. 下载数据 使用file-save的 saveAs 函数
  saveAs(
    new Blob([s2ab(wbout)], {
      type: 'application/octet-stream'
    }),
    `${filename}.${bookType}`
  )

function s2ab(s) {
  var buf = new ArrayBuffer(s.length)
  var view = new Uint8Array(buf)
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
  return buf
}
```



## 8. 权限控制

### ① 权限体系

用户分配角色，角色拥有对应的，权限控制可操控的菜单和按钮

### ② 权限控制

**页面权限控制**：根据不同的权限数据，生成不同的私有路由表。

1. 为每个权限路由指定一个 `name`，每个 `name` 对应一个 **页面权限**
2. 通过 `name` 与 **页面权限** 匹配的方式筛选出对应的权限路由

登录时，在获取用户数据后。根据权限数据利用 `addRoute`将有权限的路由添加到路由表中，在退出登录时，根据权限数据利用 `removeRoute`从路由表中删除。

```json
后端数据：
{
    "menus": [
        "userManage",
        "roleList",
        "permissionList",
        "articleRanking",
        "articleCreate"
    ],
    "points": [
        "distributeRole",
        "importUser",
        "removeUser",
        "distributePermission"
    ]
}
```



```js
    /**
     * 根据权限筛选路由
     */
    filterRoutes(context, menus) {
      const routes = []
      // 路由权限匹配
      menus.forEach(key => {
        // 权限名 与 路由的 name 匹配
        routes.push(...privateRoutes.filter(item => item.name === key))
      })
      // 最后添加 不匹配路由进入 404
      routes.push({
        path: '/:catchAll(.*)',
        redirect: '/404'
      })
      context.commit('setRoutes', routes)
      return routes
    }

```

```js
// 判断用户资料是否获取
      // 若不存在用户信息，则需要获取用户信息
      if (!store.getters.hasUserInfo) {
        // 触发获取用户信息的 action，并获取用户当前权限
        const { permission } = await store.dispatch('user/getUserInfo')
        // 处理用户权限，筛选出需要添加的权限
        const filterRoutes = await store.dispatch(
          'permission/filterRoutes',
          permission.menus
        )
        // 利用 addRoute 循环添加
        filterRoutes.forEach(item => {
          router.addRoute(item)
        })
        // 添加完动态路由之后，需要在进行一次主动跳转
        return next(to.path)
      }
      next()

```

**功能权限控制**：根据不同的权限数据，展示不同的功能按钮

利用自定义指令，控制按钮的隐藏

```js
import store from '@/store'

function checkPermission(el, binding) {
  // 获取绑定的值，此处为权限
  const { value } = binding
  // 获取所有的功能指令
  const points = store.getters.userInfo.permission.points
  // 当传入的指令集为数组时
  if (value && value instanceof Array) {
    // 匹配对应的指令
    const hasPermission = points.some(point => {
      return value.includes(point)
    })
    // 如果无法匹配，则表示当前用户无该指令，那么删除对应的功能按钮
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    // eslint-disabled-next-line
    throw new Error('v-permission value is ["admin","editor"]')
  }
}

export default {
  // 在绑定元素的父组件被挂载后调用
  mounted(el, binding) {
    checkPermission(el, binding)
  },
  // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
  update(el, binding) {
    checkPermission(el, binding)
  }
}


```



## 9. 动态换肤

**实现思路**：在 `scss` 中，我们可以通过 `$变量名:变量值` 的方式定义 `css 变量`，然后通过该 `css 变量` 来去指定某一块 `DOM` 对应的颜色。

**非 `element-plus`主题**

通过绑定 `css`变量控制背景色和字体色

**`element-plus`主题**:

**实现思路:**

1. 获取当前 `element-plus` 的所有样式
2. 找到我们想要替换的样式部分，通过正则完成替换
3. 把替换后的样式写入到 `style` 标签中，利用样式优先级的特性，替代固有样式





## * 完整的登录流程

- 进入页面前，通过路由前置守卫检查是否存在`token`，
  - 没有，只允许进入白名单列表中的路由或者跳到登录页面
  - 有，再检查有无用户信息
    - 有，正常进入
    - 没有，获取用户信息和用户权限，根据权限列表，将私有路由表中 `name`和权限列表匹配的通过 `addRoute`添加到路由中