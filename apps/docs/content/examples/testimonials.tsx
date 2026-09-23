import { TestimonialCard, Testimonials } from "@design-eg/ui";

const QUOTES = [
  {
    quote:
      "We swapped three half-finished component folders for one package and shipped the Arabic release two sprints early.",
    name: "Nour Hassan",
    role: "Head of Design, Nile Studio",
    fallback: "NH",
  },
  {
    quote:
      "The contrast gate caught a brand colour that would have shipped an unreadable button. That alone paid for the migration.",
    name: "Ahmed Mostafa",
    role: "Staff Engineer, Delta Foods",
    fallback: "AM",
  },
  {
    quote: "Every control already knew what to do in RTL. We wrote no direction-specific CSS.",
    name: "Sara Kamal",
    role: "Frontend Lead, Cairo Rail",
    fallback: "SK",
  },
];

export default function TestimonialsExample() {
  return (
    <Testimonials columns={3}>
      {QUOTES.map((item) => (
        <TestimonialCard
          key={item.name}
          quote={item.quote}
          name={item.name}
          role={item.role}
          avatar={{ fallback: item.fallback }}
        />
      ))}
    </Testimonials>
  );
}
