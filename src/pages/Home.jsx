// Home.jsx
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase-handler";
import { Link } from "react-router-dom";
import { doc, collection, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";
import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  WorkWeek,
  Month,
  Agenda,
  ViewDirective,
  ViewsDirective,
  TimelineViews,
  TimelineMonth,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense, Internationalization } from "@syncfusion/ej2-base";
import "@syncfusion/ej2-base/styles/bootstrap.css";
import "@syncfusion/ej2-react-schedule/styles/material3.css"; // or any other theme
import Notification from "./Notification";
import "./Home.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";

// registerLicense('Ngo9BigBOggjHTQxAR8/V1NHaF1cWWhIYVZpR2Nbe05zfldCal9UVAciSV9jS31SdEVlWXxcdHdTRWdaUg==');
//
registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NAaF5cWWJCfEx3WmFZfVpgcl9CYVZTQGYuP1ZhSXxXdkRjW39YdHVXQ2FVV0E="
);

const Home = () => {
  const [selectedTimeslots, setSelectedTimeslots] = useState({});
  const [selectedLocation, setSelectedLocation] = useState({});
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [timeTableDataAllocated, setTimeTableDataAllocated] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [userRole, setUserRole] = useState("");
  // Retrieve the value from localStorage, default to true if not present
  const [showNotificationOnce, setShowNotificationOnce] = useState(() => {
    const storedValue = localStorage.getItem('showNotificationOnce');
    return storedValue ? JSON.parse(storedValue) : true;
  });

  const toggleNavbarVisibility = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  const defaultColors = [
    "#4466ff",
    "#cc00dd",
    "#36A2EB",
    "#008855",
    "#aa6600",
    "#dd3322",
    "#dd3344",
    "#cc4466",
    "#7755ff",
  ];

  const secondColors = [
    "#4466ff",
    "#cc00dd",
    "#36A2EB",
    "#008855",
    "#aa6600",
    "#dd3322",
    "#dd3344",
    "#cc4466",
    "#7755ff",
  ];
  // ... other component code

  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  const handleEventClick = (args) => {
    args.cancel = true; // Cancel the default behavior (opening the event popup)
  };

  useEffect(() => {
    const handleMediaQueryChange = () => {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return;
  }, []);

  const handleNotificationButtonClick = () => {
    setShowNotification(true);
  };

  const handleNotificationClose = () => {
    setShowNotification(false);
    setShowNotificationOnce(false);
    // Save the updated value to localStorage
    localStorage.setItem('showNotificationOnce', JSON.stringify(false));
  };

  const loadNotificationsFromFirestore = async (userId) => {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, userId);

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userNotifications = userDocSnapshot.data().notifications || [];
        // Reverse the order of notifications
        setNotifications(userNotifications.reverse());
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.uid) {
        // The user is signed in, you can fetch data here if needed
        loadSelectedTimeslotsFromFirestore(user.uid);
        loadNotificationsFromFirestore(user.uid);
        loadUserRoleFromFirestore(user.uid);
      } else {
        // The user is signed out
        setSelectedTimeslots({});
        setTimeTableDataAllocated([]);
        setNotifications([]);
        setUserRole("");
      }
    });

    return () => {
      // Cleanup the subscription when the component is unmounted
      unsubscribe();
    };
  }, []);

  const loadUserRoleFromFirestore = async (userId) => {
    const usersRef = collection(db, "users");
    const userDocRef = doc(usersRef, userId);

    try {
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const role = userDocSnapshot.data().role || "";
        setUserRole(role);
      }
    } catch (error) {
      console.error("Error loading user role:", error);
    }
  };

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
          selectedTimeslotsData[unit] = [
            ...(selectedTimeslotsData[unit] || []),
            timeSlot,
          ];
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
    console.log(selectedLocation);
    convertedData.forEach((event, index) => {
      event.PrimaryColor = defaultColors[index % defaultColors.length];
      event.SecondaryColor = secondColors[index % secondColors.length];
    });

    setTimeTableDataAllocated(convertedData);
    console.log(convertedData);
  };

  const parseTimeSlots = (timeSlots, unit) => {
    return timeSlots
      .map((timeSlot) => {
        if (!timeSlot) {
          console.error("Invalid time slot:", timeSlot);
          return null; // Skip this iteration if timeSlot is invalid
        }

        // Split the time slot into day, subject, and time range
        const [day, subject, ...rest] = timeSlot.split(" ");
        const timeRange = rest.join(" ");

        // Extract start and end times from the time range
        const timeRangeParts = timeRange.split("-");

        // Check if both start and end times are available
        if (timeRangeParts.length !== 2) {
          console.error("Invalid time range:", timeRange);
          return null; // Skip this iteration if time range is invalid
        }

        const startTime = timeRangeParts[0];
        const endTime = timeRangeParts[1];

        // Get the date based on the day of the week
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() - 1);
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const dayIndex = daysOfWeek.indexOf(day);
        const startDateTime = new Date(currentDate);
        startDateTime.setDate(
          currentDate.getDate() + ((dayIndex - currentDate.getDay() + 7) % 7)
        );
        startDateTime.setHours(
          parseInt(startTime.split(":")[0], 10),
          parseInt(startTime.split(":")[1], 10),
          0
        );

        const endDateTime = new Date(startDateTime);
        endDateTime.setHours(
          parseInt(endTime.split(":")[0], 10),
          parseInt(endTime.split(":")[1], 10),
          0
        );

        // Add recurrence rule
        const recurrenceRule = `FREQ=WEEKLY; INTERVAL=1; BYDAY=${day
          .toUpperCase()
          .substring(0, 2)};`;

        return {
          Subject: `${unit} - ${subject}`,
          StartTime: startDateTime,
          EndTime: endDateTime,
          RecurrenceRule: recurrenceRule,
          Location: selectedLocation[unit] || "", // Ensure Location is defined, provide a default value if not
        };
      })
      .filter((item) => item !== null); // Remove null entries from the array
  };

  let instance = new Internationalization();
  const getTimeString = (value) => {
    return instance.formatDate(value, { skeleton: "hm" });
  };
  const handleLogout = () => {
    // CHANGE TO FALSE IF WE WANT TO NOT SHOW ANY NOTIFICATION AFTER LOG IN AGAIN
    localStorage.setItem('showNotificationOnce', JSON.stringify(true)); 
  };

  const eventTemplate = (props) => {
    return (
      <div
        className="template-wrap"
        style={{ background: props.SecondaryColor, paddingBottom: "200%" }}
      >
        <div
          className="subject"
          style={{
            background: props.PrimaryColor,
            width: "120%",
            marginLeft: "-10px",
            paddingBottom: "10px",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          {props.Subject}
        </div>
        <div
          className="time"
          style={{
            background: props.PrimaryColor,
            width: "120%",
            marginLeft: "-10px",
          }}
        >
          {" "}
          Time: {getTimeString(props.StartTime)} -{" "}
          {getTimeString(props.EndTime)}
        </div>
        <div
          className="event-description"
          style={{
            background: props.PrimaryColor,
            width: "120%",
            marginLeft: "-10px",
          }}
        >
          {" "}
          Location: {props.Location}
        </div>
      </div>
    );
  };

  return (
    <div
      className="dark:bg-zinc-900 h-screen"
      class={isDarkMode ? "e-dark-mode" : ""}
    //   style={{ zIndex: "9999999999", marginTop: "5px" }}
    >
      <div
        className="bg-white dark:bg-zinc-900 shadow-xl overflow-hidden"
        // style={{ zIndex: "9999999999", marginTop: "5px" }}
      >
        <header
          className="bg-black text-white text-center font-serif text-3xl py-3 border-b border-white dark:border-zinc-900 flex justify-center items-center"
          
        >
          <img
            src="monash1.png"
            className="h-15"
            alt="Monash University Logo"
            style={{ zIndex: "9999999999999999999999999"}}
          />
        </header>

        {isNavbarVisible && (
          <nav className="bg-black text-white p-4">
            <ul className="flex space-x-4">
              <li>
                <a
                  href="http://localhost:3000/User"
                  className="hover:text-gray-400"
                >
                  <FontAwesomeIcon icon={faUser} />
                </a>
              </li>
              <li>
                <Link
                  to="/Home"
                  className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4"
                >
                  Home
                </Link>
              </li>
              {userRole === "lecturer" && (
                <li>
                  <a
                    href="http://localhost:3000/Create"
                    className="hover:text-gray-400"
                  >
                    Create Unit
                  </a>
                </li>
              )}
              {userRole === "student" && (
                <li>
                  <a
                    href="http://localhost:3000/Select"
                    className="hover:text-gray-400"
                  >
                    Timeslot allocation
                  </a>
                </li>
              )}
              <li className="ml-auto">
                <a
                  href="http://localhost:3000/"
                  className="hover:text-gray-400" onClick={handleLogout}
                >
                  Log Out 
                </a>
              </li>
              <li>
  
                <button onClick={handleNotificationButtonClick}>
                  <FontAwesomeIcon icon={faBell} />
                </button>

                {(showNotificationOnce === true && notifications.length > 0) && (
                <>
                    <Notification
                    notifications={notifications}
                    onClose={handleNotificationClose}
                    />
                    {console.log(showNotificationOnce)}
                </>
                )}

                {notifications.length > 0 && (
                  <span className="notification-count">
                    {notifications.length}
                  </span>
                )}
                {showNotification && (
                  <Notification
                    notifications={notifications}
                    onClose={handleNotificationClose}
                  />
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>

      <ScheduleComponent
        eventSettings={{ dataSource: timeTableDataAllocated }}
        currentView="WorkWeek"
        height="825px"
        eventClick={handleEventClick}
        popupOpen={handleEventClick} // This prevents the default behavior
      >
        <ViewsDirective>
          <ViewDirective
            option="Day"
            startHour="08:00"
            endHour="21:00"
            interval={2}
            displayName="2 Days"
          ></ViewDirective>
          <ViewDirective
            option="TimelineDay"
            startHour="08:00"
            endHour="21:00"
          ></ViewDirective>
          <ViewDirective
            option="WorkWeek"
            isSelected={true}
            startHour="08:00"
            endHour="21:00"
            eventTemplate={eventTemplate}
          />
          <ViewDirective
            option="Month"
            startHour="08:00"
            endHour="21:00"
            showWeekNumber={true}
            showWeekend={false}
          ></ViewDirective>
          <ViewDirective option="Agenda"></ViewDirective>
        </ViewsDirective>
        <Inject
          services={[
            Day,
            Week,
            WorkWeek,
            Month,
            Agenda,
            TimelineViews,
            TimelineMonth,
          ]}
        />
      </ScheduleComponent>

            <div className="absolute top-4 right-4" style={{ zIndex:'99999999999999999999999999' }}>
                <label
                    htmlFor="toggleNavbar"
                    className="text-white ms-2 text-sm font-medium">
                    Show Menu
                </label>
                <input
                    type="checkbox"
                    id="toggleNavbar"
                    checked={isNavbarVisible}
                    onChange={toggleNavbarVisibility}
                    className="m-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
            </div>
        </div>
    );
};

export default Home;
