import path from 'path'

// 返回所有子路由
const getChildrenRoutes = (routes) => {
  const result = []
  routes.forEach((route) => {
    if (route.children && route.children.length) {
      result.push(...route.children)
    }
  })
  return result
}

// 某个路由为其他子路由时，剔除该一级路由
export const filterRouters = (routes) => {
  const childrenRoutes = getChildrenRoutes(routes)
  return routes.filter((route) => {
    return !childrenRoutes.find((childrenRoute) => {
      return childrenRoute.path === route.path
    })
  })
}

// 判断数据是否为空值
const isNull = (data) => {
  if (!data) return true
  if (JSON.stringify(data) === '{}') return true
  if (JSON.stringify(data) === '[]') return true
  return false
}

// 根据 routes 数据，返回对应 menu 规则数组
export const generateMenus = (routes, basePath = '') => {
  const result = []
  console.log('routes = ', routes)

  routes.forEach((item) => {
    console.log('item = ', item)
    if (isNull(item.meta) && isNull(item.children)) return
    if (isNull(item.meta) && !isNull(item.children)) {
      result.push(...generateMenus(item.children))
      return
    }

    const routePath = path.resolve(basePath, item.path)
    console.log('routePath = ', routePath)

    let route = result.find((item) => {
      return item.path === routePath
    })
    if (!route) {
      route = {
        ...item,
        path: routePath,
        children: []
      }
    }

    if (route.meta.icon && route.meta.title) {
      result.push(route)
    }

    if (item.children) {
      route.children.push(...generateMenus(item.children, route.path))
    }
  })
  return result
}
