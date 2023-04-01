import React, { Component } from "react";

import Select from "react-select";

class CustomSelect extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Select
        isMulti={true}
        value={this.props.value}
        onChange={this.props.handleChange}
        options={this.props.options}
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
