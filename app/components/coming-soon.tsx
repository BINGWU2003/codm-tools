import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Bell } from 'lucide-react'

interface ComingSoonProps {
  title: string
  description: string
  icon: string
  features?: string[]
}

export function ComingSoon({ title, description, icon, features }: ComingSoonProps) {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="text-center">
        <CardHeader className="space-y-4">
          <div className="text-6xl mx-auto">{icon}</div>
          <CardTitle className="text-3xl">{title}</CardTitle>
          <CardDescription className="text-lg">
            {description}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {features && features.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">
                即将推出的功能：
              </h3>
              <ul className="space-y-3 text-left max-w-md mx-auto">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-center space-x-2 text-primary">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">
                  想要第一时间了解功能上线？请关注我们的更新！
                </span>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
} 