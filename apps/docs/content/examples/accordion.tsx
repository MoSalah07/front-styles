import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@design-eg/ui";

const ITEMS = [
  {
    value: "tokens",
    question: "Where do the colours come from?",
    answer:
      "Every brand is one JSON seed. The compiler derives OKLCH ramps, maps them onto semantic roles for light and dark, and fails the build if a text pair falls under WCAG AA.",
  },
  {
    value: "rtl",
    question: "Do I have to do anything for Arabic?",
    answer:
      'Set dir="rtl" on <html>. Components use logical properties throughout, so padding, borders and icons mirror themselves.',
  },
  {
    value: "ownership",
    question: "Can I own the source?",
    answer:
      "Yes. Install the npm package, or copy any item into your repo with npx @design-eg/cli add <name>. Both paths give the same component.",
  },
];

export default function AccordionExample() {
  return (
    <Accordion type="single" collapsible defaultValue="tokens" className="max-w-2xl">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
