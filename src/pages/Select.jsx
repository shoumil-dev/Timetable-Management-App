import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebase-handler";
import { doc, addDoc, collection, getDocs, updateDoc, getDoc, documentId } from "firebase/firestore";
import { auth } from "../firebase-handler"


const Select = () => {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const unitsCollection = collection(db, "units");
            const snapshot = await getDocs(unitsCollection);

            const unitData = snapshot.docs.map((doc) => doc.data());
            setUnits(unitData);
        };
        fetchData();
    }, []);

    const handleUnitClick = async (unit) => {
        setSelectedUnit(unit);
        const unitDoc = units.find((u) => u.title === unit);
        if (unitDoc) {
        const timeSlotsData = unitDoc.timeslot || [];
        setTimeSlots(timeSlotsData);
        }
    };

    const handleSelectButtonClick = async () => {
      if (selectedUnit) {
        const userId = auth.currentUser.uid;
        console.log("current user Id: " + userId)

        const usersRef = collection(db, "users")
        const userDocRef = doc(usersRef, userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const existingSlots = userDocSnapshot.data().slots || [];
          const newSlot = { unit: selectedUnit, timeSlot: timeSlots[0]};
          await updateDoc(userDocRef, {
            slots: [...existingSlots, newSlot],
          });
          console.log("Successfully added timeslot")
        }

      }
    }

  return (
    <div className="font-mono text-lg">
        <nav className="bg-black text-white p-4">
            <ul className="flex space-x-4">
            <li>
                <a href="http://localhost:3000/home" className="hover:text-gray-400">
                Home
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
            <div key={unit.title} className="p-8 hover:bg-black hover:text-white border-b-2">
              <button onClick={() => handleUnitClick(unit.title)}>{unit.title}</button>
            </div>
          ))}
        </div>
        


        <div className="overflow-auto ring-2 ring-gray-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="flex justify-between border-b-2">
              <span className="m-8">{timeSlot}</span>
              <button
                className="ring-2 ring-gray-300 hover:bg-gray-100 rounded-2xl float-right py-2 px-10 m-6"
                onClick={handleSelectButtonClick}
              >
                Select
              </button>
            </div>
          ))}
        </div>
  
      </div>
    </div>
  );
};

export default Select;
