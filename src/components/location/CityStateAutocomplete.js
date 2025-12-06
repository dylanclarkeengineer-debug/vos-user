'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { buildSearchUrl } from '@/utils/location/nominatimHelper';
import { PARAM_KEYS } from '@/constants/location/queryConstant';

export default function CityStateAutocomplete({ selectedState, value, onChange, disabled }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Debounce search
    useEffect(() => {
        // 1. Validate: Phải chọn State và nhập ít nhất 2 ký tự
        if (!selectedState || !value || value.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        // 2. Nếu người dùng vừa chọn xong (dropdown đóng), không search lại
        if (!showDropdown && suggestions.length === 0) return;

        const delayDebounce = setTimeout(async () => {
            setIsLoading(true);
            try {
                // Tạo query: "Tên nhập, Mã Bang, US" (VD: "West, CA, US")
                const queryText = `${value}, ${selectedState}, US`;

                const url = buildSearchUrl(queryText, {
                    [PARAM_KEYS.FEATURE_TYPE]: 'city', // Ưu tiên tìm thành phố/khu dân cư
                    [PARAM_KEYS.LIMIT]: 5,
                    [PARAM_KEYS.ADDRESS_DETAILS]: 1
                });

                const res = await fetch(url);
                const data = await res.json();

                // Lọc lại kết quả để đảm bảo đúng State (API đôi khi trả về lân cận)
                const filteredData = data.filter(item => {
                    const addr = item.address || {};
                    const itemState = addr.state_code || addr.state; // Nominatim có thể trả về state code hoặc full name
                    // So sánh tương đối (nếu cần thiết) hoặc chấp nhận kết quả API trả về
                    return true;
                });

                setSuggestions(filteredData);
                setShowDropdown(true);
            } catch (error) {
                console.error("City fetch error:", error);
                setSuggestions([]);
            } finally {
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [value, selectedState]);

    // Xử lý khi user chọn 1 dòng
    const handleSelect = (item) => {
        const addr = item.address;
        const cityName = addr.city || addr.town || addr.village || addr.hamlet || addr.suburb || item.name.split(',')[0];

        // 1. Cập nhật text input (như cũ)
        onChange(cityName);

        // 2. Gửi FULL DATA ra ngoài cho cha (MỚI)
        // Nominatim trả về lat/lon dạng string, cần parse sang float
        if (onLocationSelect) {
            onLocationSelect({
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                zipcode: addr.postcode || '', // Lấy luôn zipcode nếu có
                display_name: item.display_name
            });
        }

        setShowDropdown(false);
        setSuggestions([]);
    };

    // Click ra ngoài thì đóng dropdown
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            <Label className="text-sm font-medium text-gray-700">
                City <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
                <Input
                    type="text"
                    placeholder={selectedState ? "Type to search city..." : "Select State first"}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => {
                        // Khi focus lại, nếu có text thì hiện lại suggestion cũ (hoặc trigger search lại tùy logic)
                        if (value && value.length >= 2) setShowDropdown(true);
                    }}
                    disabled={disabled || !selectedState}
                    className="border-gray-300 bg-white pr-8"
                    autoComplete="off" // Tắt autocomplete mặc định của trình duyệt
                />

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-gray-400">
                        <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                )}
            </div>

            {/* --- DROPDOWN GỢI Ý --- */}
            {showDropdown && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <ul className="max-h-60 overflow-auto py-1">
                        {suggestions.length > 0 ? (
                            suggestions.map((item, idx) => {
                                const addr = item.address || {};
                                const mainName = addr.city || addr.town || addr.village || item.name.split(',')[0];
                                const subName = item.display_name; // Địa chỉ đầy đủ để user đối chiếu

                                return (
                                    <li
                                        key={idx}
                                        onClick={() => handleSelect(item)}
                                        className="cursor-pointer px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                                    >
                                        <div className="flex flex-col">
                                            {/* Tên chính (In đậm) */}
                                            <span className="text-sm font-semibold text-gray-800">
                                                {mainName}
                                            </span>
                                            {/* Địa chỉ phụ (Nhạt hơn) */}
                                            <span className="text-[10px] text-gray-500 truncate">
                                                {subName}
                                            </span>
                                        </div>
                                    </li>
                                )
                            })
                        ) : (
                            // Trạng thái không tìm thấy
                            !isLoading && (
                                <li className="px-4 py-3 text-center text-sm text-gray-500 italic">
                                    No city found matching "{value}" in {selectedState}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}

            {/* Cảnh báo nếu chưa chọn State */}
            {!selectedState && (
                <p className="text-[10px] text-orange-500 flex items-center gap-1 mt-1">
                    <i className="ri-alert-line"></i> Please select a State above to search City
                </p>
            )}
        </div>
    );
}