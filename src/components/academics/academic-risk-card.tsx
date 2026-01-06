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
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sparkles } from 'lucide-react';
import { explainAcademicRiskAndSuggestActions, type ExplainAcademicRiskAndSuggestActionsOutput } from '@/ai/flows/explain-academic-risk-and-suggest-actions';
import { useToast } from "@/hooks/use-toast";
import { mockAcademicMetrics, mockUser } from '@/lib/data';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const formSchema = z.object({
  attendance: z.coerce.number().min(0).max(100),
  assignmentsMissed: z.coerce.number().min(0),
  stressLevel: z.coerce.number().min(1).max(5),
  academicRisk: z.enum(['Low', 'Medium', 'High']),
});

export function AcademicRiskCard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExplainAcademicRiskAndSuggestActionsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        ...mockAcademicMetrics,
        academicRisk: mockUser.academicRisk
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);
    try {
      const res = await explainAcademicRiskAndSuggestActions({...values, productivityScore: mockUser.productivityScore });
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
        <CardTitle className="font-headline">Academic Risk Predictor</CardTitle>
        <CardDescription>
          Input your current metrics to get an AI-powered analysis of your academic standing and actionable advice.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="attendance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Attendance (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 85" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assignmentsMissed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignments Missed</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="e.g., 2" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="academicRisk"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Estimated Risk</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select risk level" />
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
              name="stressLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Self-reported Stress Level: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      defaultValue={[field.value]}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Analyze My Risk
            </Button>
            {result && (
              <Alert className="bg-primary/5">
                <Sparkles className="h-4 w-4" />
                <AlertTitle className="font-headline">AI Analysis</AlertTitle>
                <AlertDescription className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Explanation</h4>
                    <p className="text-foreground/80">{result.explanation}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold">Suggested Actions</h4>
                    <p className="text-foreground/80">{result.suggestions}</p>
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
