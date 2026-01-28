export interface Testimonial {
  quote: string;
  role: string;
}

export const testimonials: Testimonial[] = [
  {
    quote: "Getting multiple perspectives in one confidential session helped us pressure-test our plan and align on the right path forward—without getting anchored to a single vendor narrative.",
    role: "VP Engineering, Financial Services",
  },
  {
    quote: "We walked in with competing opinions. Hearing different approaches side by side clarified the trade-offs and accelerated alignment across security, platform, and delivery teams.",
    role: "Director, Platform Engineering, Healthcare",
  },
  {
    quote: "The biggest value was speed. We compared architectures and operating models across providers in a single forum and left with a clearer sequence for modernization.",
    role: "Head of Cloud & Infrastructure, Manufacturing",
  },
];
