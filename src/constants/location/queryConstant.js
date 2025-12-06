// 1. BASE CONFIGURATION
export const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org/search";

// 2. PARAMETER KEYS (Tên tham số API)
// Dùng cái này làm key khi tạo URLSearchParams để tránh gõ sai tên tham số
export const PARAM_KEYS = {
    QUERY: 'q',                 // Free-form query
    FORMAT: 'format',           // Output format
    LIMIT: 'limit',             // Max results (max 40)
    ADDRESS_DETAILS: 'addressdetails', // Include address breakdown
    EXTRA_TAGS: 'extratags',    // Include extra info (wiki, hours)
    NAME_DETAILS: 'namedetails', // Include full list of names
    COUNTRY_CODES: 'countrycodes', // ISO 3166-1alpha2 code
    LAYER: 'layer',             // Filter by theme
    FEATURE_TYPE: 'featureType',// Filter by administrative level
    EXCLUDE_PLACE_IDS: 'exclude_place_ids',
    VIEWBOX: 'viewbox',         // <x1>,<y1>,<x2>,<y2>
    BOUNDED: 'bounded',         // 0 or 1
    POLYGON_GEOJSON: 'polygon_geojson',
    EMAIL: 'email',             // Contact email for large requests
    DEDUPE: 'dedupe',           // 0 or 1
    ACCEPT_LANGUAGE: 'accept-language'
};

// 3. STRUCTURED QUERY KEYS (Dùng cho tìm kiếm có cấu trúc)
export const STRUCTURED_PARAMS = {
    STREET: 'street',
    CITY: 'city',
    COUNTY: 'county',
    STATE: 'state',
    COUNTRY: 'country',
    POSTALCODE: 'postalcode',
    AMENITY: 'amenity'
};

// 4. VALID VALUES (Các giá trị hợp lệ)

// Các định dạng output
export const OUTPUT_FORMATS = {
    JSON: 'json',
    JSONV2: 'jsonv2', // Khuyên dùng cho cấu trúc tốt hơn
    GEOJSON: 'geojson', // Tốt nếu cần vẽ boundary lên bản đồ
    XML: 'xml'
};

// Các lớp dữ liệu (Layers)
export const LAYERS = {
    ADDRESS: 'address', // Nhà cửa, đường xá, biên giới hành chính
    POI: 'poi',         // Nhà hàng, shop, điểm du lịch
    RAILWAY: 'railway', // Đường sắt
    NATURAL: 'natural', // Sông, hồ, núi
    MANMADE: 'manmade'  // Các công trình nhân tạo khác
};

// Loại đối tượng hành chính (Feature Types)
export const FEATURE_TYPES = {
    COUNTRY: 'country',
    STATE: 'state',
    CITY: 'city',
    SETTLEMENT: 'settlement' // Bất cứ khu dân cư nào
};

// 5. DEFAULT CONFIG (Cấu hình mặc định cho App của bạn)
export const DEFAULT_SEARCH_OPTIONS = {
    [PARAM_KEYS.FORMAT]: OUTPUT_FORMATS.JSON,
    [PARAM_KEYS.ADDRESS_DETAILS]: 1, // Luôn lấy chi tiết địa chỉ để fill form
    [PARAM_KEYS.LIMIT]: 5,           // Giới hạn 5 kết quả cho autocomplete
    [PARAM_KEYS.COUNTRY_CODES]: 'us',// Giới hạn tìm kiếm ở Mỹ (theo project của bạn)
    [PARAM_KEYS.LAYER]: LAYERS.ADDRESS // Chỉ tìm địa chỉ, bỏ qua POI rác nếu không cần thiết
};