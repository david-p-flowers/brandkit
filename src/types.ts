export interface WritingRule {
  id: string;
  name: string;
  description: string;
  tags: string[];
}

export interface BrandFoundations {
  brandName: string;
  brandDomain: string;
  brandIcon?: string; // URL or icon name
  brandHeaderImage?: string; // URL or base64 data URL for uploaded header image
  brandColors?: {
    primary?: string;
    secondary?: string;
    accent?: string;
  };
  aboutYourBrand: string;
  brandStoryAndPurpose: string;
  brandToneAndVoice: string;
  writingRules: WritingRule[];
}

export interface Competitor {
  name: string;
  domain: string;
  regions: string[];
}

export interface ProductLine {
  name?: string;
  productLineDetails: string;
  keyDifferentiatorsAndPositioning: string;
  idealCustomers: string;
  competitors: Competitor[];
  icon?: string;
  color?: string;
}

export interface Sample {
  title?: string;
  body: string;
  notes?: string;
  tags?: string[];
}

export interface ContentType {
  name?: string;
  samples: Sample[];
  brandToneAndVoice: string;
  contentTypeRules: WritingRule[];
  icon?: string;
  color?: string;
}

export interface Audience {
  name?: string;
  description: string;
  writingRules: WritingRule[];
  icon?: string;
  color?: string;
}

export interface Region {
  name?: string;
  description: string;
  writingRules: WritingRule[];
  flag?: string; // Emoji flag or custom icon
  color?: string; // Optional custom color
}

export interface Example {
  title?: string;
  body: string;
  notes?: string;
}

export interface BrandKitSchema {
  brandFoundations: BrandFoundations;
  productLines: ProductLine[];
  contentTypes: ContentType[];
  audiences: Audience[];
  regions: Region[];
  examples: Example[];
  writingRules: WritingRule[];
}

