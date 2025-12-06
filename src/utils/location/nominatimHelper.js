import {
    NOMINATIM_BASE_URL,
    PARAM_KEYS,
    DEFAULT_SEARCH_OPTIONS
} from '@/constants/location/queryConstant';

/**
 * Hàm tạo URL tìm kiếm
 * @param {string} queryText - Từ khóa tìm kiếm
 * @param {object} customOptions - Các tùy chỉnh thêm (ghi đè mặc định)
 */
export const buildSearchUrl = (queryText, customOptions = {}) => {
    // 1. Gộp option mặc định với option tùy chỉnh
    const params = {
        ...DEFAULT_SEARCH_OPTIONS,
        ...customOptions,
        [PARAM_KEYS.QUERY]: queryText // Luôn là params 'q'
    };

    // 2. Chuyển object thành query string (VD: ?q=abc&format=json...)
    const queryString = new URLSearchParams(params).toString();

    // 3. Trả về URL hoàn chỉnh
    return `${NOMINATIM_BASE_URL}?${queryString}`;
};