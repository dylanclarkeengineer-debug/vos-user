"use client"

import React, { createContext, useReducer, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { logout as logoutHandler } from '@/utils/auth/authHandlers'; // Import hàm logout từ handlers cũ để dùng lại logic

// --- 1. INITIAL STATE ---
const initialState = {
    isAuthenticated: false,
    user: null,      // Chứa thông tin decode từ token
    isLoading: true, // Để hiện loading khi đang check cookie lúc mới vào app
};

// --- 2. REDUCER ---
const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload, // payload là decoded token object
                isLoading: false,
            };
        case 'LOGOUT':
            return {
                ...state,
                isAuthenticated: false,
                user: null,
                isLoading: false,
            };
        case 'STOP_LOADING':
            return {
                ...state,
                isLoading: false,
            };
        default:
            return state;
    }
};

// --- 3. CREATE CONTEXT ---
const AuthContext = createContext();

// --- 4. PROVIDER ---
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // A. Hàm Login: Chỉ update state (vì Cookie đã được set ở authHandlers rồi)
    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            dispatch({ type: 'LOGIN_SUCCESS', payload: decoded });
        } catch (error) {
            console.error("Invalid token during context login", error);
            logout();
        }
    };

    // B. Hàm Logout: Xóa state và xóa cookie
    const logout = () => {
        logoutHandler(); // Gọi hàm xóa cookie từ file handlers
        dispatch({ type: 'LOGOUT' });
    };

    // C. Logic quan trọng: Tự động khôi phục session khi F5 trang
    useEffect(() => {
        const initializeAuth = () => {
            const token = Cookies.get('vos_token');

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    // Kiểm tra token hết hạn chưa
                    if (decoded.exp < currentTime) {
                        // Token hết hạn -> Logout
                        logout();
                    } else {
                        // Token còn hạn -> Set vào state
                        dispatch({ type: 'LOGIN_SUCCESS', payload: decoded });
                    }
                } catch (error) {
                    // Token lỗi -> Logout
                    logout();
                }
            } else {
                // Không có token
                dispatch({ type: 'STOP_LOADING' });
            }
        };

        initializeAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// --- 5. CUSTOM HOOK (Để dùng cho gọn) ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};