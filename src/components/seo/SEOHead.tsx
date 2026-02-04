import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
}

const defaultTitle = "Khatidana (খাঁটিদানা) | Pure & Organic Grains in Bangladesh";
const defaultDescription = "Discover pure, organic, and lab-tested grains, honey, and oils at Khatidana. Premium quality organic food delivered to your doorstep.";
const defaultImage = "https://khatidana.lovable.app/og-image.png";
const siteUrl = "https://khatidana.lovable.app";

export const SEOHead = ({
  title = defaultTitle,
  description = defaultDescription,
  image = defaultImage,
  url = siteUrl,
  type = "website",
  keywords = "organic food, grains, Bangladesh, premium food, natural products, খাঁটিদানা, জৈব খাদ্য, organic rice, pure honey, organic spices",
}: SEOHeadProps) => {
  const fullTitle = title === defaultTitle ? title : `${title} | Khatidana`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Khatidana" />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English, Bengali" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Khatidana" />
      <meta property="og:locale" content="en_BD" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@khatidana" />

      {/* Canonical URL */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
};
