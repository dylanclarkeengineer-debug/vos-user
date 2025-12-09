'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { API_ROUTES } from '@/constants/apiRoute';

// keep libraries outside component for perf
const LIBRARIES = ['places'];

export default function LocationAutoComplete({ selectedState, value, onChange, disabled, onLocationSelect }) {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const wrapperRef = useRef(null);

    const autocompleteService = useRef(null);
    const placesService = useRef(null);

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: API_ROUTES.GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    useEffect(() => {
        if (isLoaded && !autocompleteService.current && window.google) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
            const mapDiv = document.createElement('div');
            placesService.current = new window.google.maps.places.PlacesService(mapDiv);
        }
    }, [isLoaded]);

    // Debounced search: NO LONGER requires selectedState — search directly from user input
    useEffect(() => {
        if (!isLoaded || !value || value.length < 2) {
            setSuggestions([]);
            return;
        }

        if (!showDropdown && suggestions.length > 0) return;

        const delayDebounce = setTimeout(() => {
            if (!autocompleteService.current) return;

            setIsLoading(true);

            // send only the user input (no forced state append). Keep country bias if desired.
            const request = {
                input: value,
                componentRestrictions: { country: 'us' }, // keep country restriction if your app is US-only
            };

            autocompleteService.current.getPlacePredictions(request, (results, status) => {
                setIsLoading(false);
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                    setSuggestions(results);
                    setShowDropdown(true);
                } else {
                    setSuggestions([]);
                }
            });
        }, 350);

        return () => clearTimeout(delayDebounce);
    }, [value, isLoaded]);

    const extractComponent = (components, type) => {
        const component = components.find(c => c.types.includes(type));
        return component ? component.short_name : '';
    };

    const extractCity = (components) => {
        const locality = components.find(c => c.types.includes('locality'));
        if (locality) return locality.long_name;
        const postalTown = components.find(c => c.types.includes('postal_town'));
        if (postalTown) return postalTown.long_name;
        const sublocality = components.find(c => c.types.includes('sublocality'));
        if (sublocality) return sublocality.long_name;
        const neighborhood = components.find(c => c.types.includes('neighborhood'));
        if (neighborhood) return neighborhood.long_name;
        const admin2 = components.find(c => c.types.includes('administrative_area_level_2'));
        if (admin2) return admin2.long_name;
        return '';
    };

    const handleSelect = (place) => {
        // show selected description in input immediately
        onChange(place.description);

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

                    let finalAddress = placeDetails.formatted_address || '';
                    if (placeDetails.name && finalAddress && !finalAddress.includes(placeDetails.name)) {
                        finalAddress = `${placeDetails.name}, ${finalAddress}`;
                    } else if (!finalAddress) {
                        // fallback: use structured_formatting main_text when formatted_address missing
                        finalAddress = place.structured_formatting?.main_text || place.description || placeDetails.name || '';
                    }

                    const locationData = {
                        country: extractComponent(comps, 'country') || 'US',
                        location: placeDetails.name || (place.structured_formatting && place.structured_formatting.main_text) || '', // short place name
                        fullAddress: finalAddress,   // full formatted address
                        state: extractComponent(comps, 'administrative_area_level_1'),
                        city: extractCity(comps),
                        zipcode: extractComponent(comps, 'postal_code'),
                        latitude: placeDetails.geometry?.location?.lat ? placeDetails.geometry.location.lat() : 0,
                        longitude: placeDetails.geometry?.location?.lng ? placeDetails.geometry.location.lng() : 0
                    };

                    // update input with full address for clarity
                    onChange(locationData.fullAddress || locationData.location);

                    onLocationSelect(locationData);
                } else {
                    console.error("Google Maps getDetails failed:", status);
                }
            });
        }

        setShowDropdown(false);
    };

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
                    placeholder="Enter street/place (e.g. Diamond Bar Center)..."
                    value={value}
                    onChange={(e) => { onChange(e.target.value); setShowDropdown(true); }}
                    onFocus={() => { if (value && value.length >= 2) setShowDropdown(true); }}
                    disabled={disabled}
                    className="border-gray-300 bg-white pr-8"
                    autoComplete="off"
                />

                {isLoading && (
                    <div className="absolute right-3 top-2.5 text-gray-400">
                        <i className="ri-loader-4-line animate-spin"></i>
                    </div>
                )}
            </div>

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
                                        <span className="text-sm font-semibold text-gray-800">{mainText}</span>
                                        <span className="text-[10px] text-gray-500 truncate">{secondaryText}</span>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            {showDropdown && !isLoading && suggestions.length === 0 && value.length > 2 && (
                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 shadow-xl">
                    <p className="text-sm text-gray-500 italic text-center">
                        No locations found
                    </p>
                </div>
            )}
        </div>
    );
}