const Select = () => {
    return (
        
        <div class="font-mono text-lg">
            <nav className="bg-black text-white p-4">
                <ul className="flex space-x-4">
                <li><a href="http://localhost:3000/home" className="hover:text-gray-400">Home</a></li>
                <li className="ml-auto">
                    <a href="http://localhost:3000/" className="hover:text-gray-400">
                    Log Out
                    </a>
                </li>
                </ul>
            </nav>

            <div class="flex h-screen"> 
                <div className="overflow-auto ring-2 ring-gray-300 w-1/5 rounded-2xl text-xl mr-4 m-20 text-center">
                    <div class="p-8 hover:bg-black hover:text-white border-b-2">
                        <button >FIT3170</button>
                    </div>
                    <div class="p-8 hover:bg-black hover:text-white border-b-2">
                        <button>FIT3134</button>
                    </div>
                </div>

                <div className="overflow-auto ring-2 ring-gray-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
                    <div class="flex justify-between border-b-2">
                        <span class="m-8">Tutorial 9:00 - 11:00</span>
                        <button class="ring-2 ring-gray-300 hover:bg-gray-100 rounded-2xl float-right py-2 px-10 m-6">Select</button>
                    </div>
                    <div class="flex justify-between border-b-2">
                        <span class="m-8">Tutorial 12:00 - 14:00</span>
                        <button class="ring-2 ring-gray-300 hover:bg-gray-100 rounded-2xl float-right py-2 px-10 m-6">Select</button>
                    </div>
                    <div class="flex justify-between border-b-2">
                        <span class="m-8">Tutorial 15:00 - 17:00</span>
                        <button class="ring-2 ring-gray-300 hover:bg-gray-100 rounded-2xl float-right py-2 px-10 m-6">Select</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Select;