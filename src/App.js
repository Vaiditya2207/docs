import React, { useState } from 'react';
import 'quill/dist/quill.snow.css';
import './App.css';
import HomePage from './pages/HomePage.jsx';
import CustomDocumentEditor from './pages/CustomDocumentEditor.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Auth from './pages/Auth.jsx';
import NewDocument from './firebase/CustomNewDocument.jsx';
import CustomNoAccess from './pages/CustomNoAccess.jsx';
import CustomDocumentNotFound from './pages/CustomDocumentNotFound.jsx'

function App() {
    const [isLogged, setIsLogged] = useState(localStorage.getItem('isLogged') || false);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    const userData = {
        isLogged: isLogged,
        token: token,
        setIsLogged: setIsLogged,
        setToken: setToken
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage user={userData} />} />
                <Route path='/auth' element={<Auth user={userData} />} />
                <Route path="/document/:documentId/:mode" element={<CustomDocumentEditor userId = {token}  />} />
                <Route path="/new" element={<NewDocument userId = {token} />} />
                <Route path='/access-error/:documentId/:mode' element = {<CustomNoAccess user ={userData} />} />
                <Route path='/doc-not-found' element={<CustomDocumentNotFound user ={userData} />}></Route>
            </Routes>
        </Router>
    );
}

export default App;
