import Link from 'next/link'

interface ComingSoonProps {
  title: string
  description: string
  icon: string
  features?: string[]
}

export function ComingSoon({ title, description, icon, features }: ComingSoonProps) {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="text-6xl mb-6">{icon}</div>

        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h2>

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {description}
        </p>

        {features && features.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              即将推出的功能：
            </h3>
            <ul className="space-y-2 text-left max-w-md mx-auto">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2 mt-1">✓</span>
                  <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            🔔 想要第一时间了解功能上线？请关注我们的更新！
          </p>
        </div>
      </div>
    </div>
  )
} 