import React, { Component } from "react";
import moment from "moment-timezone";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TimeZoneDisplay from "./TimeZoneDisplay";
import AddTimeZone from "./AddTimeZone";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./TimeZoneConverter.css";

class TimeZoneConverter extends Component {
  constructor(props) {
    super(props);
    const urlParams = new URLSearchParams(window.location.search);
    const timeZonesFromUrl = urlParams.get("zones")
      ? urlParams.get("zones").split(",")
      : ["UTC", "Asia/Kolkata"];
    const darkModeFromLocalStorage =
      localStorage.getItem("darkMode") === "true";
    this.state = {
      timeZones: timeZonesFromUrl,
      currentTime: moment(),
      darkMode: darkModeFromLocalStorage,
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    const currentTime = urlParams.get("currentTime")
      ? moment(urlParams.get("currentTime"))
      : moment();
    this.setState({ currentTime });
  }

  componentDidUpdate(_, prevState) {
    if (prevState.timeZones !== this.state.timeZones) {
      this.updateUrlWithTimeZones();
    }
    if (prevState.darkMode !== this.state.darkMode) {
      localStorage.setItem("darkMode", this.state.darkMode);
      document.body.classList.toggle("dark-mode", this.state.darkMode);
    }
    if (prevState.currentTime !== this.state.currentTime) {
      this.updateUrlWithCurrentTime();
    }
  }

  updateUrlWithTimeZones = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("zones", this.state.timeZones.join(","));
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  updateUrlWithCurrentTime = () => {
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("currentTime", this.state.currentTime.toISOString());
    window.history.replaceState(null, "", `?${urlParams.toString()}`);
  };

  handleTimeZoneAddition = (timeZone) => {
    this.setState((prevState) => ({
      timeZones: [...prevState.timeZones, timeZone],
    }));
  };

  handleTimeZoneDeletion = (index) => {
    this.setState((prevState) => ({
      timeZones: prevState.timeZones.filter((_, i) => i !== index),
    }));
  };

  handleReverseOrder = () => {
    this.setState((prevState) => ({
      timeZones: [...prevState.timeZones].reverse(),
    }));
  };

  toggleDarkMode = () => {
    this.setState((prevState) => ({
      darkMode: !prevState.darkMode,
    }));
  };

  handleDateChange = (date) => {
    this.setState({ currentTime: moment(date) });
  };

  onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(this.state.timeZones);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ timeZones: items });
  };

  generateShareableLink = () => {
    const { timeZones, currentTime } = this.state;
    const params = new URLSearchParams({
      zones: timeZones.join(","),
      currentTime: currentTime.toISOString(),
      darkMode: this.state.darkMode,
    });
    return `${window.location.origin}?${params.toString()}`;
  };

  scheduleMeet = () => {
    const { currentTime } = this.state;
    const startTime = currentTime.toISOString().replace(/-|:|\.\d+/g, "");
    const endTime = new Date(currentTime.toDate()).getTime() + 3600000;
    const endTimeStr = moment(endTime)
      .toISOString()
      .replace(/-|:|\.\d+/g, "");
    const calendarUrl = `https://calendar.google.com/calendar/r/eventedit?text=Meeting&dates=${startTime}/${endTimeStr}&details=Time%20Zone%20Converter%20Scheduled%20Meeting`;

    window.open(calendarUrl, "_blank");
  };

  render() {
    const { timeZones, currentTime, darkMode } = this.state;
    const shareableLink = this.generateShareableLink();

    return (
      <div className={`time-zone-converter ${darkMode ? "dark-mode" : ""}`}>
        <h1>Time Zone Converter</h1>
        <DatePicker
          selected={currentTime.toDate()}
          onChange={this.handleDateChange}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="date-picker"
        />
        <AddTimeZone onAdd={this.handleTimeZoneAddition} />
        <div className="controls">
          <button className="reverse-button" onClick={this.handleReverseOrder}>
            Reverse Order
          </button>
          <button className="dark-mode-toggle" onClick={this.toggleDarkMode}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            className="share-button"
            onClick={() => navigator.clipboard.writeText(shareableLink)}
          >
            Copy Shareable Link
          </button>
          <button className="schedule-meet-button" onClick={this.scheduleMeet}>
            Schedule Meet
          </button>
        </div>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="time-zones-list"
              >
                {timeZones.map((zone, index) => (
                  <Draggable key={zone} draggableId={zone} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="time-zone-item"
                      >
                        <TimeZoneDisplay
                          timeZone={zone}
                          currentTime={currentTime}
                          onDelete={() => this.handleTimeZoneDeletion(index)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    );
  }
}

export default TimeZoneConverter;
