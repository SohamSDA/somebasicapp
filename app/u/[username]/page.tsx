"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import * as z from "zod";
import { useParams } from "next/navigation";
import Link from "next/link";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { Send, MessageSquare, Shield, Users } from "lucide-react";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username); // Decode URL params to handle case issues

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });
  const content = form.watch("content");

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      console.log("Sending message to:", username, "Content:", data.content);

      const response = await axios.post<ApiResponse>(`/api/messages`, {
        username,
        content: data.content,
      });

      console.log("Message sent successfully:", response.data);
      form.reset({ content: "" });

      toast.success("Message sent successfully! 🎉");
    } catch (err) {
      const errorMessage =
        (err as AxiosError<ApiResponse>).response?.data.message ||
        "Failed to send message. Please try again.";
      console.error("Failed to send message:", errorMessage);

      // Show error to user
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Main Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    Send Anonymous Feedback
                  </h1>
                  <p className="text-blue-100">
                    to <span className="font-semibold">@{username}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="px-8 py-6 bg-blue-50 dark:bg-blue-900/20 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Your Privacy is Protected
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                Your message will be completely anonymous. We don&apos;t store
                your IP address, browser fingerprint, or any identifying
                information. The recipient will only see your message content.
              </p>
            </div>

            {/* Message Form */}
            <div className="p-8">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-lg font-semibold text-slate-900 dark:text-white">
                          Your Anonymous Message
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your honest feedback, thoughts, or suggestions. Be constructive and respectful in your message..."
                            className="min-h-[200px] resize-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            {...field}
                          />
                        </FormControl>
                        <div className="flex items-center justify-between">
                          <FormMessage className="text-red-500" />
                          <span className="text-sm text-slate-500 dark:text-slate-400">
                            {content.length}/500 characters
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isLoading || !content.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Anonymous Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                100% Anonymous
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                No tracking or logging
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                Instant Delivery
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Message sent immediately
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                Honest Feedback
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Encourage open communication
              </p>
            </div>
          </div>

          <Separator className="my-8 bg-slate-200 dark:bg-slate-700" />

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Want your own feedback link?
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Create your personalized anonymous feedback link and start
                receiving honest input from others.
              </p>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl cursor-pointer"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Create Your Link
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
