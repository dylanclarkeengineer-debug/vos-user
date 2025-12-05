const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const API_URL_ROOT = `${BASE_URL}/api`
const NEXT_PUBLIC_REACT_JOB = process.env.NEXT_PUBLIC_REACT_JOB_URL

export const API_ROUTES = {
  API_URL: API_URL_ROOT,
  VGC_USERS_PREFIX: `${API_URL_ROOT}/users`,
  VGC_NEWS_PREFIX: `${API_URL_ROOT}/news`,
  VGC_BIZ_PREFIX: `${API_URL_ROOT}/businesses`,
  VGC_JOBS_PREFIX: `${API_URL_ROOT}/jobs`,
  listingPage: (id) => `${NEXT_PUBLIC_REACT_JOB}/ads/${id}`,
}

