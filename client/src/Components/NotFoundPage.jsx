import notfound from '../Images/404.png'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
    const navigate = useNavigate();

    const handledErrorPage = () => {
        navigate('/');
    }
    return (
        <>
            <header className="App-header">
                <img src={notfound} className="App-logo" alt="logo" />
                <h2 className='mt-2 text-3xl text-center font-bold leading-9 tracking-tight text-gray-900'>
                    WE ARE SORRY, PAGE NOT FOUND!
                </h2>
                <p className='text-sm m-4 p-2'>
                    THE PAGE YOU ARE LOOKING FOR MIGHT HAVE BEEN REMOVED HAD ITS NAME CHANGED OR IS TEMPORAIRLY UNAVAILABLE.
                </p>
                <button type="button" class="text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                onClick={handledErrorPage}>
                    Back To Home</button>
            </header>
        </>
    )
}
