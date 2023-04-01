import React, { useState } from "react";
import "./NestedTreeView.css";

const NestedTreeView = ({ data }) => {
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

  const renderTree = (obj, parentKey = "") => {
    return (
      <ul className="tree-view">
        {Object.keys(obj).map((key) => {
          const isObject = typeof obj[key] === "object" && obj[key] !== null;
          const aggregateValue = isObject ? Object.keys(obj[key]).length : obj[key];
          const currentKey = parentKey ? `${parentKey}.${key}` : key;
          const isExpanded = expandedKeys.has(currentKey);

          return (
            <li key={currentKey}>
              <span
                className={`tree-node ${isObject ? "expandable" : ""}`}
                onClick={() => isObject && toggleExpand(currentKey)}
              >
                {key} ({aggregateValue})
              </span>
              {isObject && isExpanded && renderTree(obj[key], currentKey)}
            </li>
          );
        })}
      </ul>
    );
  };

  return <>{renderTree(data)}</>;
};

export default NestedTreeView;
