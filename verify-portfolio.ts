import { getPayload } from 'payload';
import config from '@payload-config';

(async () => {
  const payload = await getPayload({ config: config.default });
  const homePage = await payload.findGlobal({ slug: 'home-page', depth: 2 });
  const projects = homePage.portfolioSection?.projects || [];
  console.log('Portfolio Projects:');
  projects.forEach((p: any, i: number) => {
    console.log(\\. \\);
    if (p.heroImage) {
      if (typeof p.heroImage === 'object' && p.heroImage.url) {
        console.log(\   Image URL: \\);
        console.log(\   Filename: \\);
      } else {
        console.log(\   Image ID: \\);
      }
    } else {
      console.log('   âŒ NO IMAGE');
    }
  });
  process.exit(0);
})();
