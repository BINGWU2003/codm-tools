import { SidebarLayout } from './components/sidebar-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calculator, Target, Settings } from 'lucide-react'

export default function Home() {
  return (
    <SidebarLayout>
      <div className="p-8">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              欢迎使用 CODM Tools
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              专为使命召唤手游玩家打造的综合工具箱
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Calculator className="h-8 w-8 text-primary" />
                  <Badge variant="default">可用</Badge>
                </div>
                <CardTitle className="text-lg">CP点充值计算器</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  智能计算最优充值方案，支持双倍档位活动，帮你省钱又省心
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Target className="h-8 w-8 text-muted-foreground" />
                  <Badge variant="secondary">即将推出</Badge>
                </div>
                <CardTitle className="text-lg">武器数据查询</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  详细的武器属性数据库，包含伤害、射程、配件推荐等信息
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Settings className="h-8 w-8 text-muted-foreground" />
                  <Badge variant="secondary">即将推出</Badge>
                </div>
                <CardTitle className="text-lg">灵敏度计算器</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  帮助你找到最适合的操作灵敏度设置，提升游戏体验
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Quick Start */}
          <Card className="mb-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">开始使用</CardTitle>
              <CardDescription className="max-w-2xl mx-auto">
                点击左侧侧边栏中的工具开始使用。目前CP点充值计算器已经可用，
                其他功能正在开发中，敬请期待！
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>专业游戏工具</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>移动端适配</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>完全免费</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>持续更新</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">1</div>
                <div className="text-sm text-muted-foreground">可用工具</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">5</div>
                <div className="text-sm text-muted-foreground">即将推出</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">免费使用</div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">在线可用</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  )
}
