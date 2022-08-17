import layout from '@/layout'

export default {
  path: '/user',
  component: layout,
  redirect: '/user/manage',
  name: 'permissionList',
  meta: {
    title: '用户',
    icon: 'personnel'
  },
  children: [
    {
      path: '/user/permission',
      component: () => import('@/views/permission-list/index'),
      meta: {
        title: '权限列表',
        icon: 'permission'
      }
    }
  ]
}
