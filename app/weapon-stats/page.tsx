import { SidebarLayout } from '../components/sidebar-layout'
import { ComingSoon } from '../components/coming-soon'

export default function WeaponStatsPage() {
  const features = [
    '完整的武器属性数据库',
    '伤害、射程、精准度等详细数值',
    '配件推荐和效果分析',
    '不同距离的伤害衰减曲线',
    '武器对比功能',
    '元级武器推荐'
  ]

  return (
    <SidebarLayout>
      <div className="p-8">
        <ComingSoon
          title="武器数据查询"
          description="全面的武器属性数据库，帮助你了解每把武器的详细数值，选择最适合的装备。"
          icon="🔫"
          features={features}
        />
      </div>
    </SidebarLayout>
  )
} 