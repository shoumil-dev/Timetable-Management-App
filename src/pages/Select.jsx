import React, { useState, useEffect } from "react";
import { db } from "../firebase-handler";
import { doc, collection, getDocs, updateDoc, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";

const Select = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTimeslots, setSelectedTimeslots] = useState({});
  const [editedTimeslots, setEditedTimeslots] = useState({});

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
  
        console.log(`Successfully removed timeslot`);
      }
    }
  };
  
  return (
    <div className="mx-4 bg-white shadow-xl overflow-hidden">
      <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
        Time Table Monash
      </header>
      <nav className="bg-black text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <a href="http://localhost:3000/Home" className="hover:text-gray-400">
              Home
            </a>
          </li>
          <li>
            <a href="http://localhost:3000/Create" className="hover:text-gray-400">
              Create Unit
            </a>
          </li>
          <li>
            <a
              href="http://localhost:3000/Select"
              className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4"
            >
              Timeslot allocation
            </a>
          </li>
          <li className="ml-auto">
            <a href="http://localhost:3000/" className="hover:text-gray-400">
              Log Out
            </a>
          </li>
        </ul>
      </nav>

      <div className="flex h-screen">
        <div className="overflow-auto ring-2 ring-gray-300 w-1/5 rounded-2xl text-xl mr-4 m-20 text-center">
          {units.map((unit) => (
            <div
              key={unit.title}
              className={`p-8 hover:bg-black hover:text-white border-b-2 ${
                selectedUnit === unit.title ? "bg-black text-white" : ""
              }`}
            >
              <button onClick={() => handleUnitClick(unit.title)}>
                {unit.title}
              </button>
            </div>
          ))}
        </div>

        <div className="overflow-auto ring-2 ring-gray-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
  {timeSlots.map((timeSlot, index) => (
    <div key={index} className="flex justify-between border-b-2">
      <span className="m-8">{timeSlot}</span>
      <div className="flex items-center">
        <button
          className={`ring-2 ring-gray-300 ${
            selectedTimeslots[selectedUnit]?.includes(timeSlot)
              ? "bg-gray-400 text-gray-700"
              : "hover:bg-gray-100"
          } rounded-2xl py-2 px-10 m-6`}
          onClick={() => handleSelectButtonClick(timeSlot)}
          disabled={selectedTimeslots[selectedUnit]?.includes(timeSlot)}
        >
          {selectedTimeslots[selectedUnit]?.includes(timeSlot) ? "Selected" : "Select"}
        </button>

        {selectedTimeslots[selectedUnit]?.includes(timeSlot) && (
          <button
            className="ml-2 bg-red-500 text-white py-2 px-4 rounded-2xl"
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