//首页
const MainPage = r => require.ensure([], () => r(require('@/views/')))
const HomePage = r => require.ensure([], () => r(require('@/views/home')))
//登录页面
const LoginPage = r => require.ensure([], () => r(require('@/views/user/login')))
/* 基础数据 start */  
const StandardData = r => require.ensure([], () => r(require('@/views/standard-data')))
  //医院管理
  const HospitalManage = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/')))
  //新增编辑医院
  const AddHospital = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/add-hospital')))
  //禁用医院
  const DisabledHospital = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/disabled-hospital')))
  //医院详情
  const HospitalDetail = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/hospital-detail')))
  //医院内体检套餐
  const MedicalPackages = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/medical-package')))
  //新增编辑套餐
  const AddPackage = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/add-package')))
  //禁用套餐
  const DisabledPackage = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/disabled-package')))
  //医院内检查项目
  const CheckItems = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/check-items')))
  //新增编辑检查项目
  const AddCheckItems = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/add-check-items')))
  //医院特色
  const HospitalFeature = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/hospital-feature')))
  //健管服务
  const HealthManage = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/health-manage')))
  //专家团队
  const ExpertTeam = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/expert-team')))
  //医院端管理账号设置
  const HosManage = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/hos-manage')))
    //医院端管理账号设置
    const selectFlow = r => require.ensure([], () => r(require('@/views/standard-data/hospital-manage/select-flow')))
  //医院内检查项目管理 
  const CheckManage = r => require.ensure([], () => r(require('@/views/standard-data/check-manage/')))
  //新增编辑检查项目
  const AddCategory = r => require.ensure([], () => r(require('@/views/standard-data/check-manage/add-category')))
  //类目维护
  const MaintainCategory = r => require.ensure([], () => r(require('@/views/standard-data/check-manage/maintain-category')))

  //城市管理 
  const CityManage = r => require.ensure([], () => r(require('@/views/standard-data/city-manage/')))

  //体检特征套餐库 
  const PackageCharacter = r => require.ensure([], () => r(require('@/views/standard-data/package-character')))
  const PackageCharacterEdit = r => require.ensure([], () => r(require('@/views/standard-data/package-character/edit/')))

  //自助手册管理
  const IndependentManual = r => require.ensure([], () => r(require('@/views/standard-data/independent-manual')))
/* 基础数据 end */


/* 专业运营 start */
const StandardBussinessData = r => require.ensure([], () => r(require('@/views/standard-bussiness')))
  //个检预约管理
  const personCheck = r => require.ensure([], () => r(require('@/views/standard-bussiness/physical-appointment-manage/person-check')))
  //个检预约管理
  const groupCheck = r => require.ensure([], () => r(require('@/views/standard-bussiness/physical-appointment-manage/group-check')))
  //详情
  const bookingDetails = r => require.ensure([], () => r(require('@/views/standard-bussiness/physical-appointment-manage/detail')))
  
  // 推荐套餐管理
  const MealRecomend = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-recomend')))
  //专区管理
  const SpeRegionManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/spe-region-manage')))
  //编辑专区
  const SpeRegionEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/spe-region-manage/spe-region-edit')))
  //新增套餐推荐
  const MealRecomendAdd = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-recomend/add-meal')))
  //编辑套餐推荐
  const MealRecomendEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-recomend/edit-meal')))
  //套餐促销
  const MealPromot = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-promot')))
  //新增套餐促销
  const MealPromotAdd = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-promot/add-meal')))
  //编辑套餐促销
  const MealPromotEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/meal-promot/edit-meal')))
  //热门标签
  const HotLabel = r => require.ensure([], () => r(require('@/views/standard-bussiness/recomend-meal-manage/hot-label')))
//团检咨询
const TeamConsult = r => require.ensure([], () => r(require('@/views/standard-bussiness/team-consult')))
  //热门
  //医院热搜
  const HosHot = r => require.ensure([], () => r(require('@/views/standard-bussiness/hot/hot-search/hos-hot-search')))
  //套餐热搜
  const MealHot = r => require.ensure([], () => r(require('@/views/standard-bussiness/hot/hot-search/meal-hot-search')))
  //热门城市
  const HotCity = r => require.ensure([], () => r(require('@/views/standard-bussiness/hot/hot-city')))
  //新增热门城市
  const AddCity = r => require.ensure([], () => r(require('@/views/standard-bussiness/hot/hot-city/add-city')))

  //精选医院管理
  const ChosenHosManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/chosen-hos-manage')))

  //订单管理
  //const OrderManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/order-manage')))
  //个检订单管理
  const personOrder = r => require.ensure([], () => r(require('@/views/standard-bussiness/order-manage/person-order')))
  //团检订单管理
  const groupOrder = r => require.ensure([], () => r(require('@/views/standard-bussiness/order-manage/group-order')))
  //订单详情
  const OrderDetail = r => require.ensure([], () => r(require('@/views/standard-bussiness/order-manage/order-detail')))
  //订单预约详情
  const AppointmentDetail = r => require.ensure([], () => r(require('@/views/standard-bussiness/order-manage/order-detail/appointment-detail')))
  
  //用户信息
  const UserMessage = r => require.ensure([], () => r(require('@/views/standard-bussiness/user-message')))
  //用户详情
  const UserDetail = r => require.ensure([], () => r(require('@/views/standard-bussiness/user-message/detail')))
  //用户编辑
  const UserEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/user-message/edit')))

  //首页专家配置
  const IndexExpert = r => require.ensure([], () => r(require('@/views/standard-bussiness/app-index/expert')))
  //新增专家
  const ExpertAdd = r => require.ensure([], () => r(require('@/views/standard-bussiness/app-index/expert/add')))
  //编辑专家
  const ExpertEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/app-index/expert/edit')))

  
  //内容管理
  const ContentManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/famous-doctor')))
  //新增名医说
  const AddFamous = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/famous-doctor/add')))
  //编辑名医说
  const EditFamous = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/famous-doctor/edit')))
  //咨询管理
  const InfoManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/info-manage')))
  //新增咨询
  const InfoManageAdd = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/info-manage/add')))
  //编辑咨询
  const InfoManageEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/info-manage/edit')))
  //每日精选
  const DayChosen = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/day-chosen')))
  //新增每日精选
  const AddDayChosen = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/day-chosen/add')))
  //编辑每日精选
  const EditDayChosen = r => require.ensure([], () => r(require('@/views/standard-bussiness/content-manage/day-chosen/edit')))

  //优惠管理 
  const DiscountManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage')))
  //新增优惠码
  const AddCoupons = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/add-coupons')))
  //优惠码回收站
  const RecycleCoupons = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/recycle-coupons')))
  //注册送券
  const RegisterCoupons = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/register-coupons')))
  //新增注册送券
  const AddRegisterCoupons = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/add-register-coupons')))
  //注册送券回收站
  const RecycleRegisterCoupons = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/recycle-register-coupons')))
  //代金券
  const Voucher = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/voucher')))
  //新增代金券
  const AddVoucher = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/add-voucher')))
  //代金券回收站
  const RecycleVoucher = r => require.ensure([], () => r(require('@/views/standard-bussiness/discount-manage/recycle-voucher')))

  //营销管理
  const MarketingManage = r => require.ensure([], () => r(require('@/views/standard-bussiness/marketing-manage')))
  //新增banner
  const BannerAdd = r => require.ensure([], () => r(require('@/views/standard-bussiness/marketing-manage/banner-manage/banner-add')))
  //编辑banner
  const BannerEdit = r => require.ensure([], () => r(require('@/views/standard-bussiness/marketing-manage/banner-manage/banner-edit')))
  //banner详情
  const BannerDetail = r => require.ensure([], () => r(require('@/views/standard-bussiness/marketing-manage/banner-manage/banner-detail')))
  //banner历史记录
  const BannerHistory = r => require.ensure([], () => r(require('@/views/standard-bussiness/marketing-manage/banner-manage/banner-history')))
/* 专业运营 end */

