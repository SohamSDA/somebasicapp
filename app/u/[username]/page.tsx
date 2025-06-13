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
      await axios.post<ApiResponse>(`/api/messages`, {
        username,
        content: data.content,
      });
      form.reset({ content: "" });
    } catch (err) {
      console.error(
        "Failed to send message:",
        (err as AxiosError<ApiResponse>).response?.data.message || err
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 max-w-lg">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">
            Send Anonymous Message to{" "}
            <span className="text-blue-600">@{username}</span>
          </h1>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your anonymous message here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !content}>
                  {isLoading ? "Sending..." : "Send"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator className="my-6" />
      <div className="text-center">
        <p className="mb-2">Want your own profile?</p>
        <Button asChild>
          <a href="/sign-up">Create Your Account</a>
        </Button>
      </div>
    </div>
  );
}
