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

const NestedTreeViewTable = ({ data }) => {
  const [expandedKeys, setExpandedKeys] = useState(new Set());

  const toggleExpand = (key) => {
    const newExpandedKeys = new Set(expandedKeys);
    if (expandedKeys.has(key)) {
      newExpandedKeys.delete(key);
    } else {
      newExpandedKeys.add(key);
    }
    setExpandedKeys(newExpandedKeys);
  };

  const computeAggregateValue = (obj) => {
    const values = getLeafValues(obj);

    if (values.length != 0 && values.every((value) => value.includes("success"))) {
      return '<img src="https://img.shields.io/badge/-success-success" />';
    } else {
      return '<img src="https://img.shields.io/badge/-failure-red" />';
    }
  };

  const headings = ["Submodule", "Backend", "Backend Version", "Frontend Version", "Test"];

  const renderTable = (obj, level = 0, parentKey = "") => {
    return Object.keys(obj).map((key) => {
      const isObject = typeof obj[key] === "object" && obj[key] !== null;
      const aggregateValue = isObject ? computeAggregateValue(obj) : obj[key];
      const currentKey = parentKey ? `${parentKey}.${key}` : key;
      const isExpanded = expandedKeys.has(currentKey);

      return (
        <React.Fragment key={currentKey}>
          <tr className={`level-${level}`}>
            <td
              className={`tree-node ${isObject ? "expandable" : ""} ${isExpanded ? "open" : ""}`}
              onClick={() => isObject && toggleExpand(currentKey)}
            >
              <span style={{ paddingLeft: `${isObject ? level * 20 : 20 + level * 20}px` }}>
                {key}
              </span>
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

  return (
    <table className="tree-view-table">
      <thead>
        <tr>
          <th>{headings[0]}</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>{renderTable(data)}</tbody>
    </table>
  );
};

export default NestedTreeViewTable;
