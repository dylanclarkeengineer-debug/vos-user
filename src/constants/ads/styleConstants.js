// constants/ads/styleConstants.js

export const ADS_STYLES = {
    // --- LAYOUT & CONTAINERS ---
    // Khung trắng bao quanh các phần (Basic Info, Location...)
    SECTION_CONTAINER: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm",

    // Khung lưới 2 cột thường dùng
    GRID_LAYOUT: "grid grid-cols-1 gap-6 md:grid-cols-2",

    // Header của từng section (có gạch chân mờ bên dưới)
    SECTION_HEADER_WRAPPER: "mb-6 border-b border-gray-100 pb-4",

    // --- TYPOGRAPHY ---
    // Tiêu đề lớn của Section
    SECTION_TITLE: "text-xl font-bold text-gray-900",

    // Tiêu đề phụ / Mô tả nhỏ dưới tiêu đề
    SECTION_DESC: "text-sm text-gray-500",

    // Label cho input (có dấu * đỏ thì thêm span riêng)
    LABEL: "text-sm font-medium text-gray-700",

    // Text nhỏ gợi ý (ví dụ: dưới input)
    HINT_TEXT: "text-xs text-gray-500",

    // --- FORM ELEMENTS ---
    // Input và Select Trigger (dùng chung style border, background)
    INPUT_BASE: "border-gray-300 bg-white",

    // Textarea
    TEXTAREA_BASE: "min-h-[150px] resize-y border-gray-300 bg-white",

    // Nút xóa (như trong Social Link hoặc Image)
    BUTTON_DELETE: "text-gray-400 hover:text-red-500 hover:bg-red-50",
};