import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { jsPDF } from "jspdf";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FileUpload from "./components/FileUpload";
import RecipientsList from "./components/RecipientsList";
import TemplatesList from "./components/TemplatesList";
import TemplateEditor from "./components/TemplateEditor";
import GenerationButtons from "./components/GenerationButtons";
import EmailPreview from "./components/EmailPreview";
import InstructionsPage from "./components/InstructionsPage";

function App() {
  const location = useLocation();
  const [csvData, setCsvData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [generatedEmails, setGeneratedEmails] = useState([]);

  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem("templates");
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });
  const [selectedTemplateId, setSelectedTemplateId] = useState(1);
  const [nextTemplateId, setNextTemplateId] = useState(2);
  const [recipients, setRecipients] = useState([]);
  const [previewRecipient, setPreviewRecipient] = useState({});
  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId
  );
  const [editableName, setEditableName] = useState(templates[0].name);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("templates", JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    const savedTemplates = localStorage.getItem("templates");
    if (savedTemplates) {
      const parsedTemplates = JSON.parse(savedTemplates);
      setTemplates(parsedTemplates);
      if (parsedTemplates.length > 0) {
        setSelectedTemplateId(parsedTemplates[0].id);
        const maxId = Math.max(
          ...parsedTemplates.map((template) => template.id)
        );
        setNextTemplateId(maxId + 1);
      }
    } else {
      const defaultTemplate = {
        id: 1,
        name: "Greetings",
        content:
          "Greetings {{name}}, \nHope everything is going well.\nThe following email is to...\nI look forward to your answer.\nThanks.",
      };
      setTemplates([defaultTemplate]);
      setSelectedTemplateId(1);
      setNextTemplateId(2);
    }
  }, []);

  const generateEmailsContent = () => {
    const emails = recipients.map((recipient) => {
      let replacedContent = selectedTemplate ? selectedTemplate.content : "";
      Object.keys(recipient).forEach((csvColumn) => {
        const placeholder = `{${csvColumn}}`;
        replacedContent = replacedContent.replace(
          new RegExp(placeholder, "g"),
          recipient[csvColumn]
        );
      });
      return { email: recipient.email, content: replacedContent };
    });
    setGeneratedEmails(emails);
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
    setCsvData(data);
    setRecipients(data);
    setHeaders(headers);
    setGeneratedEmails([]);
    setPreviewRecipient(data.length > 0 ? data[0] : {});
  };

  const handleAddTemplate = () => {
    const newTemplate = {
      id: Date.now(),
      name: `New Template ${templates.length + 1}`,
      content: "Your new template here...",
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
    setEditableName(newTemplate.name);
    setIsDropdownOpen(false);
  };

  const handleEditableNameChange = (newName) => {
    setEditableName(newName);
    const updatedTemplates = templates.map((template) =>
      template.id === selectedTemplateId
        ? { ...template, name: newName }
        : template
    );
    setTemplates(updatedTemplates);
  };

  return (
    <div className="App">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <FileUpload onDataParsed={handleDataParsed}></FileUpload>
              <TemplatesList
                templates={templates}
                selectedTemplateId={selectedTemplateId}
                onSelectTemplate={setSelectedTemplateId}
                onAddTemplate={handleAddTemplate}
                editableName={editableName}
                isDropdownOpen={isDropdownOpen}
                onEditableNameChange={handleEditableNameChange}
                setIsDropdownOpen={setIsDropdownOpen}
              ></TemplatesList>
              <div className="main-content">
                <div className="editor-and-preview">
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
                  <EmailPreview
                    template={selectedTemplate}
                    recipient={previewRecipient}
                  ></EmailPreview>
                </div>
                <RecipientsList
                  recipients={recipients}
                  onSelectRecipient={setPreviewRecipient}
                  selectedRecipient={previewRecipient}
                ></RecipientsList>
              </div>
              <GenerationButtons
                onViewEmailsInNewTabs={viewEmailsInNewTabs}
                onDownloadAsTxt={downloadAsTxt}
                onDownloadAsPdf={downloadAsPdf}
              ></GenerationButtons>
            </>
          }
        />

        <Route path="/instructions" element={<InstructionsPage />} />
      </Routes>

      <Footer />
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default AppWrapper;
