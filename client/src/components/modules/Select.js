import React, { Component } from "react";

import Select from "react-select";

class CustomSelect extends Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange = (selected) => {
    if (selected.some((s) => s.value === "select-all")) {
      // Select all
      this.props.handleChange(this.props.options);
    } else {
      // Regular selection
      this.props.handleChange(selected);
    }
  };

  render() {
    let options = [{ value: "select-all", label: "Select All" }, ...this.props.options];
    return (
      <Select
        isMulti={true}
        value={this.props.value}
        onChange={this.handleOnChange}
        options={options}
        placeholder={this.props.name}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            margin: "10px",
            borderColor: "#009001",
          }),
          indicatorSeparator: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "#009001",
          }),
          dropdownIndicator: (baseStyles, state) => ({
            ...baseStyles,
            color: "#009001",
          }),
          option: (baseStyles, state) => ({
            ...baseStyles,
            color: "#009001",
          }),
          multiValue: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: "#009001",
          }),
          multiValueLabel: (baseStyles, state) => ({
            ...baseStyles,
            color: "white",
          }),
          placeholder: (baseStyles, state) => ({
            ...baseStyles,
            color: "#009001",
          }),
        }}
      />
    );
  }
}

export default CustomSelect;
