import axios from 'axios'

import { AD_API } from '@/constants/ads/adsApi'

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

export const getAllStates = async () => {
  try {
    const response = await axiosClient.get(AD_API.GET_STATES)
    return response.data
  } catch (error) {
    console.error('Error fetching states:', error)
    return []
  }
}

export const getAllCategories = async () => {
  try {
    const response = await axiosClient.get(AD_API.GET_CATEGORIES)
    return response.data
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Gọi API tạo bài đăng mới.
 * @param {Object} payload - Object chứa toàn bộ dữ liệu form theo cấu trúc JSON của Backend
 * @param {String} token - Token xác thực người dùng (Bearer token)
 */
export const createNewJobByUser = async (payload, token) => {
  try {
    // Cấu hình header riêng cho request này nếu cần token
    const config = {
      headers: {
        'Content-Type': 'application/json',
      }
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    const response = await axiosClient.post(AD_API.CREATE_NEW_JOB, payload, config)
    return response.data
  } catch (error) {
    console.error('Error creating new job:', error)
    throw error
  }
}