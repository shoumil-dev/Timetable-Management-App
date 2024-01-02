import React, { useState, useEffect } from "react";
import { db } from "../firebase-handler";
import { doc, collection, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-solid-svg-icons';

const Select = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState({});

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
    const unitDoc = units.find((u) => u.title === unit);
    if (unitDoc) {
      const timeSlotsData = unitDoc.timeslot || [];
      setTimeSlots(timeSlotsData);
    }
  };

  const handleSelectButtonClick = async (timeSlot) => {
    if (selectedUnit && timeSlot) {
      const userId = auth.currentUser.uid;
      console.log("current user Id: " + userId);

      const usersRef = collection(db, "users");
      const userDocRef = doc(usersRef, userId);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const existingSlots = userDocSnapshot.data().slots || [];
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
          ? existingSlots.filter((slot) => !(slot.unit === selectedUnit && slot.timeSlot === timeSlot))
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
      <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white">
        Time Table Monash
      </header>
      <nav className="bg-black text-white p-4">
        <ul className="flex space-x-4">
          <li><a href="http://localhost:3000/User" className="hover:text-zinc-400"><FontAwesomeIcon icon={faUser} /></a></li>
          <li>
            <a href="http://localhost:3000/Home" className="hover:text-zinc-400">
              Home
            </a>
          </li>
          <li>
            <a href="http://localhost:3000/Create" className="hover:text-zinc-400">
              Create Unit
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

      <div className="flex h-screen dark:bg-zinc-900 text-black dark:text-white">
        <div className="overflow-auto ring-2 ring-zinc-300 w-1/5 rounded-2xl text-xl mr-4 m-20 text-center">
          {units.map((unit) => (
            <div
              key={unit.title}
              className={`p-8 hover:bg-black dark:hover:bg-zinc-700 hover:text-white border-b-2 ${selectedUnit && selectedUnit === unit.title ? "bg-black text-white dark:hover:bg-zinc-700 dark:bg-zinc-700" : ""
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
    </div>
  );
};

export default Select;