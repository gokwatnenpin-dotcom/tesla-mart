// ─── Shared SVG icon library for TeslaMart ───────────────
// Usage: <Icons.Cart size={22} />

const defaultSize = 20;

const base = (size, style) => ({
  width: size,
  height: size,
  style,
  "aria-hidden": true,
});

export const Icons = {
  // Brand logo (Tesla T mark)
  Logo: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 254.6 253.5" fill="currentColor" xmlSpace="preserve">
      <path d="m127.26 253.003 35.5-199.5c33.8 0 44.5 3.7 46 18.8 0 0 22.7-8.5 34.1-25.6-44.6-20.7-89.5-21.6-89.5-21.6l-26.2 31.9h.1l-26.1-31.9s-44.9.9-89.5 21.6c11.4 17.2 34.1 25.6 34.1 25.6 1.5-15.1 12.2-18.8 45.8-18.9z"/>
      <path d="M127.26 15.903c36.1-.3 77.4 5.6 119.7 24 5.7-10.2 7.1-14.7 7.1-14.7-46.2-18.3-89.5-24.5-126.8-24.7-37.2.2-80.5 6.4-126.8 24.7 0 0 2.1 5.5 7.1 14.7 42.3-18.5 83.6-24.3 119.7-24"/>
    </svg>
  ),

  // Legacy alias
  Bolt: ({ size = defaultSize, style } = {}) => (
    <Icons.Logo size={size} style={style} />
  ),

  Cart: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),

  Menu: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6"  x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),

  Close: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6"  x2="6"  y2="18"/>
      <line x1="6"  y1="6"  x2="18" y2="18"/>
    </svg>
  ),

  Plus: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5"  y1="12" x2="19" y2="12"/>
    </svg>
  ),

  Check: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),

  Alert: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),

  Info: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8"  x2="12.01" y2="8"/>
    </svg>
  ),

  StarFilled: ({ size = 16, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),

  StarEmpty: ({ size = 16, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),

  ArrowLeft: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),

  ArrowRight: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),

  Car: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-2"/>
      <circle cx="7.5" cy="17.5" r="2.5"/>
      <circle cx="17.5" cy="17.5" r="2.5"/>
      <path d="M5 9l2-4h8l3 4"/>
    </svg>
  ),

  Zap: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),

  Tool: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  ),

  Shirt: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.57a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.57a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  ),

  Battery: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="6" width="18" height="12" rx="2" ry="2"/>
      <line x1="23" y1="13" x2="23" y2="11"/>
      <line x1="6"  y1="10" x2="6"  y2="14"/>
      <line x1="10" y1="10" x2="10" y2="14"/>
    </svg>
  ),

  Package: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  ),

  ShoppingBag: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  ),

  CreditCard: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),

  Globe: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
    </svg>
  ),

  Bitcoin: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.5 8h4.2a2.3 2.3 0 0 1 0 4.6H9.5M9.5 12.6h4.5a2.2 2.2 0 0 1 0 4.4H9.5M10.2 7.2v1.2M13.2 7.2v1.2M10.2 15.6v1.2M13.2 15.6v1.2M9.5 8v9"/>
    </svg>
  ),

  Cpu: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="2"/>
      <rect x="9" y="9" width="6" height="6"/>
      <line x1="9"  y1="1"  x2="9"  y2="4"/>
      <line x1="15" y1="1"  x2="15" y2="4"/>
      <line x1="9"  y1="20" x2="9"  y2="23"/>
      <line x1="15" y1="20" x2="15" y2="23"/>
      <line x1="20" y1="9"  x2="23" y2="9"/>
      <line x1="20" y1="14" x2="23" y2="14"/>
      <line x1="1"  y1="9"  x2="4"  y2="9"/>
      <line x1="1"  y1="14" x2="4"  y2="14"/>
    </svg>
  ),

  Trash: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, style)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
      <path d="M10 11v6"/>
      <path d="M14 11v6"/>
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),

  Spinner: ({ size = defaultSize, style } = {}) => (
    <svg {...base(size, { animation: "spin 0.8s linear infinite", ...style })} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
  ),
};

export default Icons;
