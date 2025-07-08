'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Tool {
  id: string
  title: string
  href: string
  icon: string
  status: 'available' | 'coming-soon'
}

const tools: Tool[] = [
  {
    id: 'cp-calculator',
    title: 'CP点充值计算器',
    href: '/cp-calculator',
    icon: '💎',
    status: 'available'
  },
  {
    id: 'weapon-stats',
    title: '武器数据查询',
    href: '/weapon-stats',
    icon: '🔫',
    status: 'coming-soon'
  },
  {
    id: 'sensitivity-calc',
    title: '灵敏度计算器',
    href: '/sensitivity-calc',
    icon: '🎯',
    status: 'coming-soon'
  },
  {
    id: 'loadout-builder',
    title: '配装生成器',
    href: '/loadout-builder',
    icon: '⚙️',
    status: 'coming-soon'
  },
  {
    id: 'map-guide',
    title: '地图攻略',
    href: '/map-guide',
    icon: '🗺️',
    status: 'coming-soon'
  },
  {
    id: 'event-tracker',
    title: '活动追踪',
    href: '/event-tracker',
    icon: '🎁',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎮</span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">CODM Tools</span>
          </Link>

          {/* Mobile close button */}
          <button
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Home */}
          <Link
            href="/"
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${pathname === '/'
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
          >
            <span className="mr-3 text-lg">🏠</span>
            工具箱首页
          </Link>

          {/* Tools */}
          <div className="pt-4">
            <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              工具列表
            </h3>

            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.status === 'available' ? tool.href : '#'}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors group ${pathname === tool.href
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200'
                    : tool.status === 'available'
                      ? 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  }`}
                onClick={(e) => {
                  if (tool.status === 'coming-soon') {
                    e.preventDefault()
                  } else {
                    setSidebarOpen(false) // Close mobile sidebar on navigation
                  }
                }}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-lg">{tool.icon}</span>
                  <span className="truncate">{tool.title}</span>
                </div>

                {tool.status === 'coming-soon' && (
                  <span className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-full">
                    即将推出
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>CODM Tools v1.0</p>
            <p className="mt-1">专业游戏工具箱</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="text-xl">☰</span>
            </button>

            <div className="flex items-center space-x-2">
              <span className="text-lg">🎮</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">CODM Tools</span>
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