import React, { useState } from 'react';
import { useNotes } from '../context/NotesContext';

const expectedSchema = `[
  {
    "id": "a1b2...",
    "raw_book_info": "...",
    "owner": "Name",
    "type": "Note|Highlight",
    "location": "page 171 | location 3523",
    "date_added": "Wednesday, 22 November 2023 01:25:21",
    "content": "...",
    "related_highlight": "...", // Optional
    "author": "Author Name",
    "book_title": "Book Title",
    "language": "en" // Optional
  }
]`;

const Settings = () => {
  const { importNotes } = useNotes();
  const [status, setStatus] = useState('');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (Array.isArray(json)) {
          await importNotes(json);
          setStatus(`Successfully loaded ${json.length} items!`);
        } else {
          setStatus('Error: JSON file must contain an array of objects.');
        }
      } catch (error) {
        setStatus(`Error parsing JSON: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold border-b-4 border-current pb-4 mb-8 uppercase">System Settings</h1>
      
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-4 uppercase text-blueprint-accent dark:text-crt-amber">Data Ingestion</h2>
        <p className="mb-4 opacity-80 text-sm">
          Upload a <code className="bg-current/10 px-1 py-0.5 font-bold">master_notes.json</code> file to populate your library.
          Data is saved locally in your browser via IndexedDB.
        </p>
        
        <div className="border-4 border-dashed border-current p-12 text-center hover:bg-current/5 transition-colors relative bg-white/5 dark:bg-black/50">
          <input 
            type="file" 
            accept=".json" 
            onChange={handleFileUpload} 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="uppercase font-bold tracking-widest text-lg">
            [ Click or Drag JSON Here ]
          </div>
        </div>
        
        {status && (
          <div className="mt-4 p-4 border-l-4 border-current font-bold bg-current/10">
            {status}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 uppercase text-blueprint-accent dark:text-crt-amber">Expected Schema</h2>
        <pre className="border-2 border-current p-4 text-xs overflow-x-auto bg-black/10 dark:bg-black/50 shadow-inner">
          <code>{expectedSchema}</code>
        </pre>
      </div>
    </div>
  );
};

export default Settings;
