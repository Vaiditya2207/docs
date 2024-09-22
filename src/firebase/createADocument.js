import {v4 as uuidv4} from 'uuid';
import {db} from "../firebase/firebase.js";
import {doc, setDoc} from "firebase/firestore";

const createADocument = async (user_id, raw_data) => {
    try{
        const documentId = uuidv4();
        const docRef = doc(db, 'documents', documentId);
        raw_data.author = user_id;
        raw_data.content = raw_data.content || "";
        raw_data.title = raw_data.title || "Untitled Document";
        raw_data.last_modified = new Date();
        raw_data.canview = raw_data.canview || [user_id];
        raw_data.canedit = raw_data.canedit || [user_id];
        await setDoc(docRef, raw_data);
        return documentId;
    }catch(err){
        console.log("Error creating a document:", err)
        return null;
    }
};

export default createADocument;
