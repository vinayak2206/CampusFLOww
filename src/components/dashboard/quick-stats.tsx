import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, ShieldAlert } from 'lucide-react';
import type { User } from '@/lib/types';

type QuickStatsProps = {
  productivityScore: User['productivityScore'];
  academicRisk: User['academicRisk'];
};

const riskVariantMapping = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
} as const;


export default function QuickStats({
  productivityScore,
  academicRisk,
}: QuickStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Productivity Score
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold font-headline text-accent">{productivityScore}/100</div>
          <p className="text-xs text-muted-foreground">Weekly trend is up by 5%</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Academic Risk</CardTitle>
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <Badge variant={riskVariantMapping[academicRisk]}>{academicRisk}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Based on recent activity
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
