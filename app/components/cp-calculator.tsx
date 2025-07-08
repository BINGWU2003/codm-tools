'use client'

import { useState, useMemo } from 'react'

interface CPTier {
  cp: number
  displayName: string
  isDouble?: boolean
  originalCP?: number // 原始充值金额
  id?: string // 添加唯一标识
  price?: number // 可以后续添加价格信息
}

interface CalculationResult {
  tier: CPTier
  quantity: number
  totalCP: number
  isDoubleUsed?: boolean
}

interface OptimalSolution {
  results: CalculationResult[]
  totalCP: number
  remainingCP: number
  efficiency: number
  doubleUsed: boolean
}

const NORMAL_TIERS: CPTier[] = [
  { cp: 10800, displayName: '10800 CP' },
  { cp: 5000, displayName: '5000 CP' },
  { cp: 2400, displayName: '2400 CP' },
  { cp: 880, displayName: '880 CP' },
  { cp: 420, displayName: '420 CP' },
  { cp: 80, displayName: '80 CP' }
]

const DOUBLE_TIERS: CPTier[] = [
  { cp: 16000, displayName: '8000+8000 CP', isDouble: true, originalCP: 8000, id: 'double_16000' },
  { cp: 8000, displayName: '4000+4000 CP', isDouble: true, originalCP: 4000, id: 'double_8000' },
  { cp: 4000, displayName: '2000+2000 CP', isDouble: true, originalCP: 2000, id: 'double_4000' },
  { cp: 1600, displayName: '800+800 CP', isDouble: true, originalCP: 800, id: 'double_1600' },
  { cp: 800, displayName: '400+400 CP', isDouble: true, originalCP: 400, id: 'double_800' }
]

export function CPCalculator() {
  const [targetCP, setTargetCP] = useState<string>('')

  // 为每个双倍档位单独管理状态
  const [doubleTierAvailability, setDoubleTierAvailability] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    DOUBLE_TIERS.forEach(tier => {
      if (tier.id) {
        initialState[tier.id] = true // 默认所有双倍档位都可用
      }
    })
    return initialState
  })

  const calculateOptimalSolution = (target: number, availableDoubleTiers: CPTier[]): OptimalSolution => {
    if (target <= 0) {
      return {
        results: [],
        totalCP: 0,
        remainingCP: target,
        efficiency: 0,
        doubleUsed: false
      }
    }

    let remaining = target
    const results: CalculationResult[] = []
    let doubleUsed = false

    // 使用可用的双倍档位（每个最多用一次）
    for (const tier of availableDoubleTiers) {
      if (remaining >= tier.cp) {
        // 双倍档位只能使用一次
        const quantity = 1
        const totalCP = tier.cp

        results.push({
          tier,
          quantity,
          totalCP,
          isDoubleUsed: true
        })

        remaining -= totalCP
        doubleUsed = true
        break // 找到一个合适的双倍档位就停止，因为每种双倍档位只能用一次
      }
    }

    // 使用普通档位处理剩余的CP需求
    for (const tier of NORMAL_TIERS) {
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
      efficiency,
      doubleUsed
    }
  }

  // 获取当前可用的双倍档位
  const availableDoubleTiers = useMemo(() => {
    return DOUBLE_TIERS.filter(tier => tier.id && doubleTierAvailability[tier.id])
  }, [doubleTierAvailability])

  const solution = useMemo(() => {
    const target = parseInt(targetCP)
    if (isNaN(target) || target <= 0) {
      return null
    }
    return calculateOptimalSolution(target, availableDoubleTiers)
  }, [targetCP, availableDoubleTiers])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // 只允许输入数字
    if (value === '' || /^\d+$/.test(value)) {
      setTargetCP(value)
    }
  }

  const handleDoubleTierToggle = (tierId: string) => {
    setDoubleTierAvailability(prev => ({
      ...prev,
      [tierId]: !prev[tierId]
    }))
  }

  const hasAnyDoubleAvailable = Object.values(doubleTierAvailability).some(available => available)

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

      {/* 双倍档位控制面板 */}
      <div className="mb-6">
        <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <span className="text-lg mr-2">🎉</span>
            <h3 className="font-semibold text-orange-800 dark:text-orange-200">活动双倍档位设置</h3>
          </div>
          <p className="text-sm text-orange-600 dark:text-orange-300 mb-4">
            勾选您还未购买的双倍档位（每种双倍档位只能购买一次）
          </p>

          <div className="space-y-3">
            {DOUBLE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-orange-800/20 rounded-lg border border-orange-200 dark:border-orange-600"
              >
                <div className="flex items-center">
                  <span className="font-medium text-orange-800 dark:text-orange-200">
                    {tier.displayName}
                  </span>
                  <span className="ml-2 text-sm text-orange-600 dark:text-orange-400">
                    = {tier.cp} CP
                  </span>
                </div>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={tier.id ? doubleTierAvailability[tier.id] : false}
                    onChange={() => tier.id && handleDoubleTierToggle(tier.id)}
                    className="sr-only"
                  />
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${tier.id && doubleTierAvailability[tier.id]
                      ? 'bg-orange-500'
                      : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${tier.id && doubleTierAvailability[tier.id]
                        ? 'translate-x-5'
                        : 'translate-x-0'
                      }`} />
                  </div>
                  <span className="ml-2 text-xs text-orange-800 dark:text-orange-200">
                    {tier.id && doubleTierAvailability[tier.id] ? '可用' : '已购买'}
                  </span>
                </label>
              </div>
            ))}
          </div>

          {!hasAnyDoubleAvailable && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                ⚠️ 所有双倍档位都已购买，将只使用普通档位计算
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 显示可用档位 */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">当前可用档位：</h3>

        {/* 可用的双倍档位 */}
        {hasAnyDoubleAvailable && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-2">
              🎉 可用双倍档位（限购一次）
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {availableDoubleTiers.map((tier) => (
                <div
                  key={tier.cp}
                  className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg p-2 text-center"
                >
                  <span className="text-xs font-medium text-orange-800 dark:text-orange-200 block">
                    {tier.displayName}
                  </span>
                  <span className="text-xs text-orange-600 dark:text-orange-400">
                    = {tier.cp} CP
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 普通档位 */}
        <div>
          <h4 className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">💎 普通档位</h4>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {NORMAL_TIERS.map((tier) => (
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
                    className={`flex justify-between items-center rounded-lg p-3 border ${result.isDoubleUsed
                        ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'
                        : 'bg-white dark:bg-gray-600 border-gray-200 dark:border-gray-500'
                      }`}
                  >
                    <div className="flex items-center">
                      {result.isDoubleUsed && <span className="text-orange-500 mr-2">🎉</span>}
                      <span className={`font-medium ${result.isDoubleUsed
                          ? 'text-orange-800 dark:text-orange-200'
                          : 'text-gray-800 dark:text-white'
                        }`}>
                        {result.tier.displayName} × {result.quantity}
                      </span>
                    </div>
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

              {solution.doubleUsed && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-700 rounded-lg">
                  <p className="text-sm text-orange-800 dark:text-orange-200">
                    🎉 已使用活动双倍档位，节省了更多费用！
                  </p>
                </div>
              )}

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