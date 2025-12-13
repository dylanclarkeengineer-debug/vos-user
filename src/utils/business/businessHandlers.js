import axios from 'axios'
import Cookies from 'js-cookie'

import { API_ROUTES } from '@/constants/apiRoute'

const axiosClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Create a new business
 */
export const createBusinessByUser = async (params, token = null) => {
    try {
        if (!params.user_id) {
            throw new Error('User ID is required')
        }

        if (!params.params?.name) {
            throw new Error('Business name is required')
        }

        if (!params.params?.category) {
            throw new Error('Business category is required')
        }

        const authToken = token || Cookies.get('vos_token')

        const headers = {
            'Content-Type': 'application/json',
        }

        if (authToken) {
            headers.Authorization = `Bearer ${authToken}`
        }

        console.log('🚀 Sending request to:', `${API_ROUTES.VGC_USERS_PREFIX}/createBusinessByUser`)
        console.log('📦 Payload:', JSON.stringify(params, null, 2))

        const response = await axiosClient.post(
            `${API_ROUTES.VGC_USERS_PREFIX}/createBusinessByUser`,
            params,
            { headers }
        )

        console.log('✅ Raw Response:', response)
        console.log('📄 Response Data:', response.data)

        const data = response.data

        // ✅ Normalize response - support both formats
        return {
            success: data.success === true,
            businessId: data.businessId || data.business_id || null,
            business_id: data.businessId || data.business_id || null,
            message: data.message || 'Business created successfully',
            ...data
        }

    } catch (error) {
        console.error('❌ Error creating business:', error)

        if (error.response) {
            console.error('📛 Response Error Details:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data,
                headers: error.response.headers,
            })
        } else if (error.request) {
            console.error('📛 No Response Received:', error.request)
        } else {
            console.error('📛 Request Setup Error:', error.message)
        }

        if (error.response?.status === 401 && Cookies.get('vos_token')) {
            Cookies.remove('vos_token')
        }

        // Return detailed error
        const errorData = error.response?.data
        const errorMessage = errorData?.message ||
            errorData?.error ||
            error.message ||
            'Failed to create business'

        throw {
            message: errorMessage,
            status: error.response?.status,
            data: errorData,
            originalError: error
        }
    }
}

/**
 * Get all business categories
 */
export const getBusinessCategories = async () => {
    try {
        const response = await axiosClient.get(
            `${API_ROUTES.VGC_USERS_PREFIX}/getBusinessCategories`
        )

        const categoriesData = response.data

        const categoriesArray = Object.entries(categoriesData).map(([key, value]) => ({
            value: key,
            label: value.name,
            isFeatured: value.isFeatured || false,
        }))

        categoriesArray.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1
            if (!a.isFeatured && b.isFeatured) return 1
            return a.label.localeCompare(b.label)
        })

        return categoriesArray

    } catch (error) {
        console.error('Error fetching business categories:', error)
        throw error
    }
}

const businessHandlers = {
    createBusinessByUser,
    getBusinessCategories,
}

export default businessHandlers