import Navbar from '../components/Navbar.jsx'
const DocumentNotFound = (props) => {
    return (
        <div className='min-h-screen flex flex-col'>
            <Navbar {...props}> </Navbar>
            <div className='w-full flex-grow flex flex-col justify-center items-center'>
                <p className='text-2xl'>No Such Document Found</p>
                <p className='text-2xl'>Maybe a typo</p>
                <p className='text-2xl'>Go back to home page</p>
            </div>
        </div>
    )
}

export default DocumentNotFound;