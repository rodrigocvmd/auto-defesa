import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  keywords,
  canonical,
  type = 'website'
}) => {
  const siteName = 'AutoDefesa';
  const defaultDescription = 'Seu Advogado Virtual de Trânsito. Recorra de multas de trânsito com Inteligência Artificial. Defesa prévia, JARI e CETRAN.';
  const baseUrl = 'https://meuautodefesa.com.br';

  const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Recorra de Multas com IA`;
  const fullDescription = description || defaultDescription;
  const fullUrl = canonical ? `${baseUrl}${canonical}` : baseUrl;

  // Schema.org JSON-LD para SoftwareApplication
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AutoDefesa",
    "applicationCategory": "LegalApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "16.90",
      "priceCurrency": "BRL"
    },
    "description": fullDescription,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook / WhatsApp */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:image" content={`${baseUrl}/og-image.jpg`} /> {/* Ideal: Criar uma imagem og-image.jpg em public/ */}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default SEO;
