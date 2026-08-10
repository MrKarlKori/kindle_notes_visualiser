import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AuthorDetail from './pages/AuthorDetail';
import BookDetail from './pages/BookDetail';
import Settings from './pages/Settings';

function App() {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/author/:authorName" element={<AuthorDetail />} />
          <Route path="/book/:bookTitle" element={<BookDetail />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}

export default App;
