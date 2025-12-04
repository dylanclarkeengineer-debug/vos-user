import { NextResponse } from 'next/server'

export function middleware(request) {
  // 1. Lấy token từ cookie (tên cookie là 'vos_token' như bạn đã định nghĩa)
  const token = request.cookies.get('vos_token')?.value

  // 2. Lấy đường dẫn hiện tại
  const { pathname } = request.nextUrl

  // 3. Định nghĩa các trang Public (không cần đăng nhập vẫn vào được)
  // Bạn có thể thêm các trang khác vào đây nếu cần (ví dụ: /about, /contact)
  const publicPaths = ['/signin']

  // Kiểm tra xem trang hiện tại có phải là trang public không
  const isPublicPath = publicPaths.includes(pathname)

  // --- LOGIC CHẶN ---

  // TRƯỜNG HỢP A: Người dùng CHƯA đăng nhập (không có token)
  // Và đang cố truy cập vào trang KHÔNG phải public (ví dụ: /dashboard, /, ...)
  if (!token && !isPublicPath) {
    // Chuyển hướng về trang đăng nhập
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  // TRƯỜNG HỢP B: Người dùng ĐÃ đăng nhập (có token)
  // Nhưng lại cố truy cập vào trang /signin
  if (token && isPublicPath) {
    // Chuyển hướng thẳng vào dashboard (tránh việc login rồi lại vào trang login)
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Nếu không vi phạm gì, cho phép đi tiếp
  return NextResponse.next()
}

// Cấu hình Matcher để middleware chỉ chạy trên các đường dẫn cần thiết
export const config = {
  matcher: [
    /*
     * Match tất cả các request paths ngoại trừ:
     * 1. /api (Các route API không nên bị chặn bởi middleware này nếu dùng cho public)
     * 2. /_next/static (File tĩnh của Next.js)
     * 3. /_next/image (File ảnh tối ưu hóa)
     * 4. favicon.ico, images, fonts (Các file asset public)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
