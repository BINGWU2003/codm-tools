import { SidebarLayout } from './components/sidebar-layout'

export default function Home() {
  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              欢迎使用 CODM Tools
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              专为使命召唤手游玩家打造的综合工具箱
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">💎</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                CP点充值计算器
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                智能计算最优充值方案，支持双倍档位活动，帮你省钱又省心
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  可用
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🔫</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                武器数据查询
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                详细的武器属性数据库，包含伤害、射程、配件推荐等信息
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  即将推出
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                灵敏度计算器
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                帮助你找到最适合的操作灵敏度设置，提升游戏体验
              </p>
              <div className="mt-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  即将推出
                </span>
              </div>
            </div>
          </div>

          {/* Quick Start */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                开始使用
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                点击左侧侧边栏中的工具开始使用。目前CP点充值计算器已经可用，
                其他功能正在开发中，敬请期待！
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center">
                  <span className="mr-2">🎮</span>
                  专业游戏工具
                </span>
                <span className="flex items-center">
                  <span className="mr-2">📱</span>
                  移动端适配
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🆓</span>
                  完全免费
                </span>
                <span className="flex items-center">
                  <span className="mr-2">🔄</span>
                  持续更新
                </span>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">可用工具</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">5</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">即将推出</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">免费使用</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">在线可用</div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
