import layout from '@/layout'

export default {
  path: '/article',
  component: layout,
  redirect: '/article/ranking',
  name: 'articleRanking',
  meta: { title: '文章', icon: 'article' },
  children: [
    {
      path: '/article/ranking',
      component: () => import('@/views/article-ranking/index'),
      meta: {
        title: '文章排名',
        icon: 'article-ranking'
      }
    },
    {
      path: '/article/:id',
      component: () => import('@/views/article-detail/index'),
      meta: {
        title: '文章详情'
      }
    }
  ]
}
