import { PLATFORM_DOMAINS } from '@/constants/ads/initialStates';

export const validateSocialLink = (platform, url) => {
    if (!url || !platform) return null;

    const domainRules = PLATFORM_DOMAINS[platform];
    const lowerUrl = url.toLowerCase();

    if (Array.isArray(domainRules)) {
        const isValid = domainRules.some(domain => lowerUrl.includes(domain));
        return isValid ? null : `Link must be from ${platform} (e.g., ${domainRules.join(', ')})`;
    }

    // Trường hợp 2: Platform chỉ có 1 domain
    if (typeof domainRules === 'string') {
        if (!lowerUrl.includes(domainRules)) {
            return `Link must contain "${domainRules}"`;
        }
    }

    return null; // Hợp lệ
}