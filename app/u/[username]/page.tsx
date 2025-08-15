"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
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
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

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

      // You can add a toast notification here if you want
      alert("Message sent successfully!");
    } catch (err) {
      const errorMessage =
        (err as AxiosError<ApiResponse>).response?.data.message ||
        "Failed to send message. Please try again.";
      console.error("Failed to send message:", errorMessage);

      // Show error to user
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/20 via-black to-gray-900/10"></div>
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 70%, #333 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-6 py-12">
        <div className="w-full max-w-2xl">
          {/* Back to Home Link */}
          <div className="mb-8">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors duration-200 font-mono text-sm"
            >
              <span>&lt;</span>
              [EXIT_TO_HOME]
            </a>
          </div>

          {/* Anonymous Terminal Interface */}
          <div className="bg-gray-900 border border-gray-700">
            {/* Terminal Header */}
            <div className="bg-gray-800 border-b border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-400 font-mono text-sm">
                    ANONYMOUS_MESSAGING_TERMINAL
                  </span>
                </div>
                <div className="text-gray-500 font-mono text-xs">
                  TARGET: {username?.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 font-mono">
              {/* Target Info */}
              <div className="mb-6 bg-gray-800 border border-gray-600 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">&gt;</span>
                  <span className="text-gray-300">
                    TRANSMISSION_TARGET_IDENTIFIED
                  </span>
                </div>
                <div className="text-green-400 text-lg">
                  USER_ID: ANON_{username?.toUpperCase()}
                </div>
                <div className="text-gray-500 text-xs mt-1">
                  [!] Your identity will remain completely anonymous
                </div>
              </div>

              {/* Message Form */}
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
                        <FormLabel className="text-gray-300 font-mono text-sm block mb-3">
                          &gt; COMPOSE_ANONYMOUS_MESSAGE():
                        </FormLabel>
                        <FormControl>
                          <div className="bg-black border border-gray-600 p-1">
                            <div className="bg-gray-900 border border-gray-700 p-2 text-xs text-gray-500 font-mono">
                              SECURE_INPUT_BUFFER [ENCRYPTED]
                            </div>
                            <Textarea
                              placeholder="// Enter your anonymous message here
// Be honest, constructive, and respectful
// Your identity is completely protected"
                              className="resize-none h-40 bg-black border-0 text-green-400 placeholder-gray-600 focus:ring-0 focus:outline-none font-mono text-sm p-4"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-400 font-mono text-xs" />
                      </FormItem>
                    )}
                  />

                  {/* Status Bar */}
                  <div className="bg-gray-800 border border-gray-600 p-3">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-4 text-gray-400">
                        <span>BUFFER_SIZE: {content.length}/500</span>
                        <span>ENCRYPTION: AES-256</span>
                        <span>
                          STATUS: {content.trim() ? "READY" : "WAITING"}
                        </span>
                      </div>
                      <Button
                        type="submit"
                        disabled={isLoading || !content.trim()}
                        className="px-4 py-2 bg-green-900 border border-green-700 text-green-300 hover:bg-green-800 hover:border-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-mono text-xs"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                            TRANSMITTING...
                          </span>
                        ) : (
                          "[SEND_ANONYMOUS]"
                        )}
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          </div>

          <Separator className="my-8 bg-gray-800" />

          {/* System Advertisement */}
          <div className="bg-gray-900 border border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-800 border border-gray-600 flex items-center justify-center flex-shrink-0">
                <div className="w-6 h-6 bg-gray-600 transform rotate-45"></div>
              </div>
              <div>
                <h3 className="text-lg font-mono text-gray-200 mb-2">
                  DEPLOY_YOUR_OWN_SYSTEM
                </h3>
                <p className="text-gray-400 font-mono text-sm mb-4 leading-relaxed">
                  &gt; Initialize personal anonymous feedback endpoint
                  <br />
                  &gt; Enable secure message collection protocol
                  <br />
                  &gt; Access advanced anonymity features
                </p>
                <Button
                  asChild
                  className="bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-mono text-sm px-4 py-2"
                >
                  <a href="/sign-up">[INIT_PERSONAL_SYSTEM]</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
