export const PLATFORM_DOMAINS = {
    Facebook: 'facebook.com',
    Twitter: ['twitter.com', 'x.com'],
    YouTube: ['youtube.com', 'youtu.be'],
    LinkedIn: 'linkedin.com',
    Instagram: 'instagram.com',
    Yelp: 'yelp.com',
    Google: 'google.com',
    TikTok: 'tiktok.com',
}

export const INITIAL_FORM_STATE = {
    title: '',
    position: '',
    status: 'active', // Default Public
    showEmail: 'yes',
    showPhone: 'yes', // Thêm trường hiển thị số điện thoại
    applicantReq: '',
    priceSalary: '',
    contactPhone: '',
    secondaryPhone: '',
    description: '',
    city: '',
    state: '',
    zipcode: '',
    relatedBusiness: 'none',
    // Business Fields
    bizSalePrice: '',
    bizLeasePrice: '', // Maps to 'rent'
    bizReason: '',
    bizCashFlow: '',
    bizGrossRevenue: '',
    bizEmployees: '',
    bizSquareFeet: '',
    bizLeaseExpiration: '',
    // Admin Field
    manualEntrySource: ''
}

export const MOCK_USER_BUSINESSES = [
    { id: 'biz_001', name: 'Pho Saigon Restaurant' },
    { id: 'biz_002', name: 'Glamour Nail & Spa' },
    { id: 'biz_003', name: 'VGC Tech Solutions' },
]