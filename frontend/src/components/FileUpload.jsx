import React, { useState } from "react";
import Papa from "papaparse";

export default function FileUpload({ onDataParsed }) {
  const [errors, setErrors] = useState([]);
  const [fileName, setFileName] = useState("No File Chosen");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setFileName(file.name);
      parseCSV(file);
    } else {
      setErrors(["Please upload a valid CSV file."]);
      console.error(errors);
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const data = result.data;
        const headers = Object.keys(data[0]);
        onDataParsed({ data, headers });
        setErrors([]);
      },
      error: (error) => {
        setErrors([`Error parsing CSV: ${error.message}`]);
        console.error(errors);
      },
    });
  };

  return (
    <div className="file-upload">
      <label className="file-upload-label" htmlFor="file-upload-real">
        Upload CSV
      </label>
      <input
        id="file-upload-real"
        className="file-upload-real"
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
      ></input>
      <span className="file-upload-name">{fileName}</span>
    </div>
  );
}
