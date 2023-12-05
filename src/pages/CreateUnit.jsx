

const CreateUnit = () => {
    return(
        <div class="mx-4 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
            <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
                Time Table Monash
            </header>
            <nav className="bg-black text-white p-4">
                <ul className="flex space-x-4">
                <li><a href="http://localhost:3000/Home" className="hover:text-gray-400">Home</a></li>
                <li><a href="#" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">Unit allocation</a></li>
                <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
                <li className="ml-auto">
                    <a href="http://localhost:3000/" className="hover:text-gray-400">
                    Log Out
                    </a>
                </li>
                <li><a href="http://localhost:3000/t" className="hover:text-gray-400">Test</a></li>
                </ul>
            </nav>
        </div>
    );
};

export default CreateUnit;