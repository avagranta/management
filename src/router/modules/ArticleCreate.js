import layout from '@/layout'

export default {
  path: '/article',
  component: layout,
  redirect: '/article/ranking',
  name: 'articleCreate',
  meta: { title: '文章', icon: 'article' },
  children: [
    {
      path: '/article/create',
      component: () =>
        import(
          /* webpackChunkName: "article-create" */ '@/views/article-create/index'
        ),
      meta: {
        title: '创建文章',
        icon: 'article-create'
      }
    },
    {
      path: '/article/editor/:id',
      component: () =>
        import(
          /* webpackChunkName: "article-create" */ '@/views/article-create/index'
        ),
      meta: {
        title: '编辑文章'
      }
    }
  ]
}
