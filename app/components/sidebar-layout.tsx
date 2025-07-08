'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Menu, X, Home, Calculator, Target, Settings, Map, Gift, Gamepad2 } from 'lucide-react'

interface Tool {
  id: string
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  status: 'available' | 'coming-soon'
}

const tools: Tool[] = [
  {
    id: 'cp-calculator',
    title: 'CP点充值计算器',
    href: '/cp-calculator',
    icon: Calculator,
    status: 'available'
  },
  {
    id: 'weapon-stats',
    title: '武器数据查询',
    href: '/weapon-stats',
    icon: Target,
    status: 'coming-soon'
  },
  {
    id: 'sensitivity-calc',
    title: '灵敏度计算器',
    href: '/sensitivity-calc',
    icon: Settings,
    status: 'coming-soon'
  },
  {
    id: 'loadout-builder',
    title: '配装生成器',
    href: '/loadout-builder',
    icon: Settings,
    status: 'coming-soon'
  },
  {
    id: 'map-guide',
    title: '地图攻略',
    href: '/map-guide',
    icon: Map,
    status: 'coming-soon'
  },
  {
    id: 'event-tracker',
    title: '活动追踪',
    href: '/event-tracker',
    icon: Gift,
    status: 'coming-soon'
  }
]

interface SidebarLayoutProps {
  children: React.ReactNode
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">CODM Tools</span>
          </Link>

          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {/* Home */}
          <Button
            variant={pathname === '/' ? 'secondary' : 'ghost'}
            className="w-full justify-start"
            asChild
          >
            <Link href="/">
              <Home className="mr-3 h-4 w-4" />
              工具箱首页
            </Link>
          </Button>

          <Separator className="my-4" />

          {/* Tools Section */}
          <div className="space-y-2">
            <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              工具列表
            </h3>

            {tools.map((tool) => {
              const IconComponent = tool.icon
              const isActive = pathname === tool.href
              const isAvailable = tool.status === 'available'

              return (
                <div key={tool.id} className="space-y-1">
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={`w-full justify-start ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    asChild={isAvailable}
                    disabled={!isAvailable}
                    onClick={(e) => {
                      if (!isAvailable) {
                        e.preventDefault()
                      } else {
                        setSidebarOpen(false) // Close mobile sidebar on navigation
                      }
                    }}
                  >
                    {isAvailable ? (
                      <Link href={tool.href}>
                        <IconComponent className="mr-3 h-4 w-4" />
                        <span className="flex-1 text-left truncate">{tool.title}</span>
                        {tool.status === 'coming-soon' && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            即将推出
                          </Badge>
                        )}
                      </Link>
                    ) : (
                      <>
                        <IconComponent className="mr-3 h-4 w-4" />
                        <span className="flex-1 text-left truncate">{tool.title}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          即将推出
                        </Badge>
                      </>
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <p className="font-medium">CODM Tools v1.0</p>
            <p>专业游戏工具箱</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-card border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-2">
              <Gamepad2 className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold">CODM Tools</span>
            </div>

            <div className="w-10"></div> {/* Spacer for balance */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
} 