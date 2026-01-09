'use client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy } from "lucide-react";

// Mock data, to be replaced with Firestore data
const dailyLeaderboard = [
    { rank: 1, name: "Rohan", time: "3h 45m", avatar: "https://picsum.photos/seed/user2/40/40" },
    { rank: 2, name: "Aisha", time: "2h 10m", avatar: "https://picsum.photos/seed/user3/40/40" },
    { rank: 3, name: "Saanvi", time: "1h 30m", avatar: "https://picsum.photos/seed/user1/40/40" },
]

const weeklyLeaderboard = [
    { rank: 1, name: "Rohan", time: "25h 15m", avatar: "https://picsum.photos/seed/user2/40/40" },
    { rank: 2, name: "Saanvi", time: "18h 50m", avatar: "https://picsum.photos/seed/user1/40/40" },
    { rank: 3, name: "Aisha", time: "15h 20m", avatar: "https://picsum.photos/seed/user3/40/40" },
]

export function LeaderboardCard() {

    const RankIndicator = ({ rank }: { rank: number }) => {
        const colors = ["bg-yellow-400", "bg-gray-400", "bg-yellow-600"];
        if (rank <= 3) {
            return <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold ${colors[rank-1]}`}>{rank}</div>
        }
        return <div className="w-6 h-6 flex items-center justify-center text-muted-foreground font-semibold">{rank}</div>
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Trophy className="text-yellow-500" />
                    Leaderboard
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="daily">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="daily">Daily</TabsTrigger>
                        <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    </TabsList>
                    <TabsContent value="daily">
                        <ul className="space-y-4 pt-4">
                            {dailyLeaderboard.map(user => (
                                <li key={user.rank} className="flex items-center gap-4">
                                    <RankIndicator rank={user.rank} />
                                    <Avatar>
                                        <AvatarImage src={user.avatar} data-ai-hint="person avatar"/>
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold flex-1">{user.name}</p>
                                    <p className="font-mono font-medium">{user.time}</p>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                    <TabsContent value="weekly">
                        <ul className="space-y-4 pt-4">
                             {weeklyLeaderboard.map(user => (
                                <li key={user.rank} className="flex items-center gap-4">
                                    <RankIndicator rank={user.rank} />
                                    <Avatar>
                                        <AvatarImage src={user.avatar} data-ai-hint="person avatar"/>
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <p className="font-semibold flex-1">{user.name}</p>
                                    <p className="font-mono font-medium">{user.time}</p>
                                </li>
                            ))}
                        </ul>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
