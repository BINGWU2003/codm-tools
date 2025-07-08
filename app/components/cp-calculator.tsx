'use client'

import { useState, useMemo } from 'react'

interface CPTier {
  cp: number
  price?: number // 可以后续添加价格信息
}

interface CalculationResult {
  tier: CPTier
  quantity: number
  totalCP: number
}

interface OptimalSolution {
  results: CalculationResult[]
  totalCP: number
  remainingCP: number
  efficiency: number
}

const CP_TIERS: CPTier[] = [
  { cp: 10800 },
  { cp: 5000 },
  { cp: 2400 },
  { cp: 880 },
  { cp: 420 },
  { cp: 80 }
]

export function CPCalculator() {
  const [targetCP, setTargetCP] = useState<string>('')

  const calculateOptimalSolution = (target: number): OptimalSolution => {
    if (target <= 0) {
      return {
        results: [],
        totalCP: 0,
        remainingCP: target,
        efficiency: 0
      }
    }

    let remaining = target
    const results: CalculationResult[] = []

    // 使用贪心算法，从大到小选择CP档位
    for (const tier of CP_TIERS) {
      if (remaining >= tier.cp) {
        const quantity = Math.floor(remaining / tier.cp)
        const totalCP = quantity * tier.cp

        results.push({
          tier,
          quantity,
          totalCP
        })

        remaining -= totalCP
      }
    }

    const totalCP = results.reduce((sum, result) => sum + result.totalCP, 0)
    const efficiency = target > 0 ? (totalCP / target) * 100 : 0

    return {
      results,
      totalCP,
      remainingCP: remaining,
      efficiency
    }
  }

  const solution = useMemo(() => {
    const target = parseInt(targetCP)
    if (isNaN(target) || target <= 0) {
      return null
    }
    return calculateOptimalSolution(target)
  }, [targetCP])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setTargetCP(value)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        使命召唤手游 CP点充值计算器
      </h1>

      <div className="mb-6">
        <label htmlFor="cp-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          输入目标CP点数量
        </label>
        <input
          id="cp-input"
          type="text"
          value={targetCP}
          onChange={handleInputChange}
          placeholder="请输入需要的CP点数量"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg"
        />
      </div>

      {/* 显示可用档位 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">可用充值档位：</h3>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {CP_TIERS.map((tier) => (
            <div
              key={tier.cp}
              className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-2 text-center"
            >
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                {tier.cp} CP
              </span>
            </div>
          ))}
        </div>
      </div>

      {solution && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            最优充值方案
          </h2>

          {solution.results.length > 0 ? (
            <>
              <div className="space-y-3 mb-4">
                {solution.results.map((result, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500"
                  >
                    <span className="font-medium text-gray-800 dark:text-white">
                      {result.tier.cp} CP × {result.quantity}
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      = {result.totalCP} CP
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">获得CP点</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {solution.totalCP}
                    </div>
                  </div>

                  {solution.remainingCP > 0 && (
                    <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300">仍需CP点</div>
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {solution.remainingCP}
                      </div>
                    </div>
                  )}

                  <div className="bg-white dark:bg-gray-600 rounded-lg p-3">
                    <div className="text-sm text-gray-600 dark:text-gray-300">满足率</div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {solution.efficiency.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>

              {solution.remainingCP > 0 && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 提示：还差 {solution.remainingCP} CP点，建议购买 80 CP档位 {Math.ceil(solution.remainingCP / 80)} 次
                  </p>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              无法通过现有档位满足此CP点需求
            </p>
          )}
        </div>
      )}

      {targetCP && !solution && (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-6">
          请输入有效的CP点数量
        </div>
      )}
    </div>
  )
} 