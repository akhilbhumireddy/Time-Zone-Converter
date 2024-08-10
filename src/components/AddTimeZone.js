import React, { useState } from "react";
import "./AddTimeZone.css"; // Import the CSS file

const AddTimeZone = ({ onAdd }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="add-time-zone">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Enter time zone (e.g., 'America/New_York')"
      />
      <button onClick={handleAdd}>Add Time Zone</button>
    </div>
  );
};

export default AddTimeZone;