/* 团检管理 start */
const GroupCheckManage = r => require.ensure([], () => r(require('@/views/group-check-manage')))
  //团检企业
  const GroupCheckManageIndex = r => require.ensure([], () => r(require('@/views/group-check-manage/home')))
  //新增编辑团检
  const AddGroupCheck = r => require.ensure([], () => r(require('@/views/group-check-manage/add-group-check')))
  //企业团检历史
  const GroupCheckHistory = r => require.ensure([], () => r(require('@/views/group-check-manage/check-history')))
  //企业团检详情
  const GroupCheckDetail = r => require.ensure([], () => r(require('@/views/group-check-manage/group-check-detail')))
  //企业团检套餐配置
  const GroupCheckPackages = r => require.ensure([], () => r(require('@/views/group-check-manage/packages')))
  //新增企业团检套餐
  const GroupCheckAddPackage = r => require.ensure([], () => r(require('@/views/group-check-manage/add-package')))
  //导入企业团检名单
  const GroupCheckImportList = r => require.ensure([], () => r(require('@/views/group-check-manage/import-list')))
  //企业团检医院套餐配置
  const GroupCheckHospitalPackage = r => require.ensure([], () => r(require('@/views/group-check-manage/hospital-package')))
  //企业团检预约情况
  const GroupCheckReserve = r => require.ensure([], () => r(require('@/views/group-check-manage/booking-situation')))
  //企业团检员工信息
  const GroupCheckEditEmployeesInfo = r => require.ensure([], () => r(require('@/views/group-check-manage/edit-employees-info')))
  //待解绑企业
  const WillUnbindCompany = r => require.ensure([], () => r(require('@/views/group-check-manage/will-unbind')))
  //企业信息管理
  const GroupInfoManage = r => require.ensure([], () => r(require('@/views/group-check-manage/info-manage')))
  //新增编辑企业
  const Addcompany = r => require.ensure([], () => r(require('@/views/group-check-manage/add-company')))

  const TestExcel = r => require.ensure([], () => r(require('@/views/group-check-manage/excel')))
/* 团检管理 end */



/* 专家管理start */
const ExpertsManage = r => require.ensure([], () => r(require('@/views/experts-manage')))
  //专家管理
  const ExpertsManageIndex = r => require.ensure([], () => r(require('@/views/experts-manage/home')))
  //新增专家
  const AddExpert = r => require.ensure([], () => r(require('@/views/experts-manage/add-expert')))
  //专家详情
  const ExpertDetail = r => require.ensure([], () => r(require('@/views/experts-manage/expert-detail')))
  //问医
  const AskMedical = r => require.ensure([], () => r(require('@/views/experts-manage/ask-medical')))
  //问医详情
  const AskMedicalDetail = r => require.ensure([], () => r(require('@/views/experts-manage/ask-medical-detail')))
  //问医详情问题描述
  const AskMedicalDetailDescribe = r => require.ensure([], () => r(require('@/views/experts-manage/ask-medical-detail/home')))
  //问医详情体检报告
  const AskMedicalDetailReports = r => require.ensure([], () => r(require('@/views/experts-manage/ask-medical-detail/reports')))


 //运营后台账号管理
 const backAccountMange = r => require.ensure([], () => r(require('@/views/backaccount-mange')))
 const backAccountMangeHome = r => require.ensure([], () => r(require('@/views/backaccount-mange/home')))
/* 专家管理end */

/* error页面 */
const NotFoundPage = r => require.ensure([], () => r(require('@/views/error/404')))

