'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { recommendHostelActivities, type RecommendHostelActivitiesOutput } from '@/ai/flows/recommend-hostel-activities';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  noiseLevel: z.enum(['Low', 'Medium', 'High']),
  messMenu: z.string().min(3, 'Please describe the mess menu.'),
  freeSlotDuration: z.string().min(3, 'e.g., 1 hour'),
});

export function HostelIntelligenceCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendHostelActivitiesOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        noiseLevel: 'Medium',
        messMenu: 'Dal, Rice, Roti, and Mix Veg',
        freeSlotDuration: '1 hour 30 minutes'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await recommendHostelActivities(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to get AI recommendations. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Hostel Helper</CardTitle>
        <CardDescription>
          Get smart recommendations for your hostel life based on current conditions.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="noiseLevel"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Noise Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select noise level" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Low">Low</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="High">High</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="freeSlotDuration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Free Slot Duration</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 2 hours" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="messMenu"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Today's Mess Menu</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Dal, Rice, Paneer" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />

          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Get Recommendations
            </Button>
            {result && (
              <Alert className="bg-primary/5">
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline">AI Recommendations</AlertTitle>
                <AlertDescription className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Activity Suggestion</h4>
                    <p className="text-foreground/80">{result.activitySuggestion}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold">Nutrition Feedback</h4>
                    <p className="text-foreground/80">{result.nutritionFeedback}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
