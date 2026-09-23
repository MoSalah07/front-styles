import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { describe, expect, it } from "vitest";
import * as z from "zod";
import { Input } from "./input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
});

type Values = z.infer<typeof schema>;

function TestForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { username: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="ahmed" {...field} />
              </FormControl>
              <FormDescription>Your public handle.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Submit</button>
      </form>
    </Form>
  );
}

describe("Form", () => {
  it("binds the label to the input", () => {
    render(<TestForm />);
    const input = screen.getByLabelText("Username");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id");
    expect(input.getAttribute("aria-describedby")).toContain("form-item-description");
  });

  it("shows the zod validation message on submit", async () => {
    render(<TestForm />);

    await userEvent.type(screen.getByLabelText("Username"), "ab");
    await userEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByText("Username must be at least 3 characters")).toBeInTheDocument();

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("Username")).toHaveAttribute("data-error", "true");
  });
});
