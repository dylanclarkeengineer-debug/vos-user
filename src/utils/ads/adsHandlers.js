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
 */
export const createNewJobByUser = async (payload, token) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' }
    }
    if (token) config.headers['Authorization'] = `Bearer ${token}`

    const response = await axiosClient.post(AD_API.CREATE_NEW_JOB, payload, config)
    return response.data
  } catch (error) {
    console.error('Error creating new job:', error)
    throw error
  }
}

/**
 * Lấy danh sách bài đăng của user.
 *
 * NOTE: Backend hiện có thể trả status 500 nhưng vẫn kèm payload.
 *  - Để tránh axios reject (và các interceptor log lỗi), ta cho phép status === 500 được coi là "hợp lệ"
 *    cho request này bằng `validateStatus`. Khi đó `response` sẽ luôn có .status và .data,
 *    và only network tab sẽ show 500 (không thể che).
 */
export const getListJobsByUser = async ({
  userId,
  country = 'US',
  page = 1,
  pageSize = 12,
  token = null,
} = {}) => {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      params: {
        user_id: userId,
        country,
        page,
        pageSize,
      },
      // Treat status 500 as non-throwing for this request so we can inspect response.data
      validateStatus: (status) => (status >= 200 && status < 300) || status === 500,
    }

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }

    const response = await axiosClient.get(AD_API.GET_JOBS_BY_USER, config)

    // If server returned 500 but included useful payload, prefer to return it.
    if (response.status === 500) {
      const d = response.data
      if (!d) return []
      if (Array.isArray(d)) return d
      if (Array.isArray(d.jobPosts)) return d
      if (Array.isArray(d.data)) return d.data
      if (Array.isArray(d.result)) return d.result
      // fallback to raw body
      return d
    }

    // success (2xx)
    return response.data
  } catch (error) {
    // Network errors / no response reach here
    console.error('Error fetching jobs list by user:', error)
    return []
  }
}