import { db } from "../firebase/firebase.js";
import { collection, getDocs, query, where } from "firebase/firestore";

const getAllDocsOfUser = async (user_id) => {
    try {
        const q = query(collection(db, "documents"), where("author", "==", user_id));
        const querySnapshot = await getDocs(q);
        let documents = [];
        querySnapshot.forEach((doc) => {
            // Include both document data and the document ID
            documents.push({
                id: doc.id, // Document ID
                ...doc.data() // Document fields
            });
        });
        return documents;
    } catch (err) {
        console.log("Error getting documents of user:", err);
        return null;
    }
}

export default getAllDocsOfUser;
