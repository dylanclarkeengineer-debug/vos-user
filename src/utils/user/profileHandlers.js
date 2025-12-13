import axios from 'axios'
import Cookies from 'js-cookie'

import { API_ROUTES } from '@/constants/apiRoute'

const axiosClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
})

/**
 * Lấy thông tin profile của user
 */
export const getUserProfile = async (userId, token = null) => {
    try {
        const authToken = token || Cookies.get('vos_token')

        if (!authToken) throw new Error('No authentication token found')
        if (!userId) throw new Error('User ID is required')

        const response = await axiosClient.get(
            `${API_ROUTES.VGC_USERS_PREFIX}/GetUserProfile`,
            {
                params: { user_id: userId },
                headers: { Authorization: `Bearer ${authToken}` },
            }
        )

        return response.data
    } catch (error) {
        console.error('Error fetching user profile:', error)
        if (error.response?.status === 401) {
            Cookies.remove('vos_token')
        }
        throw error
    }
}

/**
 * Cập nhật thông tin profile của user
 * @param {string} userId - ID của user
 * @param {Object} data - Dữ liệu cần update (name, phone, avatar...)
 * @param {string} token - JWT token (optional)
 */
export const updateUserProfile = async (userId, data, token = null) => {
    try {
        const authToken = token || Cookies.get('vos_token')

        if (!authToken) throw new Error('No authentication token found')
        if (!userId) throw new Error('User ID is required')

        // Cấu trúc payload theo yêu cầu của API (ảnh image_cb52c5.png)
        const payload = {
            user_id: userId,
            params: {
                name: data.name,
                phone: data.phone, // Thêm phone nếu API hỗ trợ
                // Lưu ý: API yêu cầu key là "personal_profile_image" cho ảnh base64
                personal_profile_image: data.avatar || ""
            }
        }

        const response = await axiosClient.post(
            `${API_ROUTES.VGC_USERS_PREFIX}/updatePersonalProfile`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        )

        return response.data
    } catch (error) {
        console.error('Error updating user profile:', error)
        if (error.response?.status === 401) {
            Cookies.remove('vos_token')
        }
        throw error
    }
}

// Export default object chứa tất cả functions
const profileHandlers = {
    getUserProfile,
    updateUserProfile
}

export default profileHandlers