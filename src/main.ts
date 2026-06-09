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
import { detectLocalization, applyLocalization } from './lib/geo';

const app = document.getElementById('app');
if (!app) throw new Error('#app root not found');

// Ads often point to "/#lead-form" to pre-scroll the form into view on
// desktop. Because we mount the DOM lazily, mobile browsers (iOS Safari in
// particular) resolve that fragment AFTER innerHTML runs and jump past the
// hero — visitors land at the bottom of the page on first open. Strip the
// hash and pin the scroll position to the top here. In-page CTAs still work
// because they fire after mount.
if (location.hash) {
  history.replaceState(null, '', location.pathname + location.search);
}
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

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

window.scrollTo(0, 0);

installPixels();
wireLeadForms();
wireBeforeAfter();
detectLocalization().then(applyLocalization);
