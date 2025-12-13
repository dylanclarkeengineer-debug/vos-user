// src/constants/business/initialStates.js

export const INITIAL_BUSINESS_STATE = {
    // Basic Information
    name: '',
    category: '',
    description: '',
    business_status: 'active', // active | inactive | pending

    // Logo & Branding
    logo: null, // Base64 string for upload
    logo_url: '', // URL from server after upload

    // Contact Information
    phone: '',
    emails: [],
    website: '',

    // Social Media Links
    social_links: {
        facebook: '',
        instagram: '',
        twitter: '',
        linkedin: '',
        youtube: '',
        tiktok: '',
    },

    // Address Information
    address_info: {
        address: '',
        city: '',
        region: '', // State/Province
        fullAddress: '',
        zip: '',
    },

    // Business Hours
    work_time: {
        work_hours: {
            timetable: {
                sunday: [],
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
            }
        },
        current_status: 'open' // open | close | temporarily_closed | closed_forever
    },


    // Location Coordinates
    latitude: 0,
    longitude: 0,

    // Landmarks (Micro-location details)
    landmarks: '', // e.g., "Lot 1, Floor 1, Building A"
}

// Business Categories
export const BUSINESS_CATEGORIES = [
    { value: 'RESTAURANT', label: 'Restaurant', vi: 'Nhà Hàng' },
    { value: 'NAIL_SALON', label: 'Nail Salon', vi: 'Tiệm Nail' },
    { value: 'HAIR_SALON', label: 'Hair Salon', vi: 'Tiệm Tóc' },
    { value: 'SPA', label: 'Spa & Wellness', vi: 'Spa' },
    { value: 'GROCERY', label: 'Grocery Store', vi: 'Siêu Thị' },
    { value: 'BAKERY', label: 'Bakery', vi: 'Tiệm Bánh' },
    { value: 'CAFE', label: 'Coffee Shop', vi: 'Quán Cà Phê' },
    { value: 'AUTO_REPAIR', label: 'Auto Repair', vi: 'Sửa Xe' },
    { value: 'MEDICAL', label: 'Medical/Dental', vi: 'Y Tế' },
    { value: 'EDUCATION', label: 'Education', vi: 'Giáo Dục' },
    { value: 'REAL_ESTATE', label: 'Real Estate', vi: 'Bất Động Sản' },
    { value: 'LEGAL', label: 'Legal Services', vi: 'Luật Sư' },
    { value: 'INSURANCE', label: 'Insurance', vi: 'Bảo Hiểm' },
    { value: 'FINANCIAL', label: 'Financial Services', vi: 'Tài Chính' },
    { value: 'RETAIL', label: 'Retail Shop', vi: 'Cửa Hàng' },
    { value: 'OTHER', label: 'Other', vi: 'Khác' },
]

// Business Status Options
export const BUSINESS_STATUS_OPTIONS = [
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'gray' },
    { value: 'pending', label: 'Pending Approval', color: 'yellow' },
]

// Social Media Platforms
export const SOCIAL_PLATFORMS = {
    facebook: {
        label: 'Facebook',
        icon: 'ri-facebook-fill',
        domain: 'facebook.com',
        placeholder: 'https://facebook.com/yourpage'
    },
    instagram: {
        label: 'Instagram',
        icon: 'ri-instagram-line',
        domain: 'instagram.com',
        placeholder: 'https://instagram.com/yourprofile'
    },
    twitter: {
        label: 'Twitter/X',
        icon: 'ri-twitter-x-line',
        domain: 'twitter.com',
        placeholder: 'https://twitter.com/yourhandle'
    },
    linkedin: {
        label: 'LinkedIn',
        icon: 'ri-linkedin-fill',
        domain: 'linkedin.com',
        placeholder: 'https://linkedin.com/company/yourcompany'
    },
    youtube: {
        label: 'YouTube',
        icon: 'ri-youtube-fill',
        domain: 'youtube.com',
        placeholder: 'https://youtube.com/@yourchannel'
    },
    tiktok: {
        label: 'TikTok',
        icon: 'ri-tiktok-fill',
        domain: 'tiktok.com',
        placeholder: 'https://tiktok.com/@yourusername'
    },
}

// Email validation helper
export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
}

// Phone validation helper
export const isValidPhone = (phone) => {
    const regex = /^\+?[\d\s\-()]+$/
    return regex.test(phone) && phone.replace(/\D/g, '').length >= 10
}

// Website validation helper
export const isValidWebsite = (url) => {
    try {
        new URL(url.startsWith('http') ? url : `https://${url}`)
        return true
    } catch {
        return false
    }
}

export const DAYS_OF_WEEK = [
    { key: 'monday', label: 'Monday', short: 'Mon' },
    { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
    { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
    { key: 'thursday', label: 'Thursday', short: 'Thu' },
    { key: 'friday', label: 'Friday', short: 'Fri' },
    { key: 'saturday', label: 'Saturday', short: 'Sat' },
    { key: 'sunday', label: 'Sunday', short: 'Sun' },
]

// Business status options
export const BUSINESS_CURRENT_STATUS = [
    { value: 'open', label: 'Open', color: 'green', icon: 'ri-door-open-line' },
    { value: 'close', label: 'Closed', color: 'red', icon: 'ri-door-closed-line' },
    { value: 'temporarily_closed', label: 'Temporarily Closed', color: 'yellow', icon: 'ri-time-line' },
    { value: 'closed_forever', label: 'Permanently Closed', color: 'gray', icon: 'ri-forbid-line' },
]

// Time slot helper
export const createTimeSlot = (openHour = 9, openMinute = 0, closeHour = 17, closeMinute = 0) => ({
    open: {
        hour: openHour,
        minute: openMinute,
    },
    close: {
        hour: closeHour,
        minute: closeMinute,
    }
})

// Common presets
export const BUSINESS_HOURS_PRESETS = {
    standard: { // 9 AM - 5 PM
        open: { hour: 9, minute: 0 },
        close: { hour: 17, minute: 0 }
    },
    retail: { // 10 AM - 9 PM
        open: { hour: 10, minute: 0 },
        close: { hour: 21, minute: 0 }
    },
    restaurant: { // 11 AM - 10 PM
        open: { hour: 11, minute: 0 },
        close: { hour: 22, minute: 0 }
    },
    salon: { // 9 AM - 7 PM
        open: { hour: 9, minute: 0 },
        close: { hour: 19, minute: 0 }
    },
    '24hours': { // 24/7
        open: { hour: 0, minute: 0 },
        close: { hour: 23, minute: 59 }
    }
}