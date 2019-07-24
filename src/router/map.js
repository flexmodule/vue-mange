//首页

const Meetingbook = r => require.ensure([], () => r(require('@/views/meetingbook.vue')))
const Booksubmit = r => require.ensure([], () => r(require('@/views/booksubmit.vue')))
const Mybooking = r => require.ensure([], () => r(require('@/views/mybooking.vue')))
const routes = [
	{
		path: '/',
		name: 'Meetingbook',
		component: Meetingbook
	},
	{
		path: '/booksubmit',
		name: 'booksubmit',
		component:Booksubmit
	},
	{
		path: '/mybooking',
		name: 'mybooking',
		component:Mybooking
	}
]

export default routes
