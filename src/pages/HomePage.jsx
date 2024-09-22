import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarWithSearch from '../components/Navbar.jsx';
import getAllDocsOfUser from '../firebase/getAllDocsOfUser.js';
import Loader from '../loader/Loader.jsx';
import { FaPlus } from "react-icons/fa";
const HomePage = (props) => {
    const navigate = useNavigate();
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!props.user.isLogged) {
            navigate('/auth');
        }
    }, [props.user.isLogged, navigate]);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const docs = await getAllDocsOfUser(props.user.token);
                setDocs(docs);
                console.log(docs);
            } catch (error) {
                console.error('Error fetching documents:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchDocs();
    }, [props.user.token]);

    return (
        <div>
            <NavbarWithSearch {...props} />
            {loading ? <Loader /> : (
                <div>
                    <p className='text-xl mt-4 ml-3'>Create A new Document :</p>
                    <div className='cursor-pointer shadow-lg flex justify-center items-center border border-black w-32 h-44 ml-24 mt-4' onClick={() => navigate('/new')}>
                    <FaPlus className='text-black text-5xl' />
                    </div>
                    {docs.length > 0 ? (
                        <>
                        <p className='text-xl mt-4 ml-3'>Your Documents :</p>
                        <div className='flex flex-wrap gap-10 ml-24' >
                      {docs.map((doc, index) => {
                        return (
                            <div key = {doc.id} id = {doc.id} className='flex flex-col justify-center' onClick={() => {navigate(`document/${doc.id}/edit`)}}>
                            <div className='flex-col cursor-pointer shadow-lg flex justify-center items-center border border-black w-32 h-44 mt-4'>
                                <p>Preview</p>
                                <p>Soon</p>
                            </div>
                            <p>{doc.title}</p>
                       </div>
                        )
                      })}
                        </div>
                        </>
                    ) : <div>
                        </div>}
                    
                </div>
            )}
        </div>
    );
}

export default HomePage;