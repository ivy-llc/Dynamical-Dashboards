import React, { useState } from "react";
import "./NestedTreeViewTable.css";

function getLeafValues(obj) {
  const values = [];

  const traverse = (currentObj) => {
    for (const key in currentObj) {
      if (typeof currentObj[key] === "object" && currentObj[key] !== null) {
        // If the current value is an object, traverse it recursively
        traverse(currentObj[key]);
      } else {
        // If the current value is a leaf, add it to the values array
        values.push(currentObj[key]);
      }
    }
  };

  traverse(obj);

  return values;
}

const NestedTreeViewTable = ({
  data,
  module,
  display_module,
  module_map,
  with_device = false,
  not_implemented_count = null,
}) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const countTestKeys = (obj) => {
    if (typeof obj !== "object" || obj === null) {
      return 0;
    }
    let count = 0;
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("test_")) {
        count += 1;
      }
      count += countTestKeys(obj[key]);
    });
    return count;
  };

  const toggleExpand = (key, data) => {
    const newExpandedKeys = new Set(expandedKeys);

    const traverse = (currentKey, currentData) => {
      // Add current key to expanded keys
      if (!newExpandedKeys.has(currentKey)) {
        newExpandedKeys.add(currentKey);
      }

      // Check if the data is an object and has only one child
      if (
        typeof currentData === "object" &&
        currentData !== null &&
        Object.keys(currentData).length === 1
      ) {
        const newKey = `${currentKey}.${Object.keys(currentData)[0]}`;
        const newData = currentData[Object.keys(currentData)[0]];
        traverse(newKey, newData);
      }
    };

    if (expandedKeys.has(key)) {
      newExpandedKeys.delete(key);
    } else {
      traverse(key, data);
    }

    setExpandedKeys(newExpandedKeys);
  };

  const computeAggregateValue = (obj) => {
    const values = getLeafValues(obj);
    const totalTests = values.length;
    const passingTests = values.filter((value) => value.includes("success")).length;

    if (totalTests !== 0) {
      const successPercentage = (passingTests / totalTests) * 100;
      return `<div>
              <div>${passingTests}/${totalTests}</div>
              <div style="width: 100%; height: 10px; background-color: red;">
                <div style="width: ${successPercentage}%; height: 100%; background-color: green;"></div>
              </div>
            </div>`;
    } else {
      return "";
    }
  };

  let headings =
    module == "jax" ||
    module == "numpy" ||
    module == "torch" ||
    module == "tensorflow" ||
    module == "paddle"
      ? ["Submodule", "Backend", "Backend Version", "Frontend Version", "Test"]
      : ["Submodule", "Backend", "Backend Version", "Test"];

  if (with_device) {
    headings.push("Device");
  }
  const renderTable = (obj, level = 0, parentKey = "") => {
    return Object.keys(obj).map((key) => {
      const isObject = typeof obj[key] === "object" && obj[key] !== null;
      const aggregateValue = isObject ? computeAggregateValue(obj[key]) : obj[key];
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const isExpanded = expandedKeys.has(currentKey);

      return (
        <React.Fragment key={currentKey}>
          <tr className={`level-${level}`}>
            <td
              style={{ paddingLeft: `${10 + (isObject ? level * 20 : 20 + level * 20)}px` }}
              className={`tree-node ${isObject ? "expandable" : ""} ${isExpanded ? "open" : ""}`}
              onClick={() => isObject && toggleExpand(currentKey, obj[key])}
            >
              {key}
            </td>
            <td>
              <div dangerouslySetInnerHTML={{ __html: aggregateValue }}></div>
            </td>
          </tr>
          {isObject && isExpanded && (
            <tr>
              <td colSpan="2" className="heading">
                <span style={{ paddingLeft: `${40 + level * 20}px` }}>{headings[level + 1]}</span>
              </td>
            </tr>
          )}
          {isObject && isExpanded && renderTable(obj[key], level + 1, currentKey)}
        </React.Fragment>
      );
    });
  };

  const totalTestCount = countTestKeys(data);
  const implementedCount = totalTestCount - (not_implemented_count || 0);
  const implementedPercentage = (implementedCount / totalTestCount) * 100;
  return (
    <>
      <table className="tree-view-table">
        <thead>
          {display_module ? (
            <tr>
              <th colSpan={2}>
                <b>{module_map[module]}</b>
              </th>
            </tr>
          ) : null}
          <tr>
            <th>{headings[0]}</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>{renderTable(data)}</tbody>
      </table>
    </>
  );
};

export default NestedTreeViewTable;
