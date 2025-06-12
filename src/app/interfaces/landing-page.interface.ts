export interface MediaItem {
  id: string;
  url: string;
  alt?: string;
  title?: string;
}

export interface ServiceCard {
  id?: string;
  title: string;
  image: string;
  link: string;
}

export interface VideoItem {
  id?: string;
  url: string;
  title?: string;
  description?: string;
}

export interface BrandItem {
  id: string;
  name: string;
  logo: string;
  image: string;
}

export interface CompareSection {
  beforeImage: string;
  afterImage: string;
  title?: string;
}

export interface LandingPageContent {
  hero: {
    logo: string;
    backgroundImage: string;
    mainTitle: string;
  };
  servicesCarousel: ServiceCard[];
  videos: VideoItem[];
  compareSection: CompareSection;
  brandsCarousel: BrandItem[];
}

export interface LandingPageSection {
  id: string;
  content: LandingPageContent;
  lastUpdated: Date;
} 