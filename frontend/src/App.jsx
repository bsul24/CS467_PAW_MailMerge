import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import FileUpload from './components/FileUpload';
import RecipientsList from './components/RecipientsList';
import TemplatesList from './components/TemplatesList';
import TemplateEditor from './components/TemplateEditor';
import GenerationButtons from './components/GenerationButtons';
import EmailPreview from './components/EmailPreview';

function App() {

  const [templates, setTemplates] = useState([
    { id: 1, name: 'Greetings', content: 'Greetings {{name}}, \nHope everything is going well.\nThe following email is to...\nI look forward to your answer.\nThanks.'}
  ]);

  const [selectedTemplateId, setSelectedTemplateId] = useState(1);

  const [recipients, setRecipients] = useState([]);

  const [previewRecipient, setPreviewRecipient] = useState(null);

  const selectedTemplate = templates.find((template) => template.id === selectedTemplateId);

  return (
    
    <div className="App">
      <Header></Header>
      <FileUpload></FileUpload>
      {/* <TemplatesList></TemplatesList> */}
      <TemplateEditor></TemplateEditor>
      {/* <RecipientsList></RecipientsList> */}
      <EmailPreview></EmailPreview>
      <GenerationButtons></GenerationButtons>
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <Footer></Footer> */}
    </div>
  );
}

export default App;
