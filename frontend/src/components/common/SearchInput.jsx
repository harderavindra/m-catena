import React from "react";
import { FiSearch, FiX } from "react-icons/fi";

const SearchInput = ({ value, onChange, onClear, placeholder }) => {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder || "Search..."}
                className="bg-white border border-gray-300 focus:outline-blue-300/50 rounded-md px-3 py-1 pr-5"
                value={value}
                onChange={onChange}
            />
            {value && (
                <button
                    className="absolute right-6 top-0 h-full w-8 text-gray-500 text-lg focus:outline-0"
                    onClick={onClear}
                >
                    <FiX />
                </button>
            )}
            <FiSearch size={16} className="absolute top-2 right-2 text-gray-500" />
        </div>
    );
};

export default SearchInput;
