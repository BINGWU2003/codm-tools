import Link from 'next/link'

interface NavigationProps {
  title: string
  showBackButton?: boolean
}

export function Navigation({ title, showBackButton = true }: NavigationProps) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <Link
              href="/"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              <span className="mr-2">←</span>
              <span className="font-medium">返回工具箱</span>
            </Link>
          ) : (
            <div className="w-24"></div>
          )}

          <div className="text-center flex-1 mx-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h1>
          </div>

          <div className="w-24"></div> {/* 平衡布局的占位符 */}
        </div>
      </div>
    </header>
  )
} 