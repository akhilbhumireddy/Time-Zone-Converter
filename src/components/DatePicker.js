// src/components/DatePicker.js
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.css";

function DatePicker({ selectedDate, onDateChange }) {
  return (
    <div className="date-picker">
      <ReactDatePicker
        selected={selectedDate}
        onChange={onDateChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="MMMM d, yyyy h:mm aa"
      />
    </div>
  );
}

export default DatePicker;
