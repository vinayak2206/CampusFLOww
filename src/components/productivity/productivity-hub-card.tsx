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
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { generateStudySuggestions, type GenerateStudySuggestionsOutput } from '@/ai/flows/generate-study-suggestions';
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  freeSlotDuration: z.string().min(3, 'e.g., 45 minutes'),
  academicWeakness: z.string().min(3, 'e.g., Calculus integrals'),
  hostelConditions: z.string().min(3, 'e.g., Quiet, empty common room'),
  pastBehavior: z.string().min(3, 'e.g., Prefer watching videos over reading'),
});

export function ProductivityHubCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateStudySuggestionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        freeSlotDuration: '1 hour',
        academicWeakness: 'Dynamic Programming',
        hostelConditions: 'My room is quiet, but the library is a 10-min walk away.',
        pastBehavior: 'I tend to get distracted by my phone when studying alone. I prefer short, focused sessions.'
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await generateStudySuggestions(values);
      setResult(res);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'An error occurred.',
        description: 'Failed to get AI suggestions. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">AI Productivity Recommendations</CardTitle>
        <CardDescription>
          Fill in your context to get personalized suggestions for your free time. Be as specific as possible for the best results.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="freeSlotDuration"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Free Slot Duration</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., 45 minutes" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="academicWeakness"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Academic Weakness</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Calculus integrals" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="hostelConditions"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Hostel / Current Conditions</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Room is noisy" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="pastBehavior"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Study Style / Preferences</FormLabel>
                    <FormControl>
                        <Textarea placeholder="e.g., I prefer visual learning, get bored with books easily..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Suggestions
            </Button>
            {result && (
              <Alert className="bg-primary/5">
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline">AI Suggestion</AlertTitle>
                <AlertDescription className="text-foreground/80">
                  {result.studySuggestion}
                </AlertDescription>
              </Alert>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
