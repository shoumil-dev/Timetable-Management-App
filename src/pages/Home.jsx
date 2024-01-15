// Home.jsx
import React, { useEffect, useState} from "react";
import { db } from "../firebase-handler";
import { Link } from 'react-router-dom';
import { doc, collection, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";
import { Inject, ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, ViewDirective, ViewsDirective, TimelineViews, TimelineMonth } from '@syncfusion/ej2-react-schedule';
import { registerLicense, Internationalization } from '@syncfusion/ej2-base';
import '@syncfusion/ej2-base/styles/bootstrap.css';
import '@syncfusion/ej2-react-schedule/styles/material3.css'; // or any other theme
import Notification from './Notification';
import './Home.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';


// registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIYVZpR2Nbe05zfldCal9UVAciSV9jS31SdEVlWXxcdHdTRWdaUg==');
// 
registerLicense('Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx3WmFZfVpgcl9CYVZTQGYuP1ZhSXxXdkRjW39YdHVXQ2FVV0E=');

const Home = () => {
    const [selectedTimeslots, setSelectedTimeslots] = useState({});
    const [selectedLocation, setSelectedLocation] = useState({});

    const [timeTableDataAllocated, setTimeTableDataAllocated] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const defaultColors = [
        '#FF5733',
        '#5300ff',
        '#36A2EB',
        '#4CAF50',
        '#ff9680',
        '#ff80aa',
        '#aaff80',
        '#ddffcd',
        '#a67100',
        '#0088a6',
        '#88a600',
        '#a61e00',
    ];

    const secondColors = [
        '#FFA895',
        '#9562ff',
        '#8fcbf4',
        '#aadaac',
        '#ffc7bb',
        '#ffbbd1',
        '#aaff80',
        '#d1ffbb',
        '#ffca58',
        '#6be4ff',
        '#daff30',
        '#ff6644',
    ];
  // ... other component code

  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  

  useEffect(() => {
    const handleMediaQueryChange = () => {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    };

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return
 
  }, []);

    const handleNotificationButtonClick = () => {
        setShowNotification(true);
    };

    const handleNotificationClose = () => {
        setShowNotification(false);
      };

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
                const selectedLocationData = {};

                userSelectedTimeslots.forEach((slot) => {
                    const { unit, timeSlot, location } = slot;
                    selectedTimeslotsData[unit] = [...(selectedTimeslotsData[unit] || []), timeSlot];
                    selectedLocationData[unit] = location;
                });
                setSelectedTimeslots(selectedTimeslotsData);
                setSelectedLocation(selectedLocationData);
                
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
        // Assign a primary color to each event from the defaultColors array
        console.log(selectedLocation)
        convertedData.forEach((event, index) => {
            event.PrimaryColor = defaultColors[index % defaultColors.length];
            event.SecondaryColor = secondColors[index % secondColors.length];
        });

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
            const timeRangeParts = timeRange.split('-');
    
            // Check if both start and end times are available
            if (timeRangeParts.length !== 2) {
                console.error('Invalid time range:', timeRange);
                return null; // Skip this iteration if time range is invalid
            }
    
            const startTime = timeRangeParts[0];
            const endTime = timeRangeParts[1];
    
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
                Location: selectedLocation[unit] || '' // Ensure Location is defined, provide a default value if not
            };
        }).filter(item => item !== null); // Remove null entries from the array
    };
    

    let instance = new Internationalization();
    const getTimeString = (value) => {
        return instance.formatDate(value, { skeleton: 'hm' });
    };

    const eventTemplate = (props) => {
        return (
            <div className="template-wrap" style={{ background: props.SecondaryColor, height: '100%', padding: '5px' }}>
                <div className="subject" style={{ background: props.PrimaryColor, fontWeight: '600', fontSize: '16px' }}>
                    {props.Subject}
                </div>
                <div className="time" style={{ background: props.PrimaryColor }}>
                    Time: {getTimeString(props.StartTime)} - {getTimeString(props.EndTime)}
                </div>
                <div className="location" style={{ background: props.PrimaryColor }}>
                    Location: {props.Location || 'No location specified'}
                </div>
                {/* Add the unit and timeslot information */}
                <div className="unit" style={{ background: props.PrimaryColor }}>
                    Unit: {props.Subject.split(' - ')[0]}
                </div>
                <div className="timeslot" style={{ background: props.PrimaryColor }}>
                    Timeslot: {props.Subject.split(' - ')[1]}
                </div>
            </div>
        );
    };
    
    
    


    return (
        <div className="dark:bg-zinc-900 h-screen"  class={isDarkMode ? 'e-dark-mode' : ''}>
            <div className="bg-white dark:bg-zinc-900 shadow-xl overflow-hidden">
                <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-zinc-900">
                    Time Table Monash
                </header>
                <nav className="bg-black text-white p-4">
                    <ul className="flex space-x-4">
                        <li><a href="http://localhost:3000/User" className="hover:text-gray-400"><FontAwesomeIcon icon={faUser} /></a></li>
                        <li><Link to="/Home" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">Home</Link></li>
                        <li><a href="http://localhost:3000/Create" className="hover:text-gray-400">Create Unit</a></li>
                        <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
                        <li className="ml-auto"><a href="http://localhost:3000/" className="hover:text-gray-400">Log Out</a></li>
                        <li><button onClick={handleNotificationButtonClick}><FontAwesomeIcon icon={faBell} /></button>
                            {showNotification && (
                            <Notification
                                notifications={[
                                'FIT2004 Tutorial 12:00 - 14:00 has been changed to 14:00 - 16:00',
                                'FIT2005 Tutorial 12:00 - 14:00 has been changed to 14:00 - 16:00',
                                'FIT2006 Tutorial 12:00 - 14:00 has been changed to 14:00 - 16:00',
                                ]}
                                onClose={handleNotificationClose}
                            />
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
            <ScheduleComponent eventSettings={{ dataSource: timeTableDataAllocated}}  
            currentView="WorkWeek" height='825px'      
            >
                <ViewsDirective >
                    <ViewDirective option='Day' startHour="08:00" endHour="21:00" interval={2} displayName="2 Days"></ViewDirective>
                    <ViewDirective option='TimelineDay' startHour="08:00" endHour="21:00"></ViewDirective> 
                    <ViewDirective option='WorkWeek' isSelected={true} startHour="08:00" endHour="21:00" eventTemplate={eventTemplate} />
                    <ViewDirective option='Month' startHour="08:00" endHour="21:00" showWeekNumber={true} showWeekend={false}></ViewDirective>
                    <ViewDirective option='Agenda'></ViewDirective>
                </ViewsDirective>
                <Inject services={[Day, Week, WorkWeek, Month, Agenda, TimelineViews, TimelineMonth]} />
            </ScheduleComponent>
            
        </div>
    );
};

export default Home;
