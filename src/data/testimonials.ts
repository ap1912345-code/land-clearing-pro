export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  job: string;
  // Approximate town coords — used to sort testimonials nearest-first to the
  // visitor when we can resolve their geo on the client.
  lat: number;
  lon: number;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They cleared 4 acres of overgrown brush and saplings in two days. Worked around my old sugar maples like I asked. Property looks better than it has in decades.',
    name: 'D. McAllister',
    location: 'Hubbardston, MA',
    job: 'Brush mulching, 4 acres',
    lat: 42.4737, lon: -72.0089,
  },
  {
    quote:
      'Got three quotes. They weren\'t the cheapest, but they were the only ones who actually walked the property with me. No surprises on the invoice.',
    name: 'K. Halverson',
    location: 'Princeton, MA',
    job: 'Tree removal + stump grinding',
    lat: 42.4537, lon: -71.8775,
  },
  {
    quote:
      'Pulled a buried granite boulder the size of a refrigerator out of my driveway path. Two other companies told me it couldn\'t be done without blasting.',
    name: 'M. Becker',
    location: 'Templeton, MA',
    job: 'Boulder removal + driveway cut',
    lat: 42.5564, lon: -72.0628,
  },
  {
    quote:
      'Rented their mini-ex for a weekend and they delivered Saturday morning, picked up Sunday night. Machine was clean and ready to work.',
    name: 'J. Sullivan',
    location: 'Westminster, MA',
    job: 'Excavator rental, weekend',
    lat: 42.5479, lon: -71.9095,
  },
];
