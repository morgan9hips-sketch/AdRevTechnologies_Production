export const contactEmail = 'admin@adrevtechnologies.com'

export const siteNavigation = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Partners', href: '/partners' },
  { label: 'Docs', href: '/docs' },
  { label: 'Contact', href: '/contact' },
  { label: 'Developers', href: '/developers' },
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
    { label: 'Developers', href: '/developers' },
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
    'Many companies continue to invest in traffic acquisition, yet the real constraint is rarely traffic itself. The true gap is the infrastructure required to convert demand into measurable commercial performance. Ad Rev Technologies addresses that gap with a unified foundation for monetisation, engagement, and growth.',
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
      'Track every impression, click, reward event, and conversion through immutable logs built for operators, agencies, and finance teams.',
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
      'Give operators and clients a complete event ledger with performance visibility, fraud resistance, and commercial reporting.',
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
    title: 'For Digital Agencies',
    points: [
      'Deploy once and scale the same system across clients.',
      'Add a new revenue layer to every managed account.',
      'Reduce build time from months to days.',
      'Sell measurable infrastructure outcomes, not disconnected reports.',
    ],
  },
] as const

export const foundingPartnerOffer = {
  name: 'Ad Rev Infrastructure',
  label: 'Launch Partner Access',
  headline: 'One Infrastructure. Every Revenue Channel.',
  subheadline:
    'Stop stitching tools together. Start monetising the users you already have.',
  standardMonthlyPrice: '$899/mo',
  discountedMonthlyPrice: '$499/mo',
  annualPrice: '$5,988',
  annualPriceMinor: 598800,
  annualSavings: '$4,800',
  accessWindow: '30–45 days',
  spotsLabel: 'Limited to 10 launch partners',
  spotsRemaining: 10,
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

export const mauPricingBands = [
  {
    id: 'founding_partner_0_500k',
    label: '0 to 500K MAU',
    price: '$5,988 / year',
    annualPriceMinor: 598800,
    actionLabel: 'Start Purchase',
    actionType: 'checkout',
    description:
      'Direct commercial purchase for launch-stage operators in the initial MAU band.',
  },
  {
    id: 'growth_500k_1_5m',
    label: '500K to 1.5M MAU',
    price: '$6,988 / year',
    annualPriceMinor: 698800,
    actionLabel: 'Start Purchase',
    actionType: 'checkout',
    description:
      'Direct commercial purchase for growth-stage operators in the mid-market band.',
  },
  {
    id: 'scale_1_5m_3m',
    label: '1.5M to 3M MAU',
    price: '$7,988 / year',
    annualPriceMinor: 798800,
    actionLabel: 'Start Purchase',
    actionType: 'checkout',
    description:
      'Direct commercial purchase for scaled operators requiring broader rollout support.',
  },
  {
    id: 'custom_3m_plus',
    label: '3M+ MAU',
    price: 'Custom partnership',
    actionLabel: 'Please Contact',
    actionType: 'contact',
    description:
      'Custom commercial structure for large-scale operators and agency networks.',
  },
] as const

export const pricingPrinciples = [
  'Base infrastructure access included',
  'Pricing scales in MAU bands',
  'No feature gating from day one',
  'Launch partner pricing remains fixed while active',
] as const

export const docsHighlights = [
  'Single API integration with predictable RESTful flows',
  'Signed webhooks for reward events and campaign attribution',
  'Quickstart examples for authentication, event ingestion, and callbacks',
  'Docs and developer portal aligned to production onboarding',
] as const

export const partnerPrograms = [
  {
    title: 'Platform Operators',
    description:
      'For consumer products, wallets, marketplaces, gaming platforms, and loyalty ecosystems that need monetisation without rebuilding core systems.',
  },
  {
    title: 'Digital Agencies',
    description:
      'For agencies that want to deploy one monetisation infrastructure layer across multiple client accounts and sell revenue outcomes at speed.',
  },
  {
    title: 'Strategic Growth Partners',
    description:
      'For organisations looking to co-deploy campaign, referral, and messaging infrastructure with long-term commercial upside.',
  },
] as const
