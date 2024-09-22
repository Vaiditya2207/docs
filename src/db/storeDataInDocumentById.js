import { doc, setDoc } from 'firebase/firestore'; 
import { db } from "../firebase/firebase.js";

const storeDataInDocumentById = async (documentId, data) => {
    try {
        const docRef = doc(db, 'documents', documentId);
        await setDoc(docRef, data, { merge: true }); 
        return true;
    } catch (err) {
        console.log("Error storing data in document:", err);
        return false;
    }
};

export default storeDataInDocumentById;