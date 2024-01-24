// Select.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase-handler";
import { doc, collection, getDocs, updateDoc, getDoc, where, query, startAfter, orderBy } from "firebase/firestore";
import { auth } from "../firebase-handler";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { _TrueTypeLocaTable } from "@syncfusion/ej2/pdf";

const Select = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const toggleNavbarVisibility = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };

  useEffect(() => {
    const fetchData = async () => {
      const unitsCollection = collection(db, "units");
      const snapshot = await getDocs(unitsCollection);

      const unitData = snapshot.docs.map((doc) => doc.data());
      setUnits(unitData);
    };
    fetchData();
  }, [selectedUnit]);

  useEffect(() => {
    // Load user-specific selected timeslots from Firestore on component mount
    const loadSelectedTimeslotsFromFirestore = async () => {
      const user = auth.currentUser;

      // Check if the user is authenticated before accessing uid
      if (user && user.uid) {
        const userId = user.uid;
        const usersRef = collection(db, "users");
        const userDocRef = doc(usersRef, userId);
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
      }
    };

    loadSelectedTimeslotsFromFirestore();
  }, [selectedUnit]);


  const handleUnitClick = async (unit) => {
    setSelectedUnit(unit);
    setSearchInput(""); // Clear the search input when a unit is clicked
    const unitDoc = units.find((u) => u.title === unit);
    if (unitDoc) {
      const timeSlotsData = unitDoc.timeslot || [];
      setTimeSlots(timeSlotsData);
    }
  };

  const handleSearchChange = async (e) => {
    setSearchInput(e.target.value);
    searchUnits(e.target.value);
  };

  const searchUnits = async (input) => {
    const unitsRef = collection(db, "units");
    const q = query(unitsRef, where("title", ">=", input), orderBy("title"), startAfter(input));

    try {
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching units:", error);
    }
  };

  const handleSelectButtonClick = async (timeSlot) => {
    if (selectedUnit && timeSlot) {
      const userId = auth.currentUser.uid;
  
      const usersRef = collection(db, "users");
      const userDocRef = doc(usersRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
        const existingSlots = userDocSnapshot.data().slots || [];
  
        // Check for clashes across different units
        var hasTimeSlotClash = false;
        existingSlots.every((slot) =>
          {
            if (doTimeSlotsClash(slot.timeSlot, timeSlot)) {
              hasTimeSlotClash = true;
              return false;
            }
            return true;
          }
        );
  
        if (hasTimeSlotClash) {
          alert("Time slot clash! Please choose a different time slot.");
          return;
        }
  
        const isAlreadySelected = existingSlots.some(
          (slot) => slot.unit === selectedUnit && slot.timeSlot === timeSlot
        );
  
        const confirmed = window.confirm(
          `You are about to ${isAlreadySelected ? 'deselect' : 'select'} ${timeSlot} for ${selectedUnit}. Do you want to proceed?`
        );
  
        if (!confirmed) {
          return;
        }
  
        const updatedSlots = isAlreadySelected
          ? existingSlots.filter(
              (slot) => !(slot.unit === selectedUnit && slot.timeSlot === timeSlot)
            )
          : [...existingSlots, { unit: selectedUnit, timeSlot: timeSlot }];
  
        await updateDoc(userDocRef, {
          slots: updatedSlots,
        });
  
        setSelectedTimeslots((prevSelectedTimeslots) => ({
          ...prevSelectedTimeslots,
          [selectedUnit]: updatedSlots.map((slot) => slot.timeSlot),
        }));
  
        console.log(`Successfully ${isAlreadySelected ? 'removed' : 'added'} timeslot`);
      }
    }
  };
  
  const doTimeSlotsClash = (timeSlot1, timeSlot2) => {
    // console.log(timeSlot1,timeSlot2)
    // Parse the day and time from the time slots
    const parseTime = (timeSlot) => {
      const [day, type, range] = timeSlot.split(' ');
      const [startTime, endTime] = range.split('-');
      return { day, startTime, endTime };
    };
  
    const { day: day1, startTime: start1, endTime: end1 } = parseTime(timeSlot1);
    const { day: day2, startTime: start2, endTime: end2 } = parseTime(timeSlot2);
    
    // console.log(day1)
    // console.log("aaa")
    // console.log(day2)
    // Check if the days are the same
    if (!(day1.trim() === day2.trim())) {
      return false;
    }


    // Check for clash in time ranges
    return (
      (start1 <= start2 && end1 > start2) ||
      (start2 <= start1 && end2 > start1) ||
      (start1 >= start2 && start1 < end2) ||
      (start2 >= start1 && start2 < end1)
    );
  };
  
  
  const handleDeselectButtonClick = async (timeSlot) => {
    if (selectedUnit && timeSlot) {
      const userId = auth.currentUser.uid;

      const usersRef = collection(db, "users");
      const userDocRef = doc(usersRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const existingSlots = userDocSnapshot.data().slots || [];
        const isAlreadySelected = existingSlots.some(
          (slot) => slot.unit === selectedUnit && slot.timeSlot === timeSlot
        );

        const confirmed = window.confirm(
          `You are about to ${isAlreadySelected ? "deselect" : "select"} ${timeSlot} for ${selectedUnit}. Do you want to proceed?`
        );

        if (!confirmed) {
          return;
        }

        const updatedSlots = existingSlots.filter(
          (slot) => !(slot.unit === selectedUnit && slot.timeSlot === timeSlot)
        );

        await updateDoc(userDocRef, {
          slots: updatedSlots,
        });

        setSelectedTimeslots((prevSelectedTimeslots) => ({
          ...prevSelectedTimeslots,
          [selectedUnit]: updatedSlots.map((slot) => slot.timeSlot),
        }));

        console.log(`Successfully ${isAlreadySelected ? "removed" : "added"} timeslot`);
      }
    }
  };


  return (
    <div className="bg-white shadow-xl overflow-hidden">
      <header className="bg-black text-white text-center font-serif text-3xl py-3 border-b border-white dark:border-zinc-900 flex justify-center items-center">
        <img src="monash.png" className="h-14" alt="Monash University Logo" />
      </header>
      {isNavbarVisible && (
        <nav className="bg-black text-white p-4">
          <ul className="flex space-x-4">
            <li><a href="http://localhost:3000/User" className="hover:text-zinc-400"><FontAwesomeIcon icon={faUser} /></a></li>
            <li>
              <a href="http://localhost:3000/Home" className="hover:text-zinc-400">
                Home
              </a>
            </li>
            <li>
              <a
                href="http://localhost:3000/Select"
                className="hover:text-zinc-400 bg-blue-500 text-white hover:bg-blue-600 p-4"
              >
                Timeslot allocation
              </a>
            </li>
            <li className="ml-auto">
              <a href="http://localhost:3000/" className="hover:text-zinc-400">
                Log Out
              </a>
            </li>
          </ul>
        </nav>
      )}

      <div className="flex h-screen dark:bg-zinc-900 text-black dark:text-white">
        <div className="overflow-auto ring-2 ring-zinc-300 w-1/5 rounded-2xl text-xl mr-4 m-20 text-center">
          <input
            type="text"
            placeholder="Search units..."
            value={searchInput}
            onChange={handleSearchChange}
            className="p-2 border-b-2 border-zinc-300 focus:outline-none focus:border-zinc-500"
          />

          {searchResults.map((unit) => (
            <div
              key={unit.title}
              className={`p-8 hover:bg-black dark:hover:bg-blue-500 hover:text-white border-b-2 ${selectedUnit && selectedUnit === unit.title ? "bg-black text-white dark:hover:bg-blue-500 dark:bg-blue-500" : ""
                }`}
            >
              <button onClick={() => handleUnitClick(unit.title)}>
                {unit.title}
              </button>
            </div>
          ))}

          {units.map((unit) => (
            <div
              key={unit.title}
              className={`p-8 hover:bg-black dark:hover:bg-blue-500 hover:text-white border-b-2 ${selectedUnit && selectedUnit === unit.title ? "bg-black text-white dark:hover:bg-blue-500 dark:bg-blue-500" : ""
                }`}
            >
              <button onClick={() => handleUnitClick(unit.title)}>
                {unit.title}
              </button>
            </div>
          ))}
        </div>

        <div className="overflow-auto ring-2 ring-zinc-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="flex justify-between border-b-2">
              <span className="m-8">{timeSlot}</span>
              <div className="flex items-center">
                <button
                  className={`ring-2 ring-zinc-300 ${selectedTimeslots[selectedUnit]?.includes(timeSlot)
                    ? "bg-zinc-700 text-white"
                    : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
                    } rounded-full py-2 px-6 m-2 transition duration-300`}
                  onClick={() => handleSelectButtonClick(timeSlot)}
                  disabled={selectedTimeslots[selectedUnit]?.includes(timeSlot)}
                >
                  {selectedTimeslots[selectedUnit]?.includes(timeSlot) ? "Selected" : "Select"}
                </button>

                {selectedTimeslots[selectedUnit]?.includes(timeSlot) && (
                  <button
                    className="ml-2 mr-2 bg-red-500 text-white rounded-full py-2 px-4 hover:bg-red-600 transition duration-300"
                    onClick={() => handleDeselectButtonClick(timeSlot)}
                  >
                    Deselect
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute top-4 right-4">
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

export default Select;