import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import getDocumentContentsById from "../db/getDocumentContentsById.js";
import Navbar from "../components/Navbar.jsx";

const CustomNoAccess = (props) => {
    const {mode, documentId} = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const status = await getDocumentContentsById(documentId);
            if(status == null){
                navigate('/doc-not-found');
            }
            if((status[`can${mode}`]).includes(props.user.token)){
                navigate(`/document/${documentId}/${mode}`)
            }
        }, 2000);
    
        // Clean up the interval when the component unmounts
        return () => clearInterval(intervalId);
      }, [documentId, mode, navigate, props.user.token]); 

    return (
        <div>
            <Navbar {...props} />
            Hello
        </div>
    ); 
}

export default CustomNoAccess;