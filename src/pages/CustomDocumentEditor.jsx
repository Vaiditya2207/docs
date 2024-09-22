import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';
import QuillBetterTable from 'quill-better-table';
import { db, storage } from '../firebase/firebase.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import getDocumentContentsById from '../db/getDocumentContentsById.js';
import storeDataInDocumentById from '../db/storeDataInDocumentById.js';
import { useNavigate, useParams } from 'react-router-dom';
import { TiArrowBackOutline } from "react-icons/ti";
import './CustomDocumentEditor.css';

Quill.register({
    'modules/better-table': QuillBetterTable,
}, true);

const CustomDocumentEditor = (props) => {
    const navigate = useNavigate();
    const [editor, setEditor] = useState(null);
    const editorRef = useRef(null);
    const initializedRef = useRef(false);
    const { documentId, mode } = useParams();
    const [pageSize, setPageSize] = useState('A4');
    const [title, setTitle] = useState('Undefined Document')

    useEffect(() => {
        if (!initializedRef.current) {
            const quill = new Quill('#editor', {
                theme: 'snow',
                modules: {
                    toolbar: '#toolbar',
                    'better-table': {
                        operationMenu: {
                            items: {
                                unmergeCells: {
                                    text: 'Unmerge Cells',
                                },
                            },
                        },
                    },
                    keyboard: {
                        bindings: {
                            tab: {
                                key: 9,
                                handler: function() {
                                    return true;
                                }
                            }
                        }
                    }
                },
            });

            setEditor(quill);
            editorRef.current = quill;
            initializedRef.current = true;

            quill.on('text-change', async () => {
                const content = quill.getContents();
                try {
                    await storeDataInDocumentById(documentId, { content: JSON.stringify(content) });
                } catch (error) {
                    console.error('Error storing data:', error);
                }
            });

            // Setup toolbar handlers
            const toolbar = quill.getModule('toolbar');
            toolbar.addHandler('image', () => {
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();

                input.onchange = async () => {
                    const file = input.files[0];
                    const storageRef = ref(storage, `images/${file.name}`);
                    await uploadBytes(storageRef, file);
                    const url = await getDownloadURL(storageRef);
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url);
                };
            });

            toolbar.addHandler('table', () => {
                let rows = prompt('How many rows?', '3');
                let cols = prompt('How many columns?', '3');
                
                rows = parseInt(rows, 10);
                cols = parseInt(cols, 10);

                if (isNaN(rows) || isNaN(cols) || rows < 1 || cols < 1) {
                    alert('Please enter valid numbers for rows and columns.');
                    return;
                }

                const table = quill.getModule('better-table');
                table.insertTable(rows, cols);
            });
        }
    }, [documentId]);

    const handlePageSizeChange = (e) => {
        setPageSize(e.target.value);
        document.getElementById('editor').className = e.target.value; 
    };

    const handleExport = () => {
        const content = editorRef.current.root.innerHTML;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.html';
        a.click();
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        const fetchDocumentContents = async () => {
            const statusAlready = await getDocumentContentsById(documentId);
            if (statusAlready == null) {
                return navigate(`/doc-not-found`);
            } else if (statusAlready.content !== "") {
                const parsedContent = JSON.parse(statusAlready.content);
                editorRef.current.setContents(parsedContent);
            }
            setTitle(statusAlready.title);
        };

        if (editorRef.current) {
            fetchDocumentContents();
        }
    }, [documentId, mode, navigate]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = ''; // Required for Chrome to show the confirmation dialog
        };
    
        const handlePopState = () => {
            navigate('/', { replace: true }); // Navigate to home page on popstate
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState); // When back button is pressed
    
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);
    

    const handleTitleChange = async (e) => {
        setTitle(e.target.value);  // Update the title in state
        await storeDataInDocumentById(documentId, { title: e.target.value });  // Update the title in the database
    };

    return (
        <>
            <div className='absolute top-2 left-3'>
                <button className='flex justify-center items-center' onClick={() => {
                    navigate('/');
                }}>
                    <TiArrowBackOutline></TiArrowBackOutline>
                    Back</button>
            </div>
            <div className='absolute left-24 top-2'>
                <input 
                    placeholder={title} 
                    type='text' 
                    value={title} 
                    onChange={handleTitleChange}  // Capture changes here
                    className='focus:outline-none focus:border-none'
                />
            </div>
            <div className='absolute right-10 top-0.5'>
                <div className="toolbar-container">
                    <select value={pageSize} onChange={handlePageSizeChange}>
                        <option value="A4">A4</option>
                        <option value="A5">A5</option>
                        <option value="Letter">Letter</option>
                    </select>
                    <button onClick={handleExport}>Export HTML</button>
                </div>
            </div>
            <div id="toolbar">
                <span className="ql-formats">
                    <select className="ql-header">
                        <option value="1">Heading 1</option>
                        <option value="2">Heading 2</option>
                        <option value="3">Heading 3</option>
                        <option selected>Normal</option>
                    </select>
                    <button className="ql-bold"></button>
                    <button className="ql-italic"></button>
                    <button className="ql-underline"></button>
                    <button className="ql-strike"></button>
                </span>
                <span className="ql-formats">
                    <select className="ql-color"></select>
                    <select className="ql-background"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-list" value="ordered"></button>
                    <button className="ql-list" value="bullet"></button>
                    <select className="ql-align"></select>
                </span>
                <span className="ql-formats">
                    <button className="ql-link"></button>
                    <button className="ql-image"></button>
                    <button className="ql-table"></button>
                </span>
                <span className="ql-formats">
                    <button className="ql-clean"></button>
                </span>
            </div>
            <div id="editor" className={pageSize} style={{ marginTop: "15px", height: "90vh" }}></div>
        </>
    );
};

export default CustomDocumentEditor;
