"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { VoiceInput } from "@/components/voice-input";
import { useIncidentAnalysis } from "@/hooks/use-incident-analysis";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  location: z.string().min(2, "Please specify a location"),
  type: z.string({
    required_error: "Please select an incident type",
  }),
  description: z.string().min(20, "Please provide more detail"),
  anonymous: z.boolean().default(false),
  witnesses: z.string().optional(),
});

export function IncidentReportForm() {
  const { toast } = useToast();
  const { analyzeIncident, isAnalyzing } = useIncidentAnalysis();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      type: "",
      description: "",
      anonymous: false,
      witnesses: "",
    },
  });

  const handleVoiceInput = async (transcription: string) => {
    form.setValue("description", transcription);
    const analysis = await analyzeIncident(transcription);
    
    if (analysis) {
      form.setValue("type", analysis.type.toLowerCase());
      toast({
        title: "AI Analysis Complete",
        description: `Incident classified as ${analysis.type} with ${analysis.severity} severity.`,
      });
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const analysis = await analyzeIncident(values.description);
      if (analysis) {
        toast({
          title: "Incident Report Submitted",
          description: "Report analyzed and submitted successfully.",
        });
        form.reset();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Title</FormLabel>
              <FormControl>
                <Input placeholder="Brief description of the incident" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Where did it happen?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Incident Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="near_miss">Near Miss</SelectItem>
                    <SelectItem value="injury">Injury</SelectItem>
                    <SelectItem value="property_damage">Property Damage</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center justify-between">
                <span>Description</span>
                <VoiceInput onTranscription={handleVoiceInput} />
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide detailed information about what happened..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="witnesses"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Witnesses</FormLabel>
              <FormControl>
                <Input
                  placeholder="Names of any witnesses (optional)"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Separate multiple names with commas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="anonymous"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Anonymous Report</FormLabel>
                <FormDescription>
                  Submit this report anonymously
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Submit Report'
          )}
        </Button>
      </form>
    </Form>
  );
}