export const validateImages = (currentImages, newFiles) => {
    const MAX_COUNT = 5;
    const MAX_SIZE_MB = 25;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024; // 25MB tính bằng bytes

    // 1. Kiểm tra số lượng ảnh
    if (currentImages.length + newFiles.length > MAX_COUNT) {
        return {
            isValid: false,
            message: `You can only upload a maximum of ${MAX_COUNT} images.`
        };
    }

    // 2. Tính tổng dung lượng hiện tại + mới
    const currentTotalSize = currentImages.reduce((acc, img) => acc + img.file.size, 0);
    const newFilesSize = newFiles.reduce((acc, file) => acc + file.size, 0);
    const totalSize = currentTotalSize + newFilesSize;

    // 3. Kiểm tra tổng dung lượng
    if (totalSize > MAX_SIZE_BYTES) {
        return {
            isValid: false,
            message: `Total size of all images must not exceed ${MAX_SIZE_MB}MB. (Current: ${(totalSize / (1024 * 1024)).toFixed(2)}MB)`
        };
    }

    return { isValid: true };
};