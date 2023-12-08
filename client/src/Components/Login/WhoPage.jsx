
const WhoPage = () => {

    return (
        <>
            <header className="App-header">
                <h5 className='mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
                    WHO IS THERE?
                </h5>
                <div className="grid grid-cols-2 gap-20 mt-6">
                    <a href="/facultylogin" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p class="font-normal text-gray-700 dark:text-gray-400">Faculty</p>
                    </a>
                    <a href="/studentlogin" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                        <p class="font-normal text-gray-700 dark:text-gray-400">Student</p>
                    </a>
                </div>
            </header>
        </>
    )
}

export default WhoPage;
