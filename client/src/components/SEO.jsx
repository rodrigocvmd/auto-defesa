import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({
	title,
	description,
	keywords,
	canonical,
	type = "website",
	faq,
	isHome = false,
	structuredData: extraStructuredData,
}) => {
	const siteName = "Auto Defesa - Recursos de Trânsito";
	// Descrição padrão focada na autoridade e especialidade
	const defaultDescription =
		"Auto Defesa - Recursos de Trânsito: A autoridade em recursos de multas com IA. Tecnologia jurídica avançada para anular infrações e proteger sua CNH com base no CTB.";
	const baseUrl = "https://meuautodefesa.com.br";

	const fullTitle = title ? `${title} | ${siteName}` : `${siteName} com IA`;
	const fullDescription = description || defaultDescription;

	const formattedCanonical = canonical
		? canonical.startsWith("/")
			? canonical
			: `/${canonical}`
		: "";
	const fullUrl = `${baseUrl}${formattedCanonical}`;

	// Schema.org JSON-LD para SoftwareApplication
	const softwareAppData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Auto Defesa - Recursos de Trânsito",
		applicationCategory: "LegalApplication",
		operatingSystem: "Windows, macOS, Android, iOS, Web",
		image: "https://meuautodefesa.com.br/logoLeve.jpeg",
		description: fullDescription,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "BRL",
		},
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "4.9",
			ratingCount: "493",
		},
		author: {
			"@type": "Person",
			name: "Rodrigo Carvalho",
			jobTitle: "Especialista em Direito de Trânsito",
		},
	};

	const schemas = [softwareAppData];

	if (extraStructuredData) {
		if (Array.isArray(extraStructuredData)) {
			schemas.push(...extraStructuredData);
		} else {
			schemas.push(extraStructuredData);
		}
	}

	if (isHome) {
		const webSiteSchema = {
			"@context": "https://schema.org",
			"@type": "WebSite",
			url: baseUrl,
			potentialAction: {
				"@type": "SearchAction",
				target: `${baseUrl}/busca?q={search_term_string}`,
				"query-input": "required name=search_term_string",
			},
		};
		schemas.push(webSiteSchema);
	}

	if (faq && faq.length > 0) {
		const faqSchema = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: faq.map((item) => ({
				"@type": "Question",
				name: item.question,
				acceptedAnswer: {
					"@type": "Answer",
					text: item.answer,
				},
			})),
		};
		schemas.push(faqSchema);
	}

	const structuredData = schemas.length === 1 ? schemas[0] : schemas;

	return (
		<Helmet>
			{/* Standard Metadata */}
			<title>{fullTitle}</title>
			<meta name="description" content={fullDescription} />
			<meta name="robots" content="index, follow" />
			{keywords && <meta name="keywords" content={keywords} />}
			<link rel="canonical" href={fullUrl} />
			{/* Open Graph / Facebook / WhatsApp */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={fullDescription} />
			<meta property="og:url" content={fullUrl} />
			<meta property="og:site_name" content={siteName} />
			<meta property="og:image" content={`${baseUrl}/og-image.png`} />{" "}
			{/* Ideal: Criar uma imagem og-image.png em public/ */}
			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={fullDescription} />
			<meta name="twitter:image" content={`${baseUrl}/og-image.png`} />
			{/* Structured Data */}
			<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
		</Helmet>
	);
};

export default SEO;
