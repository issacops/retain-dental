import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
    title?: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    faqs?: { question: string; answer: string }[];
    breadcrumbs?: { name: string; url: string }[];
    articlePublishedTime?: string;
    articleAuthor?: string;
}

const DEFAULT_KEYWORDS = [
    // Tier 1 — high intent (industry standard)
    'dental practice management software',
    'dental patient engagement software',
    'dental recall software',
    'dental patient communication software',
    'dental appointment reminder software',
    'dental CRM',
    'dental practice software',
    'dental clinic software',
    // Tier 2 — mid-funnel
    'best dental software 2026',
    'dental practice marketing software',
    'dental loyalty program software',
    'dental patient retention software',
    'dental reactivation software',
    'dental patient experience platform',
    'dental membership software',
    'dental aftercare software',
    'dental patient app',
    'dental care plan software',
    // Tier 3 — long-tail differentiators
    'dental app for patients white label',
    'branded dental app',
    'dental aligner tracking app',
    'dso patient engagement software',
    'dental recall system automation',
    'dental practice app custom branded',
    'multi-location dental practice software',
    'patient loyalty program dental',
    'dental membership tier software',
    'household dental rewards program',
    'ai social media for dentists',
    'dental post-op care app',
    'dental treatment plan app',
    'dental care plan tracking',
    'dental check-in app',
    'dental re-care reminder',
    'dentist patient retention',
    'patient recall software',
    'dental membership rewards',
    'dental patient portal',
    'patient experience dental',
    'dental treatment adherence',
    'dso software',
    'dso dashboard',
    'multi-location dental software',
    'dental front desk software',
    'dental workflow automation',
    'dental invoice app',
    'dental payments app',
    'aftercare dental',
    'dental post-treatment',
    'dental aftercare tracking',
    'dental tray tracking',
    'aligner compliance',
    'post op dental',
    'household loyalty points',
    'dental cosmetic aftercare',
    'dental patient reactivation',
    'dental recall automation',
    'dental practice growth',
    'dental revenue cycle',
    // Tier 4 — LLM citation / comparison targets
    'best dental patient retention software',
    'dental patient app for dso',
    'white label dental app',
    'dental practice growth software',
    'how to launch white-label dental app',
    'dental software with loyalty program',
    'dental software with rewards',
    'dental software for small practice',
    'dental software for dso',
    'retention software for dentists',
    'patient loyalty dental',
    'dental app developer',
];

const DEFAULT_TITLE = 'RetainOS — The Dental Patient Engagement & Loyalty Platform';
const DEFAULT_DESCRIPTION =
    'RetainOS is the white-label patient engagement platform for modern dental practices and DSOs. Launch your branded patient app in 20 minutes — automate recall, aftercare, loyalty tiers, and payments. HIPAA-ready architecture. Built on Cloudflare + Supabase.';
const DEFAULT_IMAGE = 'https://app.retaindental.com/og-image.png';
const DEFAULT_URL = 'https://app.retaindental.com';

export const SEOHead: React.FC<SEOHeadProps> = ({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    keywords = DEFAULT_KEYWORDS,
    image = DEFAULT_IMAGE,
    url = DEFAULT_URL,
    type = 'website',
    faqs,
    breadcrumbs,
    articlePublishedTime,
    articleAuthor = 'RetainOS Team',
}) => {
    const softwareSchema = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'RetainOS',
        applicationCategory: 'BusinessApplication',
        applicationSubCategory: 'Dental Practice Management',
        operatingSystem: 'Web, iOS, Android',
        url,
        image,
        description,
        keywords: keywords.join(', '),
        offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            availability: 'https://schema.org/PreOrder',
        },
        author: {
            '@type': 'Organization',
            name: 'RetainOS',
        },
        featureList: [
            'White-label patient app',
            'Automated dental recall',
            'Treatment plan tracking',
            'Loyalty tier program',
            'Household points pooling',
            'Branded social post generator',
            'Practice analytics dashboard',
            'Patient intake forms',
            'Appointment scheduling',
            'Payment collection',
        ],
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'RetainOS',
        legalName: 'RetainOS',
        url,
        logo: 'https://app.retaindental.com/icon-512.png',
        description,
        sameAs: [
            'https://twitter.com/retainos',
            'https://www.linkedin.com/company/retainos',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Sales',
            url: 'https://app.retaindental.com/',
        },
    };

    const dentistSchema = {
        '@context': 'https://schema.org',
        '@type': 'MedicalSpecialty',
        name: 'Dental Practice Management',
        medicalSpecialty: 'Dentistry',
        relevantSpecialty: {
            '@type': 'MedicalSpecialty',
            name: 'Dentistry',
        },
    };

    const faqSchema = faqs && faqs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map(f => ({
                '@type': 'Question',
                name: f.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: f.answer,
                },
            })),
        }
        : null;

    const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0
        ? {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: breadcrumbs.map((b, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: b.name,
                item: b.url,
            })),
        }
        : null;

    return (
        <Helmet>
            <html lang="en" />
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords.join(', ')} />
            <meta name="author" content={articleAuthor} />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="googlebot" content="index, follow" />
            <meta name="theme-color" content="#0d9488" />
            <link rel="canonical" href={url} />
            <link rel="alternate" hrefLang="en" href={url} />
            <link rel="alternate" hrefLang="x-default" href={url} />

            {/* Open Graph */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:site_name" content="RetainOS" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
            <meta name="twitter:site" content="@retainos" />
            <meta name="twitter:creator" content="@retainos" />

            {/* App links */}
            <meta property="al:ios:app_name" content="RetainOS Patient" />
            <meta property="al:android:app_name" content="RetainOS Patient" />

            {/* Article metadata (for blog posts) */}
            {type === 'article' && articlePublishedTime && (
                <>
                    <meta property="article:published_time" content={articlePublishedTime} />
                    <meta property="article:author" content={articleAuthor} />
                    <meta property="article:section" content="Dental Practice Management" />
                </>
            )}

            {/* Structured Data */}
            <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
            <script type="application/ld+json">{JSON.stringify(dentistSchema)}</script>
            {faqSchema && <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>}
            {breadcrumbSchema && <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>}
        </Helmet>
    );
};
