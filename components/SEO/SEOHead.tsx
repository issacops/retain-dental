import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
    title = "Retain OS — The Dentist's Loyalty Operating System",
    description = "Retain Dental is a B2B2C Loyalty OS that converts patient spend into tiered membership status and locks in future revenue via cosmetic treatments.",
    keywords = ["Dental Loyalty Program", "Dentist Marketing Software", "Patient Retention", "Aligner Tracking", "Dental CRM"],
    image = "https://retain.dental/og-image.jpg", // Needs valid absolute URL in prod usually, relative works if domain set
    url = "https://retain.dental",
    type = "website"
}) => {

    // Structured Data for Software Application (SaaS)
    const softwareSchema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Retain Dental",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "description": description
    };

    return (
        <Helmet>
            {/* Standard Meta */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* AI Context / JSON-LD */}
            <script type="application/ld+json">
                {JSON.stringify(softwareSchema)}
            </script>
        </Helmet>
    );
};
