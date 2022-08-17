import layout from '@/layout'

export default {
  path: '/user',
  component: layout,
  redirect: '/user/manage',
  name: 'roleList',
  meta: {
    title: '用户',
    icon: 'personnel'
  },
  children: [
    {
      path: '/user/role',
      component: () => import('@/views/role-list/index'),
      meta: {
        title: '角色列表',
        icon: 'role'
      }
    }
  ]
}
