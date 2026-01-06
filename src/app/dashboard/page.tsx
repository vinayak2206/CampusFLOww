import WelcomeHeader from "@/components/dashboard/welcome-header";
import QuickStats from "@/components/dashboard/quick-stats";
import Timetable from "@/components/dashboard/timetable";
import { mockUser } from "@/lib/data";

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <WelcomeHeader name={mockUser.name} />
            <QuickStats 
                productivityScore={mockUser.productivityScore} 
                academicRisk={mockUser.academicRisk} 
            />
            <Timetable />
        </div>
    )
}