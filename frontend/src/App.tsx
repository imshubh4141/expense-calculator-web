import React from 'react';
import './App.css';
import FileUploader from './components/FileUploader';
import ErrorPage from './components/ErrorPage';
import ApiCheckAlive from './components/ApiCheckAlive';
import { BrowserRouter, Routes, Link, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileUploader/>}/>
        <Route path="/checkAlive" element={<ApiCheckAlive/>}/>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
