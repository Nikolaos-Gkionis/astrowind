import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'PaaS',
      href: getPermalink('/paas'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Pricing',
      href: getPermalink('/pricing'),
    },
    {
      text: 'Contact',
      href: getPermalink('/contact'),
    },
  ],
  actions: [{ text: 'Download', href: 'https://github.com/onwidget/astrowind', target: '_blank' }],
};

export const footerData = {
  links: [
    {
      title: 'Product',
      links: [
        { text: 'Pricing', href: '/pricing' },
        { text: 'Subscription', href: '/paas' },
      ],
    },
    {
      title: 'Platform',
      links: [
        { text: 'Social Impact', href: '/landing/lead-generation' },
        { text: 'Net Zero', href: 'landing/product' },
      ],
    },
    {
      title: 'Support',
      links: [
        { text: 'Contact', href: '/contact' },
        { text: 'FAQs', href: 'landing/faq' },
      ],
    },
  ],
  secondaryLinks: [
    { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/Nikolaos-Gkionis' },
  ],
  footNote: `
    <span class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm bg-[url/assets/favicons/apple-touch-icon.png)]"></span>
    Made by <a class="text-blue-600 underline dark:text-muted" href="https://understairs.ltd/"> Understairs Ltd</a> · All rights reserved.
  `,
};
