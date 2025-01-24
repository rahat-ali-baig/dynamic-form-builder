import React from "react";
import {
  FaRegFileAlt,
  FaList,
  FaCheckSquare,
  FaUpload,
  FaThLarge,
  FaCalendarAlt,
  FaPhone,
} from "react-icons/fa";
import { IoMdRadioButtonOn } from "react-icons/io";

const Sidebar = ({ onAddElement }) => {
  const options = [
    { label: "Text Field", icon: <FaRegFileAlt />, type: "text" },
    { label: "Dropdown", icon: <FaList />, type: "dropdown" },
    { label: "Radio Button", icon: <IoMdRadioButtonOn />, type: "radio" },
    { label: "File Upload", icon: <FaUpload />, type: "fileupload" },
    { label: "Checkbox", icon: <FaCheckSquare />, type: "checkbox" },
    { label: "Country", icon: <FaThLarge />, type: "country" },
    { label: "Date Picker", icon: <FaCalendarAlt />, type: "datepicker" },
    { label: "Phone Number", icon: <FaPhone />, type: "phone" },
    { label: "Section", icon: <FaThLarge />, type: "section" },
  ];

  return (
    <div className="w-[320px] h-screen p-4 bg-gray-50 shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Plutus21 Form Builder
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-4 bg-white shadow rounded-lg hover:bg-gray-200 cursor-pointer transition"
            onClick={() => onAddElement(option.type)}
          >
            <div className="text-2xl text-gray-700">{option.icon}</div>
            <span className="mt-2 text-sm font-medium text-gray-800">
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
