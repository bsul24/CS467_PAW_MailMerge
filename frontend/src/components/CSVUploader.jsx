import React, { useState } from "react";
import Papa from "papaparse";

const CSVUploader = ({ onDataParsed }) => {
  const [errors, setErrors] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      parseCSV(file);
    } else {
      setErrors(["Please upload a valid CSV file."]);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        const headers = Object.keys(data[0] || {});
        onDataParsed({ data, headers });
        setErrors([]);
      },
      error: (error) => {
        setErrors([`Error parsing CSV: ${error.message}`]);
      },
    });
  };

  return (
    <div>
      <h2>Upload CSV File</h2>
      <label htmlFor="file-upload">Upload CSV File</label>
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      />
      {errors.length > 0 && (
        <div
          style={{ color: "red", marginTop: "10px" }}
          data-testid="error-message"
        >
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
