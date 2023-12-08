import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import React from 'react';
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIYVZpR2Nbe05zfldCal9UVAciSV9jS31SdEVlWXxcdHdTRWdaUg==');
const localData = {
    dataSource: [
        {
            Subject: 'FIT3170 - Workshop',
            EndTime: new Date(2023, 11, 7, 6, 30),
            StartTime: new Date(2023, 11, 7, 4, 0),
        },
        {
            Subject: 'FIT3077 - Tutor',
            EndTime: new Date(2023, 11, 9, 16, 30),
            StartTime: new Date(2023, 11, 9, 14, 0)
        },
        {
            Subject: 'FIT3159 - Lecture',
            EndTime: new Date(2023, 11, 5, 13, 30),
            StartTime: new Date(2023, 11, 5, 11, 0)
        },

    ]
}

const Home = () => {
    return (
        <div>
            <div class=" bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
                    Time Table Monash
                </header>
                <nav className="bg-black text-white p-4">
                    <ul className="flex space-x-4">
                        <li><a href="http://localhost:3000/Home" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">Home</a></li>
                        <li><a href="http://localhost:3000/Create" className="hover:text-gray-400">Create Unit</a></li>
                        <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
                        <li className="ml-auto"><a href="http://localhost:3000/" className="hover:text-gray-400">Log Out</a></li>
                    </ul>
                </nav>
            </div>
            <ScheduleComponent eventSettings={localData}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
        </div>
    );
};

export default Home;