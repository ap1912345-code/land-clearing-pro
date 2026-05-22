import './styles/main.css';
import { Nav } from './components/nav';
import { Hero } from './components/hero';
import { Services } from './components/services';
import { Gallery } from './components/gallery';
import { Equipment } from './components/equipment';
import { Process } from './components/process';
import { Testimonials } from './components/testimonials';
import { LeadFormSection } from './components/lead-form';
import { Footer } from './components/footer';
import { wireLeadForms } from './lib/lead-form';
import { wireBeforeAfter } from './lib/before-after';
import { installPixels } from './lib/tracking';

const app = document.getElementById('app');
if (!app) throw new Error('#app root not found');

app.innerHTML = [
  Nav(),
  Hero(),
  Services(),
  Gallery(),
  Equipment(),
  Process(),
  Testimonials(),
  LeadFormSection(),
  Footer(),
].join('\n');

installPixels();
wireLeadForms();
wireBeforeAfter();
