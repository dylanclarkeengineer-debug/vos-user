"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Props:
 * - sections: [{ id, label }]
 * - onValidationChange?: function(validationsMap) => void
 * - offset?: number (not used if using scroll-margin-top)
 * - onCancel, onSaveDraft, onPublish, isLoading, publishEnabled: (Added for Action Buttons integration if needed here, or keep separate)
 */
export default function ScrollSpyNavigation({
    sections = [],
    onValidationChange,
    onCancel,
    onSaveDraft,
    onPublish,
    isLoading,
    publishEnabled
}) {
    const [activeId, setActiveId] = useState(sections[0]?.id || null);
    const [validations, setValidations] = useState({}); // { [id]: boolean }

    // --- Validation Logic (Giữ nguyên) ---
    const validateSection = useCallback((id) => {
        const container = document.getElementById(id);
        if (!container) return false;

        const requiredEls = Array.from(
            container.querySelectorAll("input[required], textarea[required], select[required]")
        ).filter((el) => !el.disabled);

        if (requiredEls.length === 0) return true;

        for (const el of requiredEls) {
            const tag = el.tagName.toLowerCase();
            if (tag === "select") {
                if (!el.value || el.value === "" || el.value === "none") return false;
            } else if (tag === "textarea") {
                if (!el.value || String(el.value).trim() === "") return false;
            } else if (tag === "input") {
                const type = (el.getAttribute("type") || "text").toLowerCase();
                if (type === "checkbox" || type === "radio") {
                    const name = el.getAttribute("name");
                    if (name) {
                        const checked = container.querySelectorAll(`input[name="${CSS.escape(name)}"]:checked`);
                        if (checked.length === 0) return false;
                    } else {
                        if (!el.checked) return false;
                    }
                } else {
                    if (!el.value || String(el.value).trim() === "") return false;
                }
            }
        }
        return true;
    }, []);

    const validateAll = useCallback(() => {
        const next = {};
        sections.forEach((s) => {
            try { next[s.id] = validateSection(s.id); } catch (e) { next[s.id] = false; }
        });
        setValidations((prev) => {
            const same = sections.every((s) => prev[s.id] === next[s.id]);
            return same ? prev : next;
        });
    }, [sections, validateSection]);

    // --- Effects (Giữ nguyên) ---
    useEffect(() => {
        if (typeof onValidationChange === "function") {
            onValidationChange(validations);
        }
    }, [validations, onValidationChange]);

    useEffect(() => {
        if (!sections || sections.length === 0) { setActiveId(null); setValidations({}); return; }
        setActiveId((prev) => prev || sections[0]?.id || null);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActiveId(entry.target.id);
                });
            },
            { root: null, rootMargin: "-10% 0px -50% 0px", threshold: 0 }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        validateAll();
        const handler = () => validateAll();
        document.addEventListener("input", handler, true);
        document.addEventListener("change", handler, true);
        window.addEventListener("resize", handler);

        return () => {
            observer.disconnect();
            document.removeEventListener("input", handler, true);
            document.removeEventListener("change", handler, true);
            window.removeEventListener("resize", handler);
        };
    }, [sections, validateAll]);

    const scrollToSection = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        setActiveId(id);
        setTimeout(() => validateAll(), 200);
    };

    if (!sections || sections.length === 0) return null;

    return (
        <div className="flex flex-col gap-4 p-4"> {/* Container chính của Sidebar */}

            {/* 1. NAVIGATION BOX (Card Style) */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="bg-gray-50/50 px-4 py-3 border-b border-gray-100">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                        Quick Navigation
                    </h3>
                </div>

                <nav className="p-2" aria-label="On this page">
                    <ul className="space-y-0.5">
                        {sections.map((section) => {
                            const isActive = activeId === section.id;
                            const isValid = !!validations[section.id];

                            return (
                                <li key={section.id}>
                                    <button
                                        onClick={(e) => { e.preventDefault(); scrollToSection(section.id); }}
                                        className={`
                                            w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group
                                            ${isActive
                                                ? 'bg-blue-50 text-blue-700'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }
                                        `}
                                        aria-current={isActive ? "true" : "false"}
                                    >
                                        <div className="flex items-center gap-2">
                                            {/* Dot indicator for active state */}
                                            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-300 group-hover:bg-gray-400'}`}></span>
                                            <span>{section.label}</span>
                                        </div>

                                        {/* Validation Icon (Check xanh) */}
                                        <i className={`text-base transition-colors ${isValid ? 'ri-checkbox-circle-fill text-green-500' : 'ri-checkbox-circle-line text-gray-300'}`} aria-hidden="true" />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}