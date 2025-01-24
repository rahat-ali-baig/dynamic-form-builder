import React, { useState } from "react";
import { FaEdit, FaSave } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import Sidebar from "./Sidebar";
import "react-phone-input-2/lib/style.css";
import { HiPlus } from "react-icons/hi";
import FormPreview from "./FormPreview";

const App = () => {
  const [sections, setSections] = useState([]);
  const [formName, setFormName] = useState("Form Title");
  const [editingFormName, setEditingFormName] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  const addSection = () => {
    const newSection = {
      id: sections.length + 1,
      name: `Section ${sections.length + 1}`,
      editingName: false,
      fields: [],
    };
    setSections([...sections, newSection]);
    setSelectedSection(newSection.id); // Automatically select the newly created section
  };

  const addFieldToSection = (type) => {
    if (!selectedSection) return;

    const updatedSections = sections.map((section) => {
      if (section.id === selectedSection) {
        let newField = {};

        switch (type) {
          case "childsection":
            newField = {
              label: `Child Section ${section.fields.length + 1}`,
              type: "childsection",
              id: `child-${section.fields.length + 1}`,
              fields: [], // Child section's fields
              name: `child-${section.fields.length + 1}`,
            };
            break;
          case "text":
            newField = {
              label: "Text Field Label",
              type: "text", // Fixed type for text input
              allowedTypes: ["text", "number", "email"],
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
            };
            break;
          case "phone":
            newField = {
              label: "Phone Number",
              type: "tel", // Fixed type for phone input
              allowedTypes: ["tel"],
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
              pattern: /^\+?[1-9]\d{1,4}([-\s]?\d{1,15}){1,4}$/,
            };
            break;
          case "dropdown":
            newField = {
              label: "Select Field",
              type: "select", // Fixed type for select dropdown
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
              options: [], // Array to store options
            };
            break;
          case "radio":
            newField = {
              label: "Add label",
              type: "radiobutton",
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
              options: [],
            };
            break;
          case "checkbox":
            newField = {
              label: "Add checkbox label",
              type: "checkboxes",
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
              options: [],
            };
            break;
          case "country":
            newField = {
              label: "Add country label",
              type: "country",
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
              options: [],
            };
            break;
          case "datepicker":
            newField = {
              label: "Date",
              type: "datepicker",
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
            };
            break;
          case "fileupload":
            newField = {
              label: "Upload File",
              type: "fileupload",
              name: `field${section.fields.length + 1}`,
              editingLabel: false,
            };
            break;
          default:
            return section;
        }

        return {
          ...section,
          fields: [...section.fields, newField],
        };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const updateField = (sectionId, fieldIndex, updatedField) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedFields = [...section.fields];
        updatedFields[fieldIndex] = updatedField;
        return { ...section, fields: updatedFields };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const updateSectionName = (sectionId, newName) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              name: newName,
              editingName: false,
              editingValue: undefined,
            }
          : section
      )
    );
  };

  const removeSection = (sectionId) => {
    setSections(sections.filter((section) => section.id !== sectionId));
    if (selectedSection === sectionId) {
      setSelectedSection(null); // Reset selected section if removed
    }
  };

  const removeField = (sectionId, fieldIndex) => {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        const updatedFields = section.fields.filter(
          (_, index) => index !== fieldIndex
        );
        return { ...section, fields: updatedFields };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const onAddElement = (type) => {
    if (type === "section") {
      addSection(); // Call addSection when 'section' is selected
    } else {
      addFieldToSection(type); // Call addFieldToSection when other element types are selected
    }
  };

  const renderFields = (fields, parentId) =>
    fields.map((field, index) => (
      <div key={field.id || index} className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          {field.label}
        </label>

        {field.type === "childsection" ? (
          <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
            <h3 className="text-lg font-semibold mb-2">{field.label}</h3>

            {/* Render nested fields recursively */}
            {renderFields(field.fields, field.id)}

            {/* Add fields to the child section */}
            <button
              onClick={() => addFieldToChildSection(parentId, field.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Add Field to Child Section
            </button>

            {/* Submit button for the child section */}
            <button
              onClick={() => submitChildSection(field)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Submit Child Section
            </button>
          </div>
        ) : (
          <input
            type={field.type === "tel" ? "number" : field.type}
            placeholder={field.label}
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        )}
      </div>
    ));

  const addFieldToChildSection = (parentId, childId) => {
    const updatedSections = sections.map((section) => {
      if (section.id === parentId) {
        const updatedFields = section.fields.map((field) => {
          if (field.id === childId) {
            const newField = {
              label: `Field ${field.fields.length + 1}`,
              type: "text",
              name: `field-${field.fields.length + 1}`,
            };
            return {
              ...field,
              fields: [...field.fields, newField],
            };
          }
          return field;
        });

        return {
          ...section,
          fields: updatedFields,
        };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const submitChildSection = (childSection) => {
    console.log("Submitted child section:", childSection);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar onAddElement={onAddElement} />
      <div className="flex-grow flex items-start">
        {/* Form Builder */}
        {showPreview ? (
          <FormPreview
            sections={sections}
            togglePreview={togglePreview}
            formName={formName}
          />
        ) : (
          <div className="w-1/2 p-10 bg-gray-50 h-screen overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-bold">Form Builder</h1>
              <button
                onClick={togglePreview}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {showPreview ? "Back to Editor" : "Preview"}
              </button>
            </div>

            <div className="flex items-center justify-center mb-6">
              {editingFormName ? (
                <>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="border px-2 py-1 rounded w-2/3"
                  />
                  <FaSave
                    className="text-green-500 ml-2 cursor-pointer"
                    onClick={() => setEditingFormName(false)}
                  />
                </>
              ) : (
                <>
                  <h1
                    className="text-3xl font-semibold"
                    onClick={() => setEditingFormName(true)}
                  >
                    {formName}
                  </h1>
                  <FaEdit
                    className="text-blue-500 ml-2 cursor-pointer"
                    onClick={() => setEditingFormName(true)}
                  />
                </>
              )}
            </div>

            {sections.length === 0 && (
              <div className="text-center text-gray-500 mb-4">
                Click on any item in the sidebar to start building your form.
              </div>
            )}

            {sections.map((section) => (
              <div
                key={section.id}
                onClick={() => setSelectedSection(section.id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    {section.editingName ? (
                      <>
                        <input
                          type="text"
                          value={section.editingValue ?? section.name} // Use editingValue or fallback to current name
                          onChange={(e) =>
                            setSections(
                              sections.map((s) =>
                                s.id === section.id
                                  ? { ...s, editingValue: e.target.value }
                                  : s
                              )
                            )
                          }
                          className="border px-2 py-1 rounded"
                        />
                        <FaSave
                          className="text-green-500 ml-2 cursor-pointer"
                          onClick={() =>
                            updateSectionName(
                              section.id,
                              section.editingValue || section.name
                            )
                          }
                        />
                      </>
                    ) : (
                      <>
                        <h3
                          className="text-lg font-semibold"
                          onClick={() =>
                            setSections(
                              sections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      editingName: true,
                                      editingValue: section.name,
                                    }
                                  : s
                              )
                            )
                          }
                        >
                          {section.name}
                        </h3>
                        <FaEdit
                          className="text-blue-500 ml-2 cursor-pointer"
                          onClick={() =>
                            setSections(
                              sections.map((s) =>
                                s.id === section.id
                                  ? {
                                      ...s,
                                      editingName: true,
                                      editingValue: section.name,
                                    }
                                  : s
                              )
                            )
                          }
                        />
                      </>
                    )}
                  </div>

                  <MdOutlineDelete
                    className="text-red-500 text-2xl"
                    onClick={() => removeSection(section.id)}
                  />
                </div>

                <div
                  className={`py-4 border-t border-t-black/30 p-2 my-5 ${
                    section.id === selectedSection ? "bg-gray-100" : ""
                  }`}
                >
                  {section.fields.map((field, index) => (
                    <div
                      key={index}
                      className={`mb-7 flex ${
                        field.type === "select" ||
                        field.type === "radiobutton" ||
                        field.type === "checkboxes" ||
                        field.type === "country"
                          ? "flex-col"
                          : "items-center"
                      } gap-1`}
                    >
                      <div className="flex-grow flex items-center gap-2 justify-start">
                        {field.editingLabel ? (
                          <>
                            <input
                              type="text"
                              value={field.editingValue ?? field.label} // Use editingValue or fallback to current label
                              onChange={(e) =>
                                updateField(section.id, index, {
                                  ...field,
                                  editingValue: e.target.value,
                                })
                              }
                              className="border px-2 py-1 rounded w-2/3"
                            />
                            <FaSave
                              className="text-green-500 ml-2 cursor-pointer"
                              onClick={() =>
                                updateField(section.id, index, {
                                  ...field,
                                  label: field.editingValue || field.label,
                                  editingLabel: false,
                                  editingValue: undefined,
                                })
                              }
                            />
                          </>
                        ) : (
                          <div className="w-full flex items-center justify-between gap-2">
                            <div className="flex items-center gap-1">
                              <span
                                onClick={() =>
                                  updateField(section.id, index, {
                                    ...field,
                                    editingLabel: true,
                                    editingValue: field.label,
                                  })
                                }
                              >
                                {field.label || "Field Label"}
                              </span>
                              <FaEdit
                                className="text-blue-500 ml-2 cursor-pointer"
                                onClick={() =>
                                  updateField(section.id, index, {
                                    ...field,
                                    editingLabel: true,
                                    editingValue: field.label,
                                  })
                                }
                              />
                            </div>

                            <MdOutlineDelete
                              className="text-red-500 text-2xl"
                              onClick={() => removeField(section.id, index)}
                            />
                          </div>
                        )}
                      </div>

                      {/* Conditionally render the select dropdown for select fields */}
                      {(field.type === "select" ||
                        field.type === "radiobutton" ||
                        field.type === "checkboxes" ||
                        field.type === "country") && (
                        <div className="flex flex-col gap-4 p-4 rounded-md bg-gray-50">
                          <span className="text-xs opacity-70">
                            {field.type === "country"
                              ? "(Its optional, it will be auto populated if you leave it)"
                              : ""}
                          </span>

                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              placeholder="Enter new option"
                              value={field.newOption || ""}
                              onChange={(e) =>
                                updateField(section.id, index, {
                                  ...field,
                                  newOption: e.target.value, // Update the input value
                                })
                              }
                              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                              className={`${
                                !field.newOption ? "opacity-30" : ""
                              }`}
                              onClick={() => {
                                if (field.newOption) {
                                  const newOption = {
                                    value: field.newOption,
                                    editing: false,
                                  };
                                  updateField(section.id, index, {
                                    ...field,
                                    options: [...field.options, newOption], // Add new option
                                    newOption: "", // Clear the input
                                  });
                                }
                              }}
                              disabled={!field.newOption}
                            >
                              <HiPlus />
                            </button>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-700">
                              Options:{" "}
                            </h4>
                            <ul className="space-y-2">
                              {field.options.map((option, optIdx) => (
                                <li
                                  key={optIdx}
                                  className="flex items-center justify-between bg-white shadow-sm px-3 py-2 rounded-lg border border-gray-200"
                                >
                                  {option.editing ? (
                                    <div className="flex items-center gap-2 w-full">
                                      <input
                                        type="text"
                                        value={option.value || ""}
                                        onChange={(e) => {
                                          const updatedOptions = [
                                            ...field.options,
                                          ];
                                          updatedOptions[optIdx] = {
                                            ...updatedOptions[optIdx],
                                            value: e.target.value,
                                          };
                                          updateField(section.id, index, {
                                            ...field,
                                            options: updatedOptions,
                                          });
                                        }}
                                        className="flex-grow border border-gray-300 px-2 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      />
                                      <button
                                        onClick={() => {
                                          const updatedOptions = [
                                            ...field.options,
                                          ];
                                          updatedOptions[
                                            optIdx
                                          ].editing = false;
                                          updateField(section.id, index, {
                                            ...field,
                                            options: updatedOptions,
                                          });
                                        }}
                                      >
                                        <HiPlus />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="flex-grow">
                                      {option.value}
                                    </span>
                                  )}

                                  <div className="flex items-center gap-3">
                                    {!option.editing && (
                                      <button
                                        className="text-blue-500 hover:text-blue-700"
                                        onClick={() => {
                                          const updatedOptions = [
                                            ...field.options,
                                          ];
                                          updatedOptions[optIdx].editing = true;
                                          updateField(section.id, index, {
                                            ...field,
                                            options: updatedOptions,
                                          });
                                        }}
                                        title="Edit"
                                      >
                                        <FaEdit className="text-lg" />
                                      </button>
                                    )}
                                    <button
                                      className="text-red-500 hover:text-red-700"
                                      onClick={() => {
                                        const updatedOptions =
                                          field.options.filter(
                                            (_, i) => i !== optIdx
                                          );
                                        updateField(section.id, index, {
                                          ...field,
                                          options: updatedOptions,
                                        });
                                      }}
                                      title="Delete"
                                    >
                                      <MdOutlineDelete className="text-lg" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* JSON Output */}
        <div className="w-1/2 p-10 h-screen overflow-auto bg-gray-100">
          <h2 className="w-full text-2xl font-semibold text-center mb-4">
            Output
          </h2>
          <pre className="bg-white p-4 rounded shadow overflow-auto">
            {JSON.stringify({ formName, sections }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default App;
