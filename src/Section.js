import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import DynamicField from './DynamicField'; // Your DynamicField component for rendering fields
import { v4 as uuidv4 } from 'uuid';

function Section({ onRemoveSection }) {
  const [fields, setFields] = useState([]);  // Initialize fields as an empty array

  const addField = (fieldType) => {
    const newField = {
      id: uuidv4(),
      type: fieldType,
      label: '',  // Label for the field that can be edited
      name: `field-${uuidv4()}`,  // Unique name for the field
    };
    setFields([...fields, newField]);
  };

  const removeField = (fieldId) => {
    setFields(fields.filter(field => field.id !== fieldId));
  };

  const handleLabelChange = (e, fieldId) => {
    setFields(fields.map(field =>
      field.id === fieldId ? { ...field, label: e.target.value } : field
    ));
  };

  return (
    <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField
          label="Section Title"
          variant="outlined"
          fullWidth
          onChange={(e) => handleLabelChange(e, 'section-title')}
        />
        <Button variant="contained" onClick={onRemoveSection}>
          Remove Section
        </Button>
      </div>

      <div style={{ margin: '10px 0' }}>
        <Button onClick={() => addField('text')} variant="contained">Add Text Field</Button>
        <Button onClick={() => addField('dropdown')} variant="contained" style={{ marginLeft: '10px' }}>Add Dropdown</Button>
        <Button onClick={() => addField('radio')} variant="contained" style={{ marginLeft: '10px' }}>Add Radio Button</Button>
        <Button onClick={() => addField('file')} variant="contained" style={{ marginLeft: '10px' }}>Add File Upload</Button>
        <Button onClick={() => addField('checkbox')} variant="contained" style={{ marginLeft: '10px' }}>Add Checkbox</Button>
        <Button onClick={() => addField('phone')} variant="contained" style={{ marginLeft: '10px' }}>Add Phone Number</Button>
        <Button onClick={() => addField('date')} variant="contained" style={{ marginLeft: '10px' }}>Add Date Picker</Button>
      </div>

      {fields.map(field => (
        <div key={field.id} style={{ marginBottom: '10px' }}>
          <DynamicField
            field={field}
            removeField={removeField}
          />
        </div>
      ))}
    </div>
  );
}

export default Section;
