import { CPCalculator } from '../components/cp-calculator'
import { SidebarLayout } from '../components/sidebar-layout'

export default function CPCalculatorPage() {
  return (
    <SidebarLayout>
      <div className="p-8">
        <CPCalculator />
      </div>
    </SidebarLayout>
  )
} 