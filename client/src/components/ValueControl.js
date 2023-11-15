import React, { useState } from 'react';

const ValueControl = () => {
  const [value, setValue] = useState(50); 

  const handleValueChange = (event) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
  };

  return (
    <div style={{position:'absolute',left: '40%',paddingTop:'10px'}}>
      <label htmlFor="value">Value:</label>
      <input
        type="range"
        id="value"
        name="value"
        min="0"
        max="100"
        value={value}
        onChange={handleValueChange}
      />
      <span>{value}%</span>
    </div>
  );
};

export default ValueControl;