const routes = [
  {
      path: '*',
      redirect: '/error/404'
  },
  {
      path: '/error/404',
      component: NotFoundPage
  },
  {
    path: '/user/login',
    component: LoginPage
  },
  {
    path: '/',
    component: MainPage,
    redirect: '/home',
    children: [{
      path: 'home',
      component: HomePage
    }, {
      path: 'standard-data',
      component: StandardData,
      redirect: '/standard-data/hospital-manage',
      children: [{
          path: 'hospital-manage',
          component: HospitalManage
        }, {
          path: 'hospital-manage/add',
          component: AddHospital
        }, {
          path: 'hospital-manage/disabled',
          component: DisabledHospital
        }, {
          path: 'hospital-manage/hospital/:hid',
          component: HospitalDetail
        }, {
          path: 'hospital-manage/hospital/:hid/packages',
          component: MedicalPackages
        }, {
          path: 'hospital-manage/hospital/:hid/add-package',
          component: AddPackage
        }, {
          path: 'hospital-manage/hospital/:hid/disabled-package',
          component: DisabledPackage
        }, {
          path: 'hospital-manage/hospital/:hid/check-items',
          component: CheckItems
        }, {
          path: 'hospital-manage/hospital/:hid/add-check-items',
          component: AddCheckItems
        }, {
          path: 'hospital-manage/hospital/:hid/features',
          component: HospitalFeature
        }, {
          path: 'hospital-manage/hospital/:hid/health-manage',
          component: HealthManage
        }, {
          path: 'hospital-manage/hospital/:hid/experts',
          component: ExpertTeam
        },
        {
          path: 'hospital-manage/hospital/:hid/hos-manage',
          component: HosManage
        },
        {
          path: 'hospital-manage/hospital/:hid/select-flow',
          component: selectFlow
        },
        {
          path: 'check-manage/index',
          component: CheckManage
        }, {
          path: 'check-manage/maintain-category',
          component: MaintainCategory
        }, {
          path: 'check-manage/add-category',
          component: AddCategory
        }, {
          path: 'city-manage/index',
          component: CityManage
        }, {
          path: 'package-character',
          component: PackageCharacter
        }, {
          path: 'package-character/edit',
          component: PackageCharacterEdit
        },{
          path:'independent-manual',
          component:IndependentManual
        },
      ]
    }, {
      path: 'standard-bussiness-data',
      component: StandardBussinessData,
      redirect: '/standard-bussiness-data/person-check',
      children: [{
          path: 'person-check',
          component: personCheck
         },{
          path: 'group-check',
          component: groupCheck
         },{
           path:'booking-detail/:orderId/detail/:appointId/from/:fromOps',
           component: bookingDetails
         },{
          path: 'meal-recomend',
          component: MealRecomend
        }, {
          path: 'meal-recomend-add',
          component: MealRecomendAdd
        }, {
          path: 'meal-recomend-edit/:mealid',
          component: MealRecomendEdit
        }, {
          path: 'meal-promot',
          component: MealPromot
        }, {
          path: 'meal-promot-add',
          component: MealPromotAdd
        }, {
          path: 'meal-promot-edit/:mealid',
          component: MealPromotEdit
        }, {
          path: 'hot-label',
          component: HotLabel
        }, {
          path: 'team-consult',
          component: TeamConsult
        }, {
          path: 'spe-ragion-manage',
          component: SpeRegionManage
        }, {
          path: 'spe-region-edit/:regionId',
          component: SpeRegionEdit
        }, {
          path: 'hot-city',
          component: HotCity
        }, {
          path: 'add-city',
          component: AddCity
        }, {
          path: 'hos-hot',
          component: HosHot
        }, {
          path: 'meal-hot',
          component: MealHot
        }, {
          //path: 'order-manage',
          //component: OrderManage
          path:'person-order',
          component:personOrder
        },{
          path:'group-order',
          component:groupOrder
        },{
          path: 'order-detail/:orderId/detail/:orderNo',
          component: OrderDetail
        }, {
          path: 'order-detail/appointment-detail/:orderId',
          component: AppointmentDetail
        }, {
          path: 'chosen-hos',
          component: ChosenHosManage
        }, {
          path: 'user-message',
          component: UserMessage
        }, {
          path: 'user-detail/:userID',
          component: UserDetail
        }, {
          path: 'user-edit/:userID',
          component: UserEdit
        }, {
          path: 'index-expert',
          component: IndexExpert
        }, {
          path: 'add-expert',
          component: ExpertAdd
        }, {
          path: 'edit-expert/:expertId',
          component: ExpertEdit
        }, {
          path: 'content-manage',
          component: ContentManage
        }, {
          path: 'add-famous',
          component: AddFamous
        }, {
          path: 'edit-famous/:articalId',
          component: EditFamous
        }, {
          path: 'info-manage',
          component: InfoManage
        }, {
          path: 'info-manage-add',
          component: InfoManageAdd
        }, {
          path: 'info-manage-edit/:articalId',
          component: InfoManageEdit
        }, {
          path: 'day-chosen',
          component: DayChosen
        }, {
          path: 'add-day-chosen',
          component: AddDayChosen
        }, {
          path: 'edit-day-chosen/:articalId',
          component: EditDayChosen
        },
        {
          path: 'discount-manage',
          component: DiscountManage
        }, {
          path: 'add-coupons',
          component: AddCoupons
        }, {
          path: 'recycle-coupons',
          component: RecycleCoupons
        }, {
          path: 'register-coupons',
          component: RegisterCoupons
        }, {
          path: 'add-register-coupons',
          component: AddRegisterCoupons
        }, {
          path: 'recycle-register-coupons',
          component: RecycleRegisterCoupons
        }, {
          path: 'voucher',
          component: Voucher
        }, {
          path: 'add-voucher',
          component: AddVoucher
        }, {
          path: 'recycle-voucher',
          component: RecycleVoucher
        },
        {
          path: 'banner-manage',
          component: MarketingManage
        }, {
          path: 'banner-add/:position',
          component: BannerAdd
        }, {
          path: 'banner-edit/:id',
          component: BannerEdit
        }, {
          path: 'banner-history',
          component: BannerHistory
        }, {
          path: 'banner-detail/:id',
          component: BannerDetail
        }
      ]
    }, {
      path: 'group-check-manage',
      component: GroupCheckManage,
      redirect: '/group-check-manage/index',
      children: [{
        path: 'index',
        component: GroupCheckManageIndex
      }, {
        path: 'will-unbind',
        component: WillUnbindCompany
      }, {
        path: 'info-manage',
        component: GroupInfoManage
      }, {
        path: 'add-company',
        component: Addcompany
      }, {
        path: 'check-history/:cid',
        component: GroupCheckHistory
      }, {
        path: 'test',
        component: TestExcel
      }, {
        path: 'add-group-check',
        component: AddGroupCheck
      }, {
        path: 'group-check-detail/:gid',
        component: GroupCheckDetail
      }, {
        path: 'group-check-detail/:gid/packages',
        component: GroupCheckPackages
      }, {
        path: 'group-check-detail/:gid/add-package',
        component: GroupCheckAddPackage
      }, {
        path: 'group-check-detail/:gid/import-list',
        component: GroupCheckImportList
      }, {
        path: 'group-check-detail/:gid/hospital-package',
        component: GroupCheckHospitalPackage
      }, {
        path: 'booking-situation/:gid',
        component: GroupCheckReserve
      }, {
        path: 'booking-situation/:gid/edit-employees-info',
        component: GroupCheckEditEmployeesInfo
      }]
    }, {
      path: 'experts-manage',
      component: ExpertsManage,
      redirect: '/experts-manage/index',
      children: [{
        path: 'index',
        component: ExpertsManageIndex
      }, {
        path: 'add-expert',
        component: AddExpert,
      }, {
        path: 'expert-detail/:eid',
        component: ExpertDetail,
      }, {
        path: 'ask-medical',
        component: AskMedical,
      }, {
        path: 'ask-medical-detail/:qid',
        component: AskMedicalDetail,
        redirect: '/experts-manage/ask-medical-detail/:qid/describe',
        children: [{
          path: 'describe',
          component: AskMedicalDetailDescribe,
        }, {
          path: 'reports/:userId',
          component: AskMedicalDetailReports,
        }]
      }]
    }, {
      path: 'backaccount-mange',
      component: backAccountMange,
      redirect: '/backaccount-mange/home',
      children: [{
        path: 'home',
        component: backAccountMangeHome
      }]
    }]
  }
]

export default routes
