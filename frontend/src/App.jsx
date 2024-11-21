import "./App.css";
import React, { useState } from "react";
import { jsPDF } from "jspdf";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import RecipientsList from "./components/RecipientsList";
import TemplatesList from "./components/TemplatesList";
import TemplateEditor from "./components/TemplateEditor";
import GenerationButtons from "./components/GenerationButtons";
import EmailPreview from "./components/EmailPreview";

function App() {
  const [headers, setHeaders] = useState([]);
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Greetings",
      content:
        "Greetings {{name}}, \nHope everything is going well.\nThe following email is to...\nI look forward to your answer.\nThanks.",
    },
  ]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [recipients, setRecipients] = useState([]);
  const [previewRecipient, setPreviewRecipient] = useState({});
  const [nextTemplateId, setNextTemplateId] = useState(2);
  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId
  );

  const generateEmailsContent = () => {
    const emails = recipients.map((recipient) => {
      let replacedContent = selectedTemplate ? selectedTemplate.content : "";
      Object.keys(recipient).forEach((csvColumn) => {
        const placeholder = `{{${csvColumn}}}`;
        replacedContent = replacedContent.replace(
          new RegExp(placeholder, "g"),
          recipient[csvColumn]
        );
      });
      return { email: recipient.email, content: replacedContent };
    });
    return emails;
  };

  const viewEmailsInNewTabs = () => {
    const emails = generateEmailsContent();
    emails.forEach((email) => {
      const newTab = window.open("", "_blank");
      if (newTab) {
        newTab.document.write(`
          <html>
            <head><title>Email Preview</title></head>
            <body>
              <pre>${email.content}</pre>
            </body>
          </html>
        `);
        newTab.document.close();
      } else {
        console.error("Unable to open a new tab");
      }
    });
  };

  const downloadAsTxt = () => {
    const emails = generateEmailsContent();
    const blob = new Blob([emails.map((email) => email.content).join("\n\n")], {
      type: "text/plain",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated_emails.txt";
    link.click();
  };

  const downloadAsPdf = () => {
    const emails = generateEmailsContent();
    const doc = new jsPDF();
    emails.forEach((email, index) => {
      if (index > 0) doc.addPage();
      doc.text(email.content, 10, 10);
    });
    doc.save("generated_emails.pdf");
  };

  const handleDataParsed = ({ data, headers }) => {
    setRecipients(data);
    setHeaders(headers);
  };

  const handleAddTemplate = () => {
    const newTemplate = {
      id: Date.now(),
      name: `New Template ${templates.length + 1}`,
      content: "Your new template here...",
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setNextTemplateId(nextTemplateId + 1);
  };

  return (
    <div className="App">
      <Header></Header>
      <FileUpload onDataParsed={handleDataParsed}></FileUpload>
      <TemplatesList
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        onSelectTemplate={setSelectedTemplateId}
        onAddTemplate={handleAddTemplate}
      ></TemplatesList>
      <TemplateEditor
        headers={headers}
        template={selectedTemplate}
        onTemplateChange={(newContent) => {
          if (selectedTemplate) {
            setTemplates(
              templates.map((template) =>
                template.id === selectedTemplateId
                  ? { ...template, content: newContent }
                  : template
              )
            );
          }
        }}
      ></TemplateEditor>
      <RecipientsList
        recipients={recipients}
        onSelectRecipient={setPreviewRecipient}
      ></RecipientsList>
      <EmailPreview
        template={selectedTemplate}
        recipient={previewRecipient}
      ></EmailPreview>
      <GenerationButtons
        onViewEmailsInNewTabs={viewEmailsInNewTabs}
        onDownloadAsTxt={downloadAsTxt}
        onDownloadAsPdf={downloadAsPdf}
      ></GenerationButtons>
      <Footer></Footer>
    </div>
  );
}

export default App;
