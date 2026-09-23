import { Faq } from "@design-eg/ui";

export default function FaqExample() {
  return (
    <Faq
      eyebrow="Answers"
      title="Frequently asked questions"
      description="Everything teams ask before adopting the system."
      layout="split"
      type="single"
      defaultValue="license"
      aside={
        <a className="text-sm underline underline-offset-4" href="#">
          Still stuck? Talk to us.
        </a>
      }
      items={[
        {
          value: "license",
          question: "What is the licence?",
          answer: "MIT. Use it in commercial products, fork it, rename it.",
        },
        {
          value: "upgrade",
          question: "How do upgrades work if I copy the source?",
          answer:
            "Re-run npx @design-eg/cli add <name> and review the diff. The CLI never overwrites without asking.",
        },
        {
          value: "tailwind",
          question: "Do I need Tailwind v4?",
          answer:
            "Yes. The tokens ship as a Tailwind v4 theme, and the components are written against it.",
        },
      ]}
    />
  );
}
