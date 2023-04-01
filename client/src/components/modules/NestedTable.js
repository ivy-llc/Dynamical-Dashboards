import React from "react";
import "./NestedTable.css";

const NestedTable = ({ data }) => {
  const renderTable = (obj) => {
    return (
      <table className="nested-table">
        <tbody>
          {Object.keys(obj).map((key) => (
            <tr key={key} onClick={(e) => handleRowClick(e)}>
              <td>{key}</td>
              <td>
                {typeof obj[key] === "object" && obj[key] !== null
                  ? renderTable(obj[key])
                  : obj[key]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const handleRowClick = (e) => {
    e.stopPropagation();
    const childTable = e.currentTarget.querySelector(".nested-table");
    if (childTable) {
      childTable.style.display = childTable.style.display === "none" ? "" : "none";
    }
  };

  return <>{renderTable(data)}</>;
};

export default NestedTable;
