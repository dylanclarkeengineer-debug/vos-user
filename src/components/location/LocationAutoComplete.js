'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ROUTES } from '@/constants/apiRoute';

// 1. PERFORMANCE FIX: Khai báo mảng libraries bên ngoài Component
const LIBRARIES = ['places'];

export default function LocationAutoComplete({ selectedState, value, onChange, disabled, onLocationSelect }) {

    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);

    // Services Refs
    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    // 2. Load Google Maps Script
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: API_ROUTES.GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    // 3. Khởi tạo Services (ĐÃ SỬA LỖI TÊN CLASS TẠI ĐÂY)
    useEffect(() => {
        if (isLoaded && !autocompleteService.current && window.google) {
            // SỬA: Dùng AutocompleteService thay vì AutocompleteSuggestion (không tồn tại)
            autocompleteService.current = new window.google.maps.places.AutocompleteService();

            const mapDiv = document.createElement('div');
            // SỬA: Dùng PlacesService thay vì Place (Place không có hàm getDetails như cách bạn dùng)
            placesService.current = new window.google.maps.places.PlacesService(mapDiv);
        }
    }, [isLoaded]);

    // Debounce search
    useEffect(() => {
        if (!isLoaded || !selectedState || !value || value.length < 2) {
            setSuggestions([]);
            return;
        }

        if (!showDropdown && suggestions.length > 0) return;

        const delayDebounce = setTimeout(() => {
            if (!autocompleteService.current) return;

            setIsLoading(true);

            // 1. INPUT: Chỉ gửi từ khóa user nhập + Tên bang để Google định hướng (Bias)
            // Bỏ dấu phẩy cứng nhắc, dùng khoảng trắng để Google tự hiểu context
            const request = {
                input: `${value} ${selectedState}`,
                componentRestrictions: { country: 'us' },
            };

            autocompleteService.current.getPlacePredictions(request, (results, status) => {
                setIsLoading(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {

                    // 2. FILTER: Dùng Regex để tìm mã bang (VD: "CA") xuất hiện như một từ riêng biệt
                    // \b là ranh giới từ -> đảm bảo tìm thấy "CA" nhưng không bắt nhầm "CAT" hay "CAR"
                    const stateRegex = new RegExp(`\\b${selectedState}\\b`, 'i');

                    const filtered = results.filter(place => {
                        // Kiểm tra xem mã bang có xuất hiện trong description không
                        return stateRegex.test(place.description);
                    });

                    setSuggestions(filtered);
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                }
            });
        }, 400);

        return () => clearTimeout(delayDebounce);
    }, [value, selectedState, isLoaded]);

    // Helper functions
    const extractComponent = (components, type) => {
        const component = components.find(c => c.types.includes(type));
        return component ? component.short_name : '';
    };

    const extractCity = (components) => {
        const locality = components.find(c => c.types.includes('locality'));
        if (locality) return locality.long_name;

        const sublocality = components.find(c => c.types.includes('sublocality'));
        if (sublocality) return sublocality.long_name;

        const neighborhood = components.find(c => c.types.includes('neighborhood'));
        if (neighborhood) return neighborhood.long_name;

        return '';
    };

    // Xử lý khi user chọn 1 địa điểm
    const handleSelect = (place) => {
        onChange(place.description);

        // --- ERROR FIX: Kiểm tra kỹ place_id ---
        if (!place || !place.place_id) {
            console.error("Missing Place ID. Cannot fetch details.", place);
            setShowDropdown(false);
            return;
        }

        if (placesService.current && onLocationSelect) {
            const request = {
                placeId: place.place_id,
                fields: ['name', 'geometry', 'address_components', 'formatted_address']
            };

            placesService.current.getDetails(request, (placeDetails, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && placeDetails) {
                    const comps = placeDetails.address_components || [];

                    let finalAddress = placeDetails.formatted_address;
                    if (placeDetails.name && !finalAddress.includes(placeDetails.name)) {
                        finalAddress = `${placeDetails.name}, ${finalAddress}`;
                    }
                    // --------------------

                    const locationData = {
                        country: extractComponent(comps, 'country') || 'US',
                        location: placeDetails.name, // Đây chính là cái tên "Dia..." bạn cần
                        fullAddress: finalAddress,   // Đã sửa: Chứa cả tên + địa chỉ
                        state: extractComponent(comps, 'administrative_area_level_1'),
                        city: extractCity(comps),
                        zipcode: extractComponent(comps, 'postal_code'),
                        latitude: placeDetails.geometry?.location?.lat() || 0,
                        longitude: placeDetails.geometry?.location?.lng() || 0
                    };

                    console.log("Location Data:", locationData);
                    onChange(finalAddress);

                    onLocationSelect(locationData);
                } else {
                    console.error("Google Maps GetDetails Failed:", status);
                }
            });
        }

        setShowDropdown(false);
    };

    // Click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!isLoaded) return <div className="h-10 w-full animate-pulse bg-gray-100 rounded-md"></div>;

    return (
        <div className="relative space-y-2" ref={wrapperRef}>
            <Label className="text-sm font-medium text-gray-700">
                Location / City <span className="text-red-500">*</span>
            </Label>

            <div className="relative">
                <Input
                    type="text"
                    placeholder={selectedState ? "Enter specific location (e.g. Diamond Bar Center)..." : "Select State first"}
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setShowDropdown(true);
                    }}
                    onFocus={() => {
                        if (value && value.length >= 2) setShowDropdown(true);
                    }}
                    disabled={disabled || !selectedState}
                    className="border-gray-300 bg-white pr-8"
                    autoComplete="off"
                />

                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-gray-400">
                        <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                )}
            </div>

            {/* Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-100">
                    <ul className="max-h-60 overflow-auto py-1">
                        {suggestions.map((item) => {
                            const mainText = item.structured_formatting.main_text;
                            const secondaryText = item.structured_formatting.secondary_text;

                            return (
                                <li
                                    key={item.place_id}
                                    onClick={() => handleSelect(item)}
                                    className="cursor-pointer px-4 py-2 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-semibold text-gray-800">
                                            {mainText}
                                        </span>
                                        <span className="text-[10px] text-gray-500 truncate">
                                            {secondaryText}
                                        </span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {/* Not found */}
            {showDropdown && !isLoading && suggestions.length === 0 && value.length > 2 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 shadow-xl">
                    <p className="text-sm text-gray-500 italic text-center">
                        No location found in {selectedState}
                    </p>
                </div>
            )}

            {!selectedState && (
                <p className="text-[10px] text-orange-500 flex items-center gap-1 mt-1">
                    <i className="ri-alert-line"></i> Select State first to search location
                </p>
            )}
        </div>
    );
}