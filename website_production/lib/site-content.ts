export const contactEmail = 'admin@adrevtechnologies.com'

export const siteNavigation = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Partners', href: '/partners' },
  { label: 'Docs', href: '/docs' },
  { label: 'Contact', href: '/contact' },
] as const

export const footerLinkGroups = {
  company: [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Partners', href: '/partners' },
  ],
  resources: [
    { label: 'Docs', href: '/docs' },
    { label: 'Contact', href: '/contact' },
    { label: 'Email Support', href: `mailto:${contactEmail}` },
  ],
  legal: [
    { label: 'Terms', href: '/terms' },
    { label: 'Privacy', href: '/privacy' },
    { label: 'Cookies', href: '/cookies' },
  ],
} as const

export const homeValuePoints = [
  'Go live in days, not months',
  'Monetise existing users instantly',
  'Replace 5 to 10 disconnected tools',
  'Full attribution and audit trail',
  'Your platform. Your data. Always',
] as const

export const heroContent = {
  headline: "The infrastructure that makes tomorrow's growth happen today.",
  subheadline:
    'Many companies continue to invest in traffic acquisition, yet the real constraint is rarely traffic itself. The true gap is the infrastructure required to convert demand into measurable growth performance. Ad Rev Technologies addresses that gap with a unified foundation for monetisation, engagement, and growth.',
  supportingText:
    'Ad Rev Technologies is a unified engagement and monetisation layer that connects advertising, referrals, campaigns, messaging, and analytics through a single API. No rebuild of your core platform. No exposure to customer data. No unnecessary operational complexity.',
} as const

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Connect one infrastructure layer',
    description:
      'Plug Ad Rev into your platform with a single API and event-driven webhook flow. No rebuild, no database exposure, no auth handoff.',
  },
  {
    step: '02',
    title: 'Activate every revenue channel',
    description:
      'Run rewarded ads, referral loops, campaign triggers, messaging distribution, and attribution from one operating layer instead of stitched tools.',
  },
  {
    step: '03',
    title: 'Capture revenue and insight fast',
    description:
      'Track every impression, click, reward event, and conversion through immutable logs built for visibility, accountability, and growth.',
  },
] as const

export const productModules = [
  {
    title: 'Rewarded Engagement Flows',
    description:
      'Server-verified engagement flows that connect campaign actions to measurable revenue and loyalty outcomes.',
  },
  {
    title: 'Referral Engine',
    description:
      'Conversion-aware referral flows with traceable links, rule-based rewards, and campaign attribution.',
  },
  {
    title: 'Campaign Routing',
    description:
      'Push users from campaigns into store redirects, landing flows, or product offers with attribution preserved end to end.',
  },
  {
    title: 'Messaging Flows',
    description:
      'Trigger WhatsApp and email distribution from the same infrastructure layer used to run monetisation and engagement.',
  },
  {
    title: 'Analytics and Audit Trail',
    description:
      'Give every stakeholder a complete event ledger with performance visibility, fraud resistance, and accountable reporting.',
  },
] as const

export const audienceCards = [
  {
    title: 'For Platforms',
    points: [
      'Turn your existing user base into a revenue engine.',
      'Increase retention through incentivised engagement.',
      'Launch campaigns without new engineering overhead.',
      'Track every action from impression to conversion.',
    ],
  },
  {
    title: 'For Partners',
    points: [
      'Extend one platform across client, brand, or portfolio environments.',
      'Unify monetisation, engagement, and attribution in one system.',
      'Launch revenue-capable infrastructure without fragmented tooling.',
      'Present measurable growth outcomes through a single enterprise layer.',
    ],
  },
] as const

