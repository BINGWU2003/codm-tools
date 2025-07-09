'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Calculator, Gift, Lightbulb, TrendingUp, Settings, Eye, EyeOff, Edit, RotateCcw, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CPTier {
  cp: number
  displayName: string
  isDouble?: boolean
  originalCP?: number // 原始充值金额
  id?: string // 添加唯一标识
  price?: number // RMB价格
}

interface CalculationResult {
  tier: CPTier
  quantity: number
  totalCP: number
  totalPrice?: number
  isDoubleUsed?: boolean
}

interface OptimalSolution {
  results: CalculationResult[]
  totalCP: number
  totalPrice?: number
  remainingCP: number
  efficiency: number
  doubleUsed: boolean
}

// 默认价格配置
const DEFAULT_PRICES = {
  normal: [580, 300, 160, 60, 30, 8],
  double: [580, 300, 160, 60, 30]
}

export function CPCalculator() {
  const [targetCP, setTargetCP] = useState<string>('')
  const [priceMode, setPriceMode] = useState<boolean>(false)
  const [clickCount, setClickCount] = useState<number>(0)
  const [editMode, setEditMode] = useState<boolean>(false)
  
  // 价格状态管理
  const [normalPrices, setNormalPrices] = useState<number[]>(DEFAULT_PRICES.normal)
  const [doublePrices, setDoublePrices] = useState<number[]>(DEFAULT_PRICES.double)
  const [tempNormalPrices, setTempNormalPrices] = useState<string[]>([])
  const [tempDoublePrices, setTempDoublePrices] = useState<string[]>([])
  
  // 为每个双倍档位单独管理状态
  const [doubleTierAvailability, setDoubleTierAvailability] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}
    // 初始化双倍档位可用性（需要在有价格数据后）
    for (let i = 0; i < DEFAULT_PRICES.double.length; i++) {
      initialState[`double_tier_${i}`] = true
    }
    return initialState
  })

  // 从本地存储加载价格配置
  useEffect(() => {
    const savedNormalPrices = localStorage.getItem('codm-normal-prices')
    const savedDoublePrices = localStorage.getItem('codm-double-prices')
    
    if (savedNormalPrices) {
      try {
        const prices = JSON.parse(savedNormalPrices)
        if (Array.isArray(prices) && prices.length === DEFAULT_PRICES.normal.length) {
          setNormalPrices(prices)
        }
      } catch (e) {
        console.error('Failed to parse saved normal prices:', e)
      }
    }
    
    if (savedDoublePrices) {
      try {
        const prices = JSON.parse(savedDoublePrices)
        if (Array.isArray(prices) && prices.length === DEFAULT_PRICES.double.length) {
          setDoublePrices(prices)
        }
      } catch (e) {
        console.error('Failed to parse saved double prices:', e)
      }
    }
  }, [])

  // 保存价格配置到本地存储
  const savePrices = () => {
    localStorage.setItem('codm-normal-prices', JSON.stringify(normalPrices))
    localStorage.setItem('codm-double-prices', JSON.stringify(doublePrices))
  }

  // 动态生成档位数据
  const NORMAL_TIERS: CPTier[] = useMemo(() => [
    { cp: 10800, displayName: '10800 CP', price: normalPrices[0] },
    { cp: 5000, displayName: '5000 CP', price: normalPrices[1] },
    { cp: 2400, displayName: '2400 CP', price: normalPrices[2] },
    { cp: 880, displayName: '880 CP', price: normalPrices[3] },
    { cp: 420, displayName: '420 CP', price: normalPrices[4] },
    { cp: 80, displayName: '80 CP', price: normalPrices[5] }
  ], [normalPrices])

  const DOUBLE_TIERS: CPTier[] = useMemo(() => [
    { cp: 16000, displayName: '8000+8000 CP', isDouble: true, originalCP: 8000, id: 'double_tier_0', price: doublePrices[0] },
    { cp: 8000, displayName: '4000+4000 CP', isDouble: true, originalCP: 4000, id: 'double_tier_1', price: doublePrices[1] },
    { cp: 4000, displayName: '2000+2000 CP', isDouble: true, originalCP: 2000, id: 'double_tier_2', price: doublePrices[2] },
    { cp: 1600, displayName: '800+800 CP', isDouble: true, originalCP: 800, id: 'double_tier_3', price: doublePrices[3] },
    { cp: 800, displayName: '400+400 CP', isDouble: true, originalCP: 400, id: 'double_tier_4', price: doublePrices[4] }
  ], [doublePrices])
  
  const calculateOptimalSolution = (target: number, availableDoubleTiers: CPTier[], includePrices: boolean): OptimalSolution => {
    if (target <= 0) {
      return {
        results: [],
        totalCP: 0,
        totalPrice: includePrices ? 0 : undefined,
        remainingCP: target,
        efficiency: 0,
        doubleUsed: false
      }
    }

    let remaining = target
    const results: CalculationResult[] = []
    let doubleUsed = false
    let totalPrice = 0
    
    // 使用可用的双倍档位（每个最多用一次）
    for (const tier of availableDoubleTiers) {
      if (remaining >= tier.cp) {
        // 双倍档位只能使用一次
        const quantity = 1
        const totalCP = tier.cp
        const itemPrice = includePrices && tier.price ? tier.price * quantity : undefined
        
        results.push({
          tier,
          quantity,
          totalCP,
          totalPrice: itemPrice,
          isDoubleUsed: true
        })
        
        remaining -= totalCP
        if (includePrices && tier.price) {
          totalPrice += tier.price
        }
        doubleUsed = true
        break // 找到一个合适的双倍档位就停止，因为每种双倍档位只能用一次
      }
    }
    
    // 使用普通档位处理剩余的CP需求
    for (const tier of NORMAL_TIERS) {
      if (remaining >= tier.cp) {
        const quantity = Math.floor(remaining / tier.cp)
        const totalCP = quantity * tier.cp
        const itemPrice = includePrices && tier.price ? tier.price * quantity : undefined
        
        results.push({
          tier,
          quantity,
          totalCP,
          totalPrice: itemPrice
        })
        
        remaining -= totalCP
        if (includePrices && tier.price) {
          totalPrice += tier.price * quantity
        }
      }
    }
    
    const totalCP = results.reduce((sum, result) => sum + result.totalCP, 0)
    const efficiency = target > 0 ? (totalCP / target) * 100 : 0
    
    return {
      results,
      totalCP,
      totalPrice: includePrices ? totalPrice : undefined,
      remainingCP: remaining,
      efficiency,
      doubleUsed
    }
  }

  // 获取当前可用的双倍档位
  const availableDoubleTiers = useMemo(() => {
    return DOUBLE_TIERS.filter(tier => tier.id && doubleTierAvailability[tier.id])
  }, [DOUBLE_TIERS, doubleTierAvailability])

  const solution = useMemo(() => {
    const target = parseInt(targetCP)
    if (isNaN(target) || target <= 0) {
      return null
    }
    return calculateOptimalSolution(target, availableDoubleTiers, priceMode)
  }, [targetCP, availableDoubleTiers, priceMode, NORMAL_TIERS])

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

  const handleTitleClick = () => {
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    // 连续点击7次激活价格模式
    if (newCount >= 7) {
      setPriceMode(true)
      setClickCount(0) // 重置计数
    }
    
    // 如果已经在价格模式，点击可以关闭
    if (priceMode && newCount === 1) {
      setPriceMode(false)
      setClickCount(0)
    }
    
    // 5秒后重置点击计数
    setTimeout(() => {
      setClickCount(0)
    }, 5000)
  }

  const handleEditMode = () => {
    if (!editMode) {
      // 进入编辑模式时，将当前价格转换为字符串数组
      setTempNormalPrices(normalPrices.map(String))
      setTempDoublePrices(doublePrices.map(String))
    }
    setEditMode(!editMode)
  }

  const handleSavePrices = () => {
    // 验证并保存价格
    const newNormalPrices = tempNormalPrices.map(p => {
      const num = parseFloat(p)
      return isNaN(num) || num <= 0 ? DEFAULT_PRICES.normal[tempNormalPrices.indexOf(p)] : num
    })
    
    const newDoublePrices = tempDoublePrices.map(p => {
      const num = parseFloat(p)
      return isNaN(num) || num <= 0 ? DEFAULT_PRICES.double[tempDoublePrices.indexOf(p)] : num
    })
    
    setNormalPrices(newNormalPrices)
    setDoublePrices(newDoublePrices)
    setEditMode(false)
    
    // 保存到本地存储
    setTimeout(() => {
      savePrices()
    }, 100)
  }

  const handleCancelEdit = () => {
    setEditMode(false)
    setTempNormalPrices([])
    setTempDoublePrices([])
  }

  const handleResetPrices = () => {
    setNormalPrices(DEFAULT_PRICES.normal)
    setDoublePrices(DEFAULT_PRICES.double)
    setEditMode(false)
    
    // 清除本地存储
    localStorage.removeItem('codm-normal-prices')
    localStorage.removeItem('codm-double-prices')
  }

  const handleNormalPriceChange = (index: number, value: string) => {
    const newPrices = [...tempNormalPrices]
    newPrices[index] = value
    setTempNormalPrices(newPrices)
  }

  const handleDoublePriceChange = (index: number, value: string) => {
    const newPrices = [...tempDoublePrices]
    newPrices[index] = value
    setTempDoublePrices(newPrices)
  }

  const hasAnyDoubleAvailable = Object.values(doubleTierAvailability).some(available => available)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle 
            className="flex items-center justify-center space-x-2 text-2xl cursor-pointer hover:text-primary/80 transition-colors select-none"
            onClick={handleTitleClick}
          >
            <Calculator className="h-6 w-6" />
            <span>使命召唤手游 CP点充值计算器</span>
            {priceMode && (
              <Badge variant="secondary" className="ml-2">
                <Eye className="h-3 w-3 mr-1" />
                价格模式
              </Badge>
            )}
          </CardTitle>
          <CardDescription>
            智能计算最优充值方案，支持双倍档位活动
            {!priceMode && clickCount > 0 && (
              <div className="text-xs text-muted-foreground mt-1">
                再点击 {7 - clickCount} 次启用价格计算...
              </div>
            )}
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

          {/* Price Mode Toggle */}
          {priceMode && (
            <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <Settings className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">价格计算模式</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEditMode}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {editMode ? '取消编辑' : '编辑价格'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPriceMode(false)}
                >
                  <EyeOff className="h-4 w-4 mr-1" />
                  关闭
                </Button>
              </div>
            </div>
          )}

          {/* Price Edit Mode */}
          {priceMode && editMode && (
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Edit className="h-5 w-5" />
                  <span>自定义价格配置</span>
                </CardTitle>
                <CardDescription>
                  修改各档位的RMB价格，价格必须大于0
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 普通档位价格编辑 */}
                <div>
                  <h4 className="text-sm font-medium mb-3">普通档位价格</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {NORMAL_TIERS.map((tier, index) => (
                      <div key={tier.cp} className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                          {tier.cp} CP
                        </label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">¥</span>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={tempNormalPrices[index] || ''}
                            onChange={(e) => handleNormalPriceChange(index, e.target.value)}
                            className="text-sm"
                            placeholder={normalPrices[index]?.toString()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 双倍档位价格编辑 */}
                <div>
                  <h4 className="text-sm font-medium mb-3">双倍档位价格</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {DOUBLE_TIERS.map((tier, index) => (
                      <div key={tier.id} className="space-y-2">
                        <label className="text-xs text-muted-foreground">
                          {tier.displayName}
                        </label>
                        <div className="flex items-center space-x-1">
                          <span className="text-sm">¥</span>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={tempDoublePrices[index] || ''}
                            onChange={(e) => handleDoublePriceChange(index, e.target.value)}
                            className="text-sm"
                            placeholder={doublePrices[index]?.toString()}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* 编辑操作按钮 */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handleResetPrices}
                    className="text-orange-600 border-orange-300 hover:bg-orange-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    重置为默认
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 mr-1" />
                      取消
                    </Button>
                    <Button
                      onClick={handleSavePrices}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      保存价格
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
                  <div className="text-sm text-muted-foreground">
                    = {tier.cp} CP
                    {priceMode && tier.price && (
                      <span className="ml-2 text-green-600 font-medium">¥{tier.price}</span>
                    )}
                  </div>
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
                      {priceMode && tier.price && (
                        <div className="text-xs text-green-600 font-medium mt-1">
                          ¥{tier.price}
                        </div>
                      )}
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
                    {priceMode && tier.price && (
                      <div className="text-xs text-green-600 font-medium mt-1">
                        ¥{tier.price}
                      </div>
                    )}
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
                            <div>
                              <span className="font-medium">
                                {result.tier.displayName} × {result.quantity}
                              </span>
                              {priceMode && result.totalPrice && (
                                <div className="text-sm text-green-600 font-medium">
                                  单价 ¥{result.tier.price} × {result.quantity} = ¥{result.totalPrice}
                                </div>
                              )}
                            </div>
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
                
                <div className={`grid grid-cols-1 ${priceMode ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-4`}>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-sm text-muted-foreground">获得CP点</div>
                      <div className="text-2xl font-bold text-green-600">
                        {solution.totalCP}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {priceMode && solution.totalPrice !== undefined && (
                    <Card>
                      <CardContent className="p-4 text-center">
                        <div className="text-sm text-muted-foreground">总花费</div>
                        <div className="text-2xl font-bold text-blue-600">
                          ¥{solution.totalPrice}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
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
                        <div className="text-sm">
                          <div>提示：还差 {solution.remainingCP} CP点，建议购买 80 CP档位 {Math.ceil(solution.remainingCP / 80)} 次</div>
                          {priceMode && (
                            <div className="mt-1 text-green-600 font-medium">
                              额外费用：¥{Math.ceil(solution.remainingCP / 80) * (NORMAL_TIERS[5]?.price || 8)}
                            </div>
                          )}
                        </div>
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