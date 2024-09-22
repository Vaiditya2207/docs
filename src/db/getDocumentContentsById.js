import {db} from "../firebase/firebase.js";
import {doc, getDoc} from "firebase/firestore";

const getDocumentContentsById = async (documentId) => {

    try {
        const docRef = doc(db, "documents", documentId)
        const docData = await getDoc(docRef);
        if (docData.exists()) {
            return docData.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null; 
    }
};

export default getDocumentContentsById;