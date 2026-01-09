'use client';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";

// Mock data, to be replaced with Firestore data
const liveUsers = [
    { name: "Saanvi", subject: "DSA", remaining: "12m left", avatar: "https://picsum.photos/seed/user1/40/40" },
    { name: "Rohan", subject: "Compiler Design", remaining: "48m left", avatar: "https://picsum.photos/seed/user2/40/40" },
    { name: "Aisha", subject: "Maths-3", remaining: "23m left", avatar: "https://picsum.photos/seed/user3/40/40" },
]

export function LiveStudyCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <Flame className="text-orange-500" />
                    Who is studying now
                </CardTitle>
                <CardDescription>
                    Join a focus session to appear here.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {liveUsers.length > 0 ? (
                     <ul className="space-y-4">
                        {liveUsers.map((user) => (
                            <li key={user.name} className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={user.avatar} data-ai-hint="person avatar"/>
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <p className="font-semibold">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.subject}</p>
                                </div>
                                <div className="text-sm font-medium text-orange-500">{user.remaining}</div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center text-muted-foreground py-6">
                        <p>No one is studying right now.</p>
                        <p className="text-xs">Start a focus session to be the first!</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
