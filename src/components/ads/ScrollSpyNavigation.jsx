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
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <div className="sticky top-24 space-y-4">
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        On this page
                    </h3>

                    <nav className="flex flex-col space-y-1" aria-label="On this page">
                        {sections.map((section) => {
                            const isActive = activeId === section.id;
                            const isValid = !!validations[section.id];
                            const showGreen = isActive && isValid;

                            let iconClass = "ri-checkbox-blank-line text-gray-300";
                            if (showGreen) iconClass = "ri-checkbox-circle-fill text-green-600";
                            else if (isValid) iconClass = "ri-checkbox-circle-fill text-gray-400";

                            return (
                                <button
                                    key={section.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToSection(section.id);
                                    }}
                                    className={`group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 w-full text-left
                    ${isActive
                                            ? "bg-blue-50 text-blue-700 shadow-sm border-l-4 border-blue-600 pl-2"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent pl-2"
                                        }`}
                                    aria-current={isActive ? "true" : "false"}
                                >
                                    <span className="flex items-center gap-3">
                                        <span>{section.label}</span>
                                    </span>

                                    <span className="ml-2 flex items-center">
                                        <i className={`${iconClass} text-lg`} aria-hidden="true" />
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </aside>
    );
}