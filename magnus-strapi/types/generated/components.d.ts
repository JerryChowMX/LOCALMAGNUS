import type { Schema, Struct } from '@strapi/strapi';

export interface AiAudioSummary extends Struct.ComponentSchema {
  collectionName: 'components_ai_audio_summaries';
  info: {
    description: 'AI-generated podcast audio version';
    displayName: 'Podcast Summary';
    icon: 'headphones';
  };
  attributes: {
    audio_file: Schema.Attribute.Media<'audios'>;
    episode_label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'EPISODIO'>;
    file_size: Schema.Attribute.Integer;
    generated_at: Schema.Attribute.DateTime;
    podcast_title: Schema.Attribute.String;
    voice: Schema.Attribute.Enumeration<['male', 'female', 'neural']> &
      Schema.Attribute.DefaultTo<'neural'>;
  };
}

export interface AiInfographicSummary extends Struct.ComponentSchema {
  collectionName: 'components_ai_infographic_summaries';
  info: {
    description: 'Infographic visual summary';
    displayName: 'Infograf\u00EDa Summary';
    icon: 'picture';
  };
  attributes: {
    file_size: Schema.Attribute.Integer;
    generated_at: Schema.Attribute.DateTime;
    image_file: Schema.Attribute.Media<'images'>;
  };
}

export interface AiPptSummary extends Struct.ComponentSchema {
  collectionName: 'components_ai_ppt_summaries';
  info: {
    description: 'PowerPoint/Presentation summary';
    displayName: 'Presentaci\u00F3n Summary';
    icon: 'slideshow';
  };
  attributes: {
    file_size: Schema.Attribute.Integer;
    generated_at: Schema.Attribute.DateTime;
    ppt_file: Schema.Attribute.Media<'files'>;
    slide_count: Schema.Attribute.Integer;
  };
}

export interface AiVideoSummary extends Struct.ComponentSchema {
  collectionName: 'components_ai_video_summaries';
  info: {
    description: 'Short video summary';
    displayName: 'Video Summary';
    icon: 'play';
  };
  attributes: {
    duration_seconds: Schema.Attribute.Integer;
    file_size: Schema.Attribute.Integer;
    generated_at: Schema.Attribute.DateTime;
    resolution: Schema.Attribute.Enumeration<
      ['HD_720p', 'HD_1080p', 'UHD_4k']
    > &
      Schema.Attribute.DefaultTo<'HD_1080p'>;
    thumbnail: Schema.Attribute.Media<'images'>;
    video_file: Schema.Attribute.Media<'videos'>;
  };
}

export interface ContentAudio extends Struct.ComponentSchema {
  collectionName: 'components_content_audios';
  info: {
    description: 'Article audio (Text-to-Speech or Uploaded)';
    displayName: 'audio';
    icon: 'music';
  };
  attributes: {
    file: Schema.Attribute.Media<'files' | 'videos' | 'audios'> &
      Schema.Attribute.Required;
    title: Schema.Attribute.String;
  };
}

export interface ContentEmbed extends Struct.ComponentSchema {
  collectionName: 'components_content_embeds';
  info: {
    description: 'Social media or video embed';
    displayName: 'Embed';
    icon: 'code';
  };
  attributes: {
    embed_code: Schema.Attribute.Text;
    embed_type: Schema.Attribute.Enumeration<
      ['youtube', 'twitter', 'instagram', 'facebook', 'tiktok', 'custom']
    > &
      Schema.Attribute.DefaultTo<'custom'>;
    embed_url: Schema.Attribute.String;
  };
}

export interface ContentGallery extends Struct.ComponentSchema {
  collectionName: 'components_content_galleries';
  info: {
    description: 'Image gallery';
    displayName: 'Gallery';
    icon: 'images';
  };
  attributes: {
    caption: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<['grid', 'carousel', 'masonry']> &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface ContentIllustrations extends Struct.ComponentSchema {
  collectionName: 'components_content_illustrations';
  info: {
    description: 'Illustration images for articles';
    displayName: 'Illustrations';
    icon: 'paintBrush';
  };
  attributes: {
    alt_text: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'carousel', 'single', 'side-by-side']
    > &
      Schema.Attribute.DefaultTo<'grid'>;
  };
}

export interface ContentInfographics extends Struct.ComponentSchema {
  collectionName: 'components_content_infographics';
  info: {
    description: 'Infographic images for data visualization';
    displayName: 'Infographics';
    icon: 'chartLine';
  };
  attributes: {
    alt_text: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
    layout: Schema.Attribute.Enumeration<
      ['grid', 'carousel', 'single', 'stacked']
    > &
      Schema.Attribute.DefaultTo<'single'>;
    source: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface ContentQuote extends Struct.ComponentSchema {
  collectionName: 'components_content_quotes';
  info: {
    description: 'Blockquote or pull quote';
    displayName: 'Quote';
    icon: 'quote-right';
  };
  attributes: {
    author: Schema.Attribute.String;
    author_title: Schema.Attribute.String;
    quote_text: Schema.Attribute.Text & Schema.Attribute.Required;
    style: Schema.Attribute.Enumeration<
      ['default', 'highlighted', 'pullquote']
    > &
      Schema.Attribute.DefaultTo<'default'>;
  };
}

export interface ContentRichText extends Struct.ComponentSchema {
  collectionName: 'components_content_rich_texts';
  info: {
    description: 'Text block with formatting';
    displayName: 'Rich Text';
    icon: 'align-left';
  };
  attributes: {
    content: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ContentSingleImage extends Struct.ComponentSchema {
  collectionName: 'components_content_single_images';
  info: {
    description: 'A single image with caption and display options';
    displayName: 'Single Image';
    icon: 'picture';
  };
  attributes: {
    alt_text: Schema.Attribute.Text;
    caption: Schema.Attribute.Text;
    credit: Schema.Attribute.String;
    display_style: Schema.Attribute.Enumeration<
      ['full-width', 'centered', 'standard-border']
    > &
      Schema.Attribute.DefaultTo<'full-width'>;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface SeoSeoMeta extends Struct.ComponentSchema {
  collectionName: 'components_seo_seo_metas';
  info: {
    description: 'Search Engine Optimization fields';
    displayName: 'SEO Meta';
    icon: 'search';
  };
  attributes: {
    canonical_url: Schema.Attribute.String;
    meta_description: Schema.Attribute.Text &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 160;
      }>;
    meta_title: Schema.Attribute.String &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 60;
      }>;
    og_description: Schema.Attribute.Text;
    og_image: Schema.Attribute.Media<'images'>;
    og_title: Schema.Attribute.String;
    twitter_card: Schema.Attribute.Enumeration<
      ['summary', 'summary_large_image']
    > &
      Schema.Attribute.DefaultTo<'summary_large_image'>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'ai.audio-summary': AiAudioSummary;
      'ai.infographic-summary': AiInfographicSummary;
      'ai.ppt-summary': AiPptSummary;
      'ai.video-summary': AiVideoSummary;
      'content.audio': ContentAudio;
      'content.embed': ContentEmbed;
      'content.gallery': ContentGallery;
      'content.illustrations': ContentIllustrations;
      'content.infographics': ContentInfographics;
      'content.quote': ContentQuote;
      'content.rich-text': ContentRichText;
      'content.single-image': ContentSingleImage;
      'seo.seo-meta': SeoSeoMeta;
    }
  }
}
