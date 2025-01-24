import React, { useMemo, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import countryList from 'react-select-country-list';
import { DatePicker, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FormPreview = ({ sections, togglePreview, formName }) => {
  const [value, setValue] = useState('');
  const options = useMemo(() => countryList().getData(), []);

  // Build validation schema dynamically from sections
  const validationSchema = Yup.object(
    sections.reduce((schema, section) => {
      section.fields.forEach((field) => {
        if (field.type === "text") {
          schema[field.name] = Yup.string().required(`${field.label} is required.`);
        } else if (field.type === "tel") {
          schema[field.name] = Yup.string()
            .matches(new RegExp(field.pattern || ".*"), "Invalid phone number.")
            .required(`${field.label} is required.`);
        } else if (field.type === "select" || field.type === "country") {
          schema[field.name] = Yup.mixed()
            .nullable()
            .required(`${field.label} is required.`);
        } else if (field.type === "radio") {
          schema[field.name] = Yup.string().required(`${field.label} is required.`);
        } else if (field.type === "checkbox") {
          schema[field.name] = Yup.array().min(1, `At least one ${field.label} option is required.`);
        } else if (field.type === "datepicker") {
          schema[field.name] = Yup.date().required(`${field.label} is required.`);
        } else if (field.type === "fileupload") {
          schema[field.name] = Yup.mixed().required(`${field.label} is required.`);
        }
      });
      return schema;
    }, {})
  );

  // Initialize Formik
  const formik = useFormik({
    initialValues: sections.reduce((values, section) => {
      section.fields.forEach((field) => {
        // Initialize fields based on their type
        if (field.type === "select" || field.type === "radiobutton" || field.type === "country" || field.type === "datepicker" || field.type === "fileupload") {
          values[field.name] = null; // Initialize select/radio/country/date/file fields with null
        } else if (field.type === "checkboxes") {
          values[field.name] = []; // Initialize checkboxes with an empty array
        } else {
          values[field.name] = ""; // Initialize text/phone fields as empty strings
        }
      });
      return values;
    }, {}),
    validationSchema,
    onSubmit: (values) => {
      console.log({ formName, values });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="w-1/2 h-screen p-10 overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Form Preview</h2>
        <button
          onClick={togglePreview}
          type="button"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Editor
        </button>
      </div>

      {sections.map((section) => (
        <div key={section.id} className="mb-6">
          <h3 className="text-md font-semibold mb-3 border-b border-b-black/30">
            {section.name}
          </h3>
          <div className="space-y-4 p-4">
            {section.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>

                {/* Select Field */}
                {field.type === "select" && (
                  <Select
                    id={field.name}
                    name={field.name}
                    options={field.options.map((option) => ({
                      value: option.value,
                      label: option.value,
                    }))}
                    value={formik.values[field.name]}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(field.name, selectedOption)
                    }
                    onBlur={() => formik.setFieldTouched(field.name, true)}
                    className={`react-select-container ${formik.touched[field.name] && formik.errors[field.name]
                      ? "border border-red-500 rounded"
                      : ""
                      }`}
                    classNamePrefix="react-select"
                    placeholder={`Select ${field.label}`}
                    isClearable
                  />
                )}

                {/* Country Field */}
                {field.type === "country" && (
                  <Select
                    id={field.name}
                    name={field.name}
                    options={options}
                    value={formik.values[field.name]}
                    onChange={(selectedOption) =>
                      formik.setFieldValue(field.name, selectedOption)
                    }
                    onBlur={() => formik.setFieldTouched(field.name, true)}
                    className={`react-select-container ${formik.touched[field.name] && formik.errors[field.name]
                      ? "border border-red-500 rounded"
                      : ""
                      }`}
                    classNamePrefix="react-select"
                    placeholder={`Select ${field.label}`}
                    isClearable
                  />
                )}

                {/* DatePicker */}
                {field.type === "datepicker" && (
                  <DatePicker
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    onChange={(date) => formik.setFieldValue(field.name, date)}
                    onBlur={() => formik.setFieldTouched(field.name, true)}
                    className={`w-full p-2 ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-500" : "border-gray-300"} rounded-lg`}
                  />
                )}

                {/* File Upload */}
                {field.type === "fileupload" && (
                    <Upload
                      id={field.name}
                      name={field.name}
                      fileList={formik.values[field.name] || []}
                      beforeUpload={() => false} // Prevent automatic upload
                      onChange={({ fileList }) => formik.setFieldValue(field.name, fileList)}
                      onBlur={() => formik.setFieldTouched(field.name, true)}
                      className={`w-full ${formik.touched[field.name] && formik.errors[field.name] ? "border-red-500" : "border-gray-300"} rounded-lg`}
                    >
                      <button type="button" className="ant-btn ant-btn-primary flex flex-col justify-center items-center w-20 h-20 rounded-lg border border-black/10 my-2">
                        <UploadOutlined className="text-3xl" /> Upload
                      </button>
                    </Upload>
                )}

                {/* Error Message */}
                {formik.touched[field.name] && formik.errors[field.name] && (
                  <span className="text-xs text-red-500">{formik.errors[field.name]}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="py-1 px-4 rounded-full text-lg text-white bg-green-500 border-none"
      >
        Submit
      </button>
    </form>
  );
};

export default FormPreview;
