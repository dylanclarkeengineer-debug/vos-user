import axios from 'axios';
import { AUTH_API } from '@/constants/auth/authApi';
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";

const axiosClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

const handleTokenStorage = (token) => {
    try {
        const decoded = jwtDecode(token);
        const expirationDate = new Date(decoded.exp * 1000);

        Cookies.set('vos_token', token, {
            expires: expirationDate,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict'
        });
    } catch (error) {
        console.error("Failed to decode token or set cookie:", error);
    }
};

export const sendEmailCode = async (email) => {
    try {
        const formData = new URLSearchParams();
        formData.append('email_user', email);

        const response = await axiosClient.post(AUTH_API.SEND_EMAIL_CODE, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        return response.data;
    } catch (error) {
        console.error("Error sending email code:", error);
        throw error;
    }
};

/**
 * CẬP NHẬT: Thêm tham số isVerified (mặc định là false)
 */
export const checkLoginCode = async (email, code, isVerified = false) => {
    try {
        const payload = {
            email_user: email,
            email_verification_code: code,
            is_verified: isVerified // Sử dụng giá trị dynamic được truyền vào
        };

        const response = await axiosClient.post(AUTH_API.CHECK_LOGIN_CODE, payload, {
            headers: { 'Content-Type': 'application/json' }
        });

        return response.data;
    } catch (error) {
        console.error("Error checking login code:", error);
        throw error;
    }
};

export const login = async (email, code) => {
    try {
        const formData = new URLSearchParams();
        formData.append('email_user', email);
        formData.append('email_verification_code', code);

        const response = await axiosClient.post(AUTH_API.LOGIN, formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        const data = response.data;

        if (data.success && data.token) {
            handleTokenStorage(data.token);
        }

        return data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const logout = () => {
    Cookies.remove('vos_token');
    window.location.href = '/signin';
};