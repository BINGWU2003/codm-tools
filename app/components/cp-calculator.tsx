'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, Gift, Lightbulb, TrendingUp } from 'lucide-react'

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
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Calculator className="h-6 w-6" />
            <span>使命召唤手游 CP点充值计算器</span>
          </CardTitle>
          <CardDescription>
            智能计算最优充值方案，支持双倍档位活动
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Section */}
          <div className="space-y-2">
            <label htmlFor="cp-input" className="text-sm font-medium">
              输入目标CP点数量
            </label>
            <Input
              id="cp-input"
              type="text"
              value={targetCP}
              onChange={handleInputChange}
              placeholder="请输入需要的CP点数量"
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Double Tier Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Gift className="h-5 w-5 text-orange-500" />
            <span>活动双倍档位设置</span>
          </CardTitle>
          <CardDescription>
            勾选您还未购买的双倍档位（每种双倍档位只能购买一次）
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {DOUBLE_TIERS.map((tier) => (
            <div
              key={tier.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Gift className="h-4 w-4 text-orange-500" />
                <div>
                  <div className="font-medium">{tier.displayName}</div>
                  <div className="text-sm text-muted-foreground">= {tier.cp} CP</div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={tier.id ? doubleTierAvailability[tier.id] : false}
                  onCheckedChange={() => tier.id && handleDoubleTierToggle(tier.id)}
                />
                <Badge variant={tier.id && doubleTierAvailability[tier.id] ? "default" : "secondary"}>
                  {tier.id && doubleTierAvailability[tier.id] ? '可用' : '已购买'}
                </Badge>
              </div>
            </div>
          ))}

          {!hasAnyDoubleAvailable && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                <Lightbulb className="h-4 w-4" />
                <span className="text-sm font-medium">
                  所有双倍档位都已购买，将只使用普通档位计算
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Tiers Display */}
      <Card>
        <CardHeader>
          <CardTitle>当前可用档位</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Available Double Tiers */}
          {hasAnyDoubleAvailable && (
            <div>
              <h4 className="text-sm font-medium text-orange-600 dark:text-orange-400 mb-3 flex items-center">
                <Gift className="h-4 w-4 mr-1" />
                可用双倍档位（限购一次）
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableDoubleTiers.map((tier) => (
                  <Card key={tier.cp} className="border-orange-200 dark:border-orange-800">
                    <CardContent className="p-3 text-center">
                      <div className="text-xs font-medium text-orange-800 dark:text-orange-200">
                        {tier.displayName}
                      </div>
                      <div className="text-xs text-orange-600 dark:text-orange-400">
                        = {tier.cp} CP
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Normal Tiers */}
          <div>
            <h4 className="text-sm font-medium text-primary mb-3 flex items-center">
              <Calculator className="h-4 w-4 mr-1" />
              普通档位
            </h4>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {NORMAL_TIERS.map((tier) => (
                <Card key={tier.cp}>
                  <CardContent className="p-3 text-center">
                    <div className="text-sm font-medium">
                      {tier.cp} CP
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {solution && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>最优充值方案</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {solution.results.length > 0 ? (
              <>
                <div className="space-y-3">
                  {solution.results.map((result, index) => (
                    <Card
                      key={index}
                      className={result.isDoubleUsed ? 'border-orange-200 dark:border-orange-800' : ''}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {result.isDoubleUsed && <Gift className="h-4 w-4 text-orange-500" />}
                            <span className="font-medium">
                              {result.tier.displayName} × {result.quantity}
                            </span>
                          </div>
                          <Badge variant="default" className="bg-green-600 hover:bg-green-700">
                            = {result.totalCP} CP
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Separator />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">获得CP点</div>
                      <div className="text-2xl font-bold text-green-600">
                        {solution.totalCP}
                      </div>
                    </CardContent>
                  </Card>

                  {solution.remainingCP > 0 && (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-muted-foreground">仍需CP点</div>
                        <div className="text-2xl font-bold text-red-600">
                          {solution.remainingCP}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">满足率</div>
                      <div className="text-2xl font-bold text-primary">
                        {solution.efficiency.toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {solution.doubleUsed && (
                  <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                        <Gift className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          已使用活动双倍档位，节省了更多费用！
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {solution.remainingCP > 0 && (
                  <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200">
                        <Lightbulb className="h-4 w-4" />
                        <span className="text-sm">
                          提示：还差 {solution.remainingCP} CP点，建议购买 80 CP档位 {Math.ceil(solution.remainingCP / 80)} 次
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <div className="text-center text-muted-foreground">
                无法通过现有档位满足此CP点需求
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {targetCP && !solution && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            请输入有效的CP点数量
          </CardContent>
        </Card>
      )}
    </div>
  )
} 