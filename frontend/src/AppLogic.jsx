import React, { useState } from "react";
import CSVUploader from "./components/CSVUploader";
import EmailTemplateEditor from "./components/EmailTemplateEditor";
import EmailPreviewer from "./components/EmailPreviewer";
import Handlebars from "handlebars";

const App = () => {
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [generatedEmails, setGeneratedEmails] = useState([]);

  const handleDataParsed = ({ data, headers }) => {
    setCsvData(data);
    setHeaders(headers);
    setGeneratedEmails([]);
    console.log("Parsed Data: ", data);
    console.log("Headers: ", headers);
  };

  const handleTemplateChange = (event) => {
    setEmailTemplate(event);
  };

  const generateEmails = () => {
    if (!emailTemplate || csvData.length === 0) {
      alert("Please upload a valid CSV file and create an email template.");
      return;
    }

    const template = Handlebars.compile(emailTemplate);
    const emails = csvData.map((row) => template(row));
    setGeneratedEmails(emails);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>PAW MailMerge</h1>
      <CSVUploader onDataParsed={handleDataParsed} />
      <EmailTemplateEditor
        headers={headers}
        onTemplateChange={handleTemplateChange}
      />
      <button onClick={generateEmails}>Generate Emails</button>
      <EmailPreviewer generatedEmails={generatedEmails} />
    </div>
  );
};

export default App;
