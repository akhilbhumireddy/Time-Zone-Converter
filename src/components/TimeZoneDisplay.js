import React from "react";
import "./TimeZoneDisplay.css"; // Import the CSS file

const TimeZoneDisplay = ({ timeZone, currentTime, onDelete }) => {
  const timeInZone = currentTime.tz(timeZone).format("YYYY-MM-DD HH:mm:ss");

  return (
    <div className="time-zone-display">
      <div className="time-zone-info">
        <h2>{timeZone}</h2>
        <p>{timeInZone}</p>
      </div>
      <button className="delete-button" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
};

export default TimeZoneDisplay;
