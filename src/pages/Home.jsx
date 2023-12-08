import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';
import React, { useEffect, useState, useLayoutEffect } from "react";
import { db } from "../firebase-handler";
import { doc, collection, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";
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
    const [selectedTimeslots, setSelectedTimeslots] = useState({});
    let timeTableDataAllocated = [];
    
    useLayoutEffect(() => {
        const loadSelectedTimeslotsFromFirestore = async () => {
            const user = auth.currentUser;

            if (user && user.uid) {
                const userId = user.uid;
                const usersRef = collection(db, "users");
                const userDocRef = doc(usersRef, userId);

                try {
                    const userDocSnapshot = await getDoc(userDocRef);

                    if (userDocSnapshot.exists()) {
                        const userSelectedTimeslots = userDocSnapshot.data().slots || [];
                        const selectedTimeslotsData = {};
                        userSelectedTimeslots.forEach((slot) => {
                            const { unit, timeSlot } = slot;
                            selectedTimeslotsData[unit] = [...(selectedTimeslotsData[unit] || []), timeSlot];
                        });

                        setSelectedTimeslots(selectedTimeslotsData);
                    }
                } catch (error) {
                    console.error("Error loading selected timeslots:", error);
                }
            }
        };

        loadSelectedTimeslotsFromFirestore();
    }, []);

    useEffect(() => {
        processSelectedTimeslots();
    }, [selectedTimeslots]);

    const processSelectedTimeslots = () => {
        for (const unit in selectedTimeslots) {
            if (selectedTimeslots.hasOwnProperty(unit)) {
                const timeSlots = selectedTimeslots[unit];
                const convertedData = parseTimeSlots(timeSlots, unit);
                timeTableDataAllocated = timeTableDataAllocated.concat(convertedData);
                console.log(timeTableDataAllocated)
            }
        }
    };

    const parseTimeSlots = (timeSlots, unit) => {
        return timeSlots.map((timeSlot) => {
            const [subject, timeRange] = timeSlot.split(' ');
            const [startTime, endTime] = timeRange.split(' - ');
            const fullSubject = `${unit} - ${subject}`;

            const startDateTime = new Date(`2023-11-01 ${startTime}`);
            const endDateTime = new Date(`2023-11-01 ${endTime}`);

            return {
                Subject: fullSubject,
                StartTime: startDateTime,
                EndTime: endDateTime,
            };
        });
    };

    return (
        <div>
            <div className="bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
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
            <ScheduleComponent eventSettings={{ dataSource: timeTableDataAllocated }}>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
            </ScheduleComponent>
        </div>
    );
};

export default Home;
