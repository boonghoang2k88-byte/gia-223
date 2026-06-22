export type Product = {
  id: string;
  slug: string;
  name: string;
  image: string;
  gallery?: string[];
  tag?: string | null;
  price: string;
  weight: string;
  shortDesc: string;
  longDesc?: string;
  order?: number;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  cover: string;
  excerpt: string;
  content: string;
  date: string;
};

export type Consultation = {
  id: string;
  name: string;
  phone: string;
  message: string;
  createdAt: string;
  handled?: boolean;
};

export type SiteSettings = {
  brandName: string;
  heroEyebrow: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  hotlineDisplay: string;
  hotlineTel: string;
  workingHours: string;
  zaloUrl: string;
  messengerUrl: string;
  address: string;
  email: string;
  facebookUrl: string;
  footerNote: string;
  heroVideoUrl: string;
};

export type SiteData = {
  settings: SiteSettings;
  products: Product[];
  blog: BlogPost[];
  consultations: Consultation[];
};