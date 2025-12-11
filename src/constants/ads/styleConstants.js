// constants/ads/styleConstants.js

export const ADS_STYLES = {
    // --- PAGE LAYOUT ---
    PAGE_WRAPPER: "animate-fade-in mx-auto max-w-[1400px] px-4 pt-6 pb-32 font-sans text-neutral-900",
    TOP_BAR_CONTAINER: "mb-8 flex flex-col gap-4 lg:flex-row",

    // --- CONTAINERS (Card, Section) ---
    // Khung trắng chính chứa bảng/form
    MAIN_CARD: "flex min-h-[600px] flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm",
    SECTION_CONTAINER: "rounded-lg border border-gray-200 bg-white p-6 shadow-sm", // Dùng cho form create

    // --- TABLE STYLES ---
    // Header của Card (chứa Title "Posted Ads" và Total Views)
    TABLE_CARD_HEADER: "flex flex-none items-center justify-between border-b border-neutral-100 bg-white px-6 py-5",

    // Hàng tiêu đề bảng (thead tr)
    TABLE_HEADER_ROW: "border-b border-neutral-100 hover:bg-transparent",

    // Ô tiêu đề (th) - Base style
    TABLE_HEAD_CELL: "py-4 text-xs font-bold tracking-tight text-neutral-900 uppercase", // Đậm cho cột chính
    TABLE_HEAD_CELL_SUB: "py-4 text-xs font-bold tracking-tight text-neutral-500 uppercase", // Nhạt cho cột phụ

    // Hàng nội dung (tbody tr) - Có hiệu ứng hover
    TABLE_ROW: "border-b border-neutral-100 transition-colors hover:bg-neutral-50/30",

    // Ô nội dung (td) - Base style (padding, align)
    TABLE_CELL: "py-6 align-top",

    // --- TYPOGRAPHY & ELEMENTS ---
    // Title bài viết trong bảng (Có line-clamp)
    POST_TITLE: "mb-1 cursor-pointer text-base leading-tight font-bold text-neutral-900 transition-colors hover:text-blue-600 line-clamp-2 break-words w-full",

    // Ad Code (Text nhỏ mã số)
    AD_CODE: "font-mono text-[10px] text-neutral-400 break-all",

    // Description (Text mô tả mờ)
    POST_DESC: "mb-2 text-sm leading-relaxed text-neutral-500 line-clamp-3 break-words w-full",

    // Price / Salary highlight
    PRICE_TEXT: "mb-3 text-sm font-bold text-blue-600 truncate w-full",

    // Badge trạng thái (Status) - Base style
    STATUS_BADGE_BASE: "mb-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",

    // --- BUTTONS & ACTIONS ---
    // Nút "View Post" nhỏ
    BTN_VIEW_POST: "h-7 rounded-sm border-none bg-blue-50 px-3 text-[10px] font-bold tracking-wider text-blue-600 uppercase hover:bg-blue-100 hover:text-blue-700",

    // Nút Icon hành động (Edit, Delete...)
    BTN_ICON_ACTION: "h-8 w-8 rounded-sm transition-all",

    // Nút phân trang (Pagination)
    BTN_PAGINATION: "h-8 w-8 rounded-sm text-xs font-bold",

    // --- FORM INPUTS (Reuse từ Create form) ---
    INPUT_BASE: "h-10 border-neutral-200 bg-white focus-visible:ring-1 focus-visible:ring-blue-600",
    SELECT_TRIGGER: "h-10 bg-white",
};