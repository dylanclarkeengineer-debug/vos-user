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
