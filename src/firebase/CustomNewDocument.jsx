import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import createADocument from "./createADocument";

const NewDocument = ({ userId }) => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const isCreatingDocument = useRef(false); // Ref to prevent multiple creation
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/signup');
            return;
        }

        const createDocument = async () => {
            try {
                if (!isCreatingDocument.current) {
                    isCreatingDocument.current = true; // Prevent further calls
                    console.log('Creating document');
                    const result = await createADocument(userId, { content: "" });
                    console.log('Document created:', result);
                    setStatus(result); // Set the created document ID
                }
            } catch (error) {
                console.error('Error creating document:', error);
                setStatus(null);
            } finally {
                setLoading(false);
            }
        };

        createDocument();
    }, [userId, navigate]);

    useEffect(() => {
        if (status !== null) {
            navigate(`/document/${status}/edit`);
        }
    }, [status, navigate]);

    if (!userId) {
        return null; // Return null to avoid rendering if userId is null
    }

    if (loading) {
        return (
            <div>
                <h1>Creating document...</h1>
            </div>
        );
    }

    if (status === null) {
        return (
            <div>
                <h1>Document creation failed</h1>
                <h2>Please try again later</h2>
                <button onClick={() => navigate('/')}>Go back to home page</button>
            </div>
        );
    }

    return null; // Return null to avoid rendering anything after navigation
};

export default NewDocument;
