export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  job: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They cleared 4 acres of overgrown brush and saplings in two days. Worked around my old sugar maples like I asked. Property looks better than it has in decades.',
    name: 'D. McAllister',
    location: 'Hubbardston, MA',
    job: 'Brush mulching, 4 acres',
  },
  {
    quote:
      'Got three quotes. They weren\'t the cheapest, but they were the only ones who actually walked the property with me. No surprises on the invoice.',
    name: 'K. Halverson',
    location: 'Princeton, MA',
    job: 'Tree removal + stump grinding',
  },
  {
    quote:
      'Pulled a buried granite boulder the size of a refrigerator out of my driveway path. Two other companies told me it couldn\'t be done without blasting.',
    name: 'M. Becker',
    location: 'Templeton, MA',
    job: 'Boulder removal + driveway cut',
  },
  {
    quote:
      'Rented their mini-ex for a weekend and they delivered Saturday morning, picked up Sunday night. Machine was clean and ready to work.',
    name: 'J. Sullivan',
    location: 'Westminster, MA',
    job: 'Excavator rental, weekend',
  },
];
