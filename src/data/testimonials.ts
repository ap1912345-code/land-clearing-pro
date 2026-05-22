export type Testimonial = {
  quote: string;
  name: string;
  location: string;
  job: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'They cleared 6 acres of solid cedar in two days. Stayed off my live oaks, left the ground in better shape than I expected. Worth every dollar.',
    name: 'D. Ramirez',
    location: 'Burnet County, TX',
    job: 'Brush mulching, 6 acres',
  },
  {
    quote:
      'Got three quotes. They weren\'t the cheapest, but they were the only ones who actually walked the property with me. No surprises on the invoice.',
    name: 'K. Halverson',
    location: 'Llano, TX',
    job: 'Tree removal + stump grinding',
  },
  {
    quote:
      'Pulled a buried boulder the size of a Volkswagen out of my driveway path. Two other companies told me it couldn\'t be done without blasting.',
    name: 'M. Becker',
    location: 'Marble Falls, TX',
    job: 'Boulder removal + driveway cut',
  },
  {
    quote:
      'Rented their mini-ex for a weekend and they delivered Saturday morning, picked up Sunday night. Machine was clean and ready to work.',
    name: 'J. Tran',
    location: 'Round Mountain, TX',
    job: 'Excavator rental, weekend',
  },
];
