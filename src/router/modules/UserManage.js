import layout from '@/layout'

export default {
  path: '/user',
  component: layout,
  redirect: '/user/manage',
  name: 'userManage',
  meta: {
    title: '用户',
    icon: 'personnel'
  },
  children: [
    {
      path: '/user/manage',
      component: () => import('@/views/user-manage/index'),
      meta: {
        title: '员工管理',
        icon: 'personnel-manage'
      }
    },
    {
      path: '/user/info/:id',
      name: 'userInfo',
      component: () => import('@/views/user-info/index'),
      props: true,
      meta: {
        title: '用户信息'
      }
    },
    {
      path: '/user/import',
      name: 'import',
      component: () => import('@/views/import/index'),
      meta: {
        title: 'excel导入'
      }
    }
  ]
}