export const foundingPartnerOffer = {
  name: 'Ad Rev Infrastructure',
  label: 'Priority Early Access Offer',
  headline: 'One Infrastructure. Every Revenue Channel.',
  subheadline:
    'Stop stitching tools together. Start monetising the users you already have.',
  standardMonthlyPrice: '$899/mo',
  discountedMonthlyPrice: '$499/mo',
  annualPrice: '$5,988',
  annualPriceMinor: 598800,
  annualSavings: '$4,800',
  accessWindow: '30–45 days',
  spotsLabel:
    'Priority early-access pricing at $5,988 per year is reserved for the first three qualifying annual subscriptions, with no MAU ceiling during the current offer window.',
  spotsRemaining: 3,
  spotsTotal: 3,
  features: [
    'Rewarded engagement workflows with server-side verification',
    'Referral systems with real-time conversion tracking',
    'Campaign engine plus store redirect attribution',
    'WhatsApp and email distribution flows',
    'Secure webhook-driven reward execution',
    'Advanced analytics with immutable audit trails',
    'Platform blending aligned to your brand',
  ],
} as const

export const pricingCommercialTerms = {
  revenueShareLabel: 'Revenue share through the engine',
  revenueShareValue: '10%',
  revenueShareBody:
    'Ad Rev retains 10% of revenue generated through the engine while your contracted infrastructure rate remains fixed for as long as the subscription stays active.',
  availabilityLabel: 'Early-access availability',
  availabilityHeadline: 'Reserved for the first three annual subscriptions.',
  availabilityBody:
    'Secure one of the 3 early-access positions on the introductory $5,988 annual rate before the current offer window closes.',
} as const

export const mauPricingBands = [
  {
    id: 'founding_partner_0_500k',
    label: '0 to 500K MAU',
    price: '$5,988 / year',
    originalPrice: '$10,988 / year',
    annualPriceMinor: 598800,
    actionLabel: 'Secure Early Access',
    ribbonLabel: 'Special Offer',
    actionType: 'checkout',
    description:
      'Annual infrastructure pricing for launch-stage platforms in the initial MAU band.',
  },
  {
    id: 'growth_500k_1_5m',
    label: '500K to 1.5M MAU',
    price: '$6,988 / year',
    originalPrice: '$11,988 / year',
    annualPriceMinor: 698800,
    actionLabel: 'Secure Early Access',
    ribbonLabel: 'Special Offer',
    actionType: 'checkout',
    description:
      'Annual infrastructure pricing for growth-stage platforms in the mid-market band.',
  },
  {
    id: 'scale_1_5m_3m',
    label: '1.5M to 3M MAU',
    price: '$7,988 / year',
    originalPrice: '$12,988 / year',
    annualPriceMinor: 798800,
    actionLabel: 'Secure Early Access',
    ribbonLabel: 'Special Offer',
    actionType: 'checkout',
    description:
      'Annual infrastructure pricing for scaled environments requiring broader integration support.',
  },
  {
    id: 'custom_3m_plus',
    label: '3M+ MAU',
    price: 'Custom partnership',
    actionLabel: 'Please Contact',
    actionType: 'contact',
    description:
      'Custom pricing structure for large-scale platforms and partner networks.',
  },
] as const

export const pricingPrinciples = [
  'Base infrastructure access included',
  'Pricing scales in MAU bands',
  'No feature gating from day one',
  'Priority early-access pricing remains fixed while active',
] as const

export const docsHighlights = [
  'Single API integration with predictable RESTful flows',
  'Signed webhooks for reward events and campaign attribution',
  'Quickstart examples for authentication, event ingestion, and callbacks',
  'Technical guidance designed for secure enterprise deployment',
] as const

export const partnerPrograms = [
  {
    title: 'Platform Teams',
    description:
      'For consumer products, wallets, marketplaces, gaming platforms, and loyalty ecosystems that need monetisation without rebuilding core systems.',
  },
  {
    title: 'Partner Networks',
    description:
      'For organisations extending one monetisation infrastructure layer across client accounts, brand portfolios, or regional operating environments.',
  },
  {
    title: 'Strategic Growth Partners',
    description:
      'For organisations looking to co-deploy campaign, referral, and messaging infrastructure with long-term revenue and engagement upside.',
  },
] as const
