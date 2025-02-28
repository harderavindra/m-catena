import React from "react";

const Button = ({ children, onClick, type = "button", variant = "primary", disabled = false }) => {
  const baseStyles = "px-4 py-2 rounded-lg font-medium transition-all duration-300 cursor-pointer";
  const variants = {
    primary: "bg-red-500 text-white hover:bg-red-600",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-600 text-gray-600 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};

export default Button;
