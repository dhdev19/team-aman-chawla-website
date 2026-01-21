/**
 * Property Types
 */
export const PROPERTY_TYPES = {
  RESIDENTIAL: "residential",
  PLOT: "plot",
  COMMERCIAL: "commercial",
  OFFICES: "offices",
} as const;

export type PropertyType = (typeof PROPERTY_TYPES)[keyof typeof PROPERTY_TYPES];

/**
 * Navbar Items
 */
export const NAVBAR_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "New Launch", href: "/new-launch" },
  {
    label: "Properties",
    href: "/properties",
    submenu: [
      { label: "Residential", href: "/properties?type=residential" },
      { label: "Plot", href: "/properties?type=plot" },
      { label: "Commercial", href: "/properties?type=commercial" },
      { label: "Offices", href: "/properties?type=offices" },
    ],
  },
  // { label: "Refer", href: "/refer" },
  // { label: "Enquiry", href: "/enquiry" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
  // { label: "TAC Registration", href: "/tac-registration" },
] as const;

/**
 * Routes
 */
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  NEW_LAUNCH: "/new-launch",
  PROPERTIES: "/properties",
  REFER: "/refer",
  ENQUIRY: "/enquiry",
  BLOGS: "/blogs",
  CONTACT: "/contact",
  TAC_REGISTRATION: "/tac-registration",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/admin/login",
} as const;

/**
 * Pagination Defaults
 */
export const PAGINATION = {
  PROPERTIES_PER_PAGE: 25,
  VIDEOS_PER_PAGE: 10,
  BLOGS_PER_PAGE: 12,
} as const;

/**
 * Property Status
 */
export const PROPERTY_STATUS = {
  AVAILABLE: "available",
  SOLD: "sold",
  RESERVED: "reserved",
} as const;

export type PropertyStatus = (typeof PROPERTY_STATUS)[keyof typeof PROPERTY_STATUS];
