"use client";

import { useState, useEffect, useCallback } from "react";

/**
 * Props:
 * - sections: [{ id, label }]
 * - onValidationChange?: function(validationsMap) => void
 * - offset?: number (not used if using scroll-margin-top)
 */
export default function ScrollSpyNavigation({
    sections = [],
    onValidationChange,
    offset = 0,
}) {
    const [activeId, setActiveId] = useState(sections[0]?.id || null);
    const [validations, setValidations] = useState({}); // { [id]: boolean }

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
            try {
                next[s.id] = validateSection(s.id);
            } catch (e) {
                next[s.id] = false;
            }
        });
        setValidations((prev) => {
            const same = sections.every((s) => prev[s.id] === next[s.id]);
            return same ? prev : next;
        });
    }, [sections, validateSection]);

    useEffect(() => {
        if (typeof onValidationChange === "function") {
            onValidationChange(validations);
        }
    }, [validations, onValidationChange]);

    useEffect(() => {
        if (!sections || sections.length === 0) {
            setActiveId(null);
            setValidations({});
            return;
        }

        setActiveId((prev) => prev || sections[0]?.id || null);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                root: null,
                rootMargin: "-10% 0px -50% 0px",
                threshold: 0,
            }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        // initial validate and listeners
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
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    On This Page
                </h3>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="On this page">
                <ul className="space-y-1">
                    {sections.map((section) => {
                        const isActive = activeId === section.id;
                        const isValid = !!validations[section.id];

                        return (
                            <li key={section.id}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(section.id);
                                    }}
                                    className={`
                                        w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-between
                                        ${isActive
                                            ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600 pl-2. 5'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent pl-2.5'
                                        }
                                    `}
                                    aria-current={isActive ? "true" : "false"}
                                >
                                    <span className={isActive ? 'font-semibold' : ''}>
                                        {section.label}
                                    </span>

                                    {/* Validation Icon */}
                                    {isValid && (
                                        <i
                                            className={`text-base ${isActive ? 'ri-checkbox-circle-fill text-blue-600' : 'ri-checkbox-circle-line text-gray-400'}`}
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}