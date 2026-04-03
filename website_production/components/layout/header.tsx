const navigation = [
  { name: 'How It Works', href: '/#how-it-works' },
  { name: 'Pricing', href: '/#pricing' },
  { name: 'Docs', href: '/docs' },
  { name: 'Developers', href: '/developers' },
  { name: 'Platform', href: '/platform/analytics', highlight: true },
  { name: 'Partners', href: '/partners' },
];

// Other code...
// Rendering navigation links
navigation.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className={`text-sm font-semibold leading-6 transition-colors flex items-center gap-1.5 ${
      pathname?.startsWith('/platform')
        ? item.href.startsWith('/platform') ? 'text-[#3b82f6]' : 'text-[#94a3b8] hover:text-[#f1f5f9]'
        : pathname === item.href
        ? 'text-[#3b82f6]'
        : 'text-[#94a3b8] hover:text-[#f1f5f9]'
    }`}
  >
    {item.highlight && (
      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" />
    )}
    {item.name}
  </Link>
));

// Mobile menu rendering
secondNavigation.map((item) => (
  <Link
    key={item.name}
    href={item.href}
    className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium text-[#94a3b8] hover:bg-[#1e2d4a] hover:text-[#f1f5f9] transition-colors"
    onClick={() => setMobileMenuOpen(false)}
  >
    {item.highlight && (
      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] flex-shrink-0" />
    )}
    {item.name}
  </Link>
));