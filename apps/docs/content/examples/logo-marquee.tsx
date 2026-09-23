import { LogoMarquee, LogoMarqueeItem } from "@design-eg/ui";

const CUSTOMERS = [
  "Nile Studio",
  "Delta Foods",
  "Cairo Rail",
  "Luxor Labs",
  "Red Sea Air",
  "Alex Bank",
];

export default function LogoMarqueeExample() {
  return (
    <LogoMarquee label="Customers" speed={30} pauseOnHover fade>
      {CUSTOMERS.map((name) => (
        <LogoMarqueeItem key={name}>
          <span className="font-display text-xl tracking-wide whitespace-nowrap">{name}</span>
        </LogoMarqueeItem>
      ))}
    </LogoMarquee>
  );
}
