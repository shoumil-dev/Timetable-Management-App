import React, { useEffect, useState, useLayoutEffect } from "react";
import { db } from "../firebase-handler";
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, collection, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ViewDirective, ViewsDirective, TimelineViews, TimelineMonth } from '@syncfusion/ej2-react-schedule';
import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIYVZpR2Nbe05zfldCal9UVAciSV9jS31SdEVlWXxcdHdTRWdaUg==');

const Home = () => {
    const [selectedTimeslots, setSelectedTimeslots] = useState({});
    const [timeTableDataAllocated, setTimeTableDataAllocated] = useState([]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.uid) {
                // The user is signed in, you can fetch data here if needed
                loadSelectedTimeslotsFromFirestore(user.uid);
            } else {
                // The user is signed out
                setSelectedTimeslots({});
                setTimeTableDataAllocated([]);
            }
        });

        return () => {
            // Cleanup the subscription when the component is unmounted
            unsubscribe();
        };
    }, []);


    const loadSelectedTimeslotsFromFirestore = async (userId) => {
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
    };

    useEffect(() => {
        processSelectedTimeslots();
    }, [selectedTimeslots]);


    const processSelectedTimeslots = () => {
        if (!selectedTimeslots || Object.keys(selectedTimeslots).length === 0) {
            console.log("No selected timeslots found.");
            return;
        }
        let convertedData = [];
        for (const unit in selectedTimeslots) {
            if (selectedTimeslots.hasOwnProperty(unit)) {
                const timeSlots = selectedTimeslots[unit];
                convertedData = [...convertedData, ...parseTimeSlots(timeSlots, unit)];
            }
        }
        setTimeTableDataAllocated(convertedData);
        console.log(convertedData);
    };

    const parseTimeSlots = (timeSlots, unit) => {
        return timeSlots.map((timeSlot) => {
            if (!timeSlot) {
                console.error('Invalid time slot:', timeSlot);
                return null; // Skip this iteration if timeSlot is invalid
            }

            // Split the time slot into day, subject, and time range
            const [day, subject, ...rest] = timeSlot.split(' ');
            const timeRange = rest.join(' ');

            // Extract start and end times from the time range
            const [startTime, endTime] = timeRange.split(' - ');

            // Get the date based on the day of the week
            const currentDate = new Date();
            currentDate.setMonth(currentDate.getMonth() - 1);
            const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayIndex = daysOfWeek.indexOf(day);
            const startDateTime = new Date(currentDate);
            startDateTime.setDate(currentDate.getDate() + (dayIndex - currentDate.getDay() + 7) % 7);
            startDateTime.setHours(parseInt(startTime.split(':')[0], 10), parseInt(startTime.split(':')[1], 10), 0);

            const endDateTime = new Date(startDateTime);
            endDateTime.setHours(parseInt(endTime.split(':')[0], 10), parseInt(endTime.split(':')[1], 10), 0);

            // Add recurrence rule
            const recurrenceRule = `FREQ=WEEKLY; INTERVAL=1; BYDAY=${day.toUpperCase().substring(0, 2)};`;

            return {
                Subject: `${unit} - ${subject}`,
                StartTime: startDateTime,
                EndTime: endDateTime,
                RecurrenceRule: recurrenceRule,
            };
        }).filter(item => item !== null); // Remove null entries from the array
    }

    return (
        <div>
            <div className="bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
                <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
                    Time Table Monash
                </header>
                <nav className="bg-black text-white p-4">
                    <ul className="flex space-x-4">
                        <li><Link to="/Home" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">Home</Link></li>
                        <li><a href="http://localhost:3000/Create" className="hover:text-gray-400">Create Unit</a></li>
                        <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
                        <li className="ml-auto"><a href="http://localhost:3000/" className="hover:text-gray-400">Log Out</a></li>
                    </ul>
                </nav>
            </div>
            {/* <div>
                {timeTableDataAllocated.map((event, index) => (
                    <div key={index}>
                        <p>{event.Subject}</p>
                        <p>Start Time: {event.StartTime.toString()}</p>
                        <p>End Time: {event.EndTime.toString()}</p>
                        <p>Recurrence Rule: {event.RecurrenceRule}</p>
                        <hr />
                    </div>
                ))}
            </div> */}
            <ScheduleComponent eventSettings={{ dataSource: timeTableDataAllocated }} currentView="WorkWeek" height='730px'>
                <ViewsDirective>
                    <ViewDirective option='Day' startHour="08:00" endHour="21:00" interval={2} displayName="2 Days"></ViewDirective>
                    <ViewDirective option='TimelineDay' startHour="08:00" endHour="21:00"></ViewDirective>
                    <ViewDirective option='WorkWeek' isSelected={true} startHour="08:00" endHour="21:00" ></ViewDirective>
                    <ViewDirective option='Month' startHour="08:00" endHour="21:00" showWeekNumber={true} showWeekend={false}></ViewDirective>
                    <ViewDirective option='Agenda'></ViewDirective>
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth]} />
            </ScheduleComponent>

        </div>
    );
};

export default Home;
