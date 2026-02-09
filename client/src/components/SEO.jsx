import React from "react";
import { Helmet } from "react-helmet-async";

const SEO = ({ title, description, keywords, canonical, type = "website", faq }) => {
	const siteName = "AutoDefesa";
	// Descrição padrão focada na autoridade e especialidade
	const defaultDescription =
		"Auto Defesa: A autoridade em recursos de multas de trânsito. Tecnologia jurídica avançada para anular infrações e proteger sua CNH com base no CTB.";
	const baseUrl = "https://meuautodefesa.com.br";

	const fullTitle = title ? `${title} | ${siteName}` : `${siteName} - Recorra de Multas com IA`;
	const fullDescription = description || defaultDescription;
	
	const formattedCanonical = canonical 
		? (canonical.startsWith("/") ? canonical : `/${canonical}`) 
		: "";
	const fullUrl = `${baseUrl}${formattedCanonical}`;

	// Schema.org JSON-LD para SoftwareApplication
	let structuredData = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: "Auto Defesa",
		applicationCategory: "LegalApplication",
		image: "https://meuautodefesa.com.br/favicon.svg",
		description: fullDescription,
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "BRL",
		},
		author: {
			"@type": "Person",
			name: "Rodrigo",
			jobTitle: "Fundador e Especialista Jurídico",
			hasCredential: "Bacharel em Direito",
		},
	};

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
		structuredData = [structuredData, faqSchema];
	}

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
			<meta property="og:image" content={`${baseUrl}/og-image.jpg`} />{" "}
			{/* Ideal: Criar uma imagem og-image.jpg em public/ */}
			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={fullDescription} />
			<meta name="twitter:image" content={`${baseUrl}/og-image.jpg`} />
			{/* Structured Data */}
			<script type="application/ld+json">{JSON.stringify(structuredData)}</script>
		</Helmet>
	);
};

export default SEO;
