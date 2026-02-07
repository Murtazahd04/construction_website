import React from 'react';

const Button = ({ text, onClick, type = 'button', variant = 'primary', disabled = false }) => {
  const baseStyle = "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300";
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-500 hover:bg-gray-600 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {text}
    </button>
  );
};

export default Button;