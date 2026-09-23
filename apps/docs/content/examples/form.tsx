"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Button,
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Textarea,
} from "@design-eg/ui";

const schema = z.object({
  handle: z.string().min(3, "Your handle must be at least 3 characters."),
  bio: z.string().max(140, "Keep the bio under 140 characters.").optional(),
  updates: z.boolean(),
});

type Values = z.infer<typeof schema>;

export default function FormExample() {
  const [saved, setSaved] = React.useState<Values | null>(null);
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { handle: "", bio: "", updates: true },
  });

  return (
    <Form {...form}>
      <form
        className="grid max-w-md gap-5"
        onSubmit={form.handleSubmit((values) => setSaved(values))}
      >
        <FormField
          control={form.control}
          name="handle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Handle</FormLabel>
              <FormControl>
                <Input placeholder="ahmed" {...field} />
              </FormControl>
              <FormDescription>This is your public name across the product.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Ships design systems." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="updates"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center gap-3">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel className="cursor-pointer font-normal">
                Email me about product updates
              </FormLabel>
            </FormItem>
          )}
        />
        <Button type="submit" className="justify-self-start">
          Save profile
        </Button>
        {saved ? (
          <p className="text-sm text-success" role="status">
            Saved {saved.handle}.
          </p>
        ) : null}
      </form>
    </Form>
  );
}
