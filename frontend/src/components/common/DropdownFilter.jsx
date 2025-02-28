import React from "react";
import { FiX } from "react-icons/fi";

const DropdownFilter = ({ options, value, onChange, onClear }) => {
    return (
        <div className="relative">
            <select
                className="bg-white border border-gray-300 focus:outline-blue-300/50 rounded-md px-3 py-1 pr-8"
                value={value}
                onChange={onChange}
            >
                <option value="">All {options.label}</option>
                {options.items.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
            {value && (
                <button
                    className="absolute right-2 top-0 h-full w-8 text-gray-500 text-lg focus:outline-0"
                    onClick={onClear}
                >
                    <FiX />
                </button>
            )}
        </div>
    );
};

export default DropdownFilter;
