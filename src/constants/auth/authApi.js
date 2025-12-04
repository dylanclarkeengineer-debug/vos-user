import { API_ROUTES } from '../apiRoute'

export const AUTH_API = {
  SEND_EMAIL_CODE: `${API_ROUTES.VGC_USERS_PREFIX}/sendingEmailCode`,
  CHECK_LOGIN_CODE: `${API_ROUTES.VGC_USERS_PREFIX}/checkLoginCode`,
  LOGIN: `${API_ROUTES.VGC_USERS_PREFIX}/login`,
}
