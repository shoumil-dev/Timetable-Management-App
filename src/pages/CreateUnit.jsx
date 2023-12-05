import React, { useRef, useState, useEffect } from "react";
import { db } from "../firebase-handler";
import { doc, addDoc, collection, getDocs, updateDoc, getDoc, documentId } from "firebase/firestore";
import { auth } from "../firebase-handler"

const CreateUnit = () => {
    const [units, setUnits] = useState([]);
    const [selectedUnit, setSelectedUnit] = useState(null);
    const [timeSlots, setTimeSlots] = useState([]);
    const [newUnit, setNewUnit] = useState("");
    const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
    const [newTimeSlot, setNewTimeSlot] = useState("");
    const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);

    const handleAddUnitClick = () => {
        setIsAddUnitModalOpen(true);
    };

    const handleAddUnit = async () => {
        if (newUnit.trim() !== "") {
          const unitData = {
            title: newUnit.trim(),
            timeslot: [],
          };
    
          const unitRef = await addDoc(collection(db, "units"), unitData);
          setUnits([...units, { ...unitData, id: unitRef.id }]);
          setIsAddUnitModalOpen(false);
        }
    };

    const handleAddTimeSlotClick = () => {
    setIsAddTimeSlotModalOpen(true);
    };

    const handleAddTimeSlot = async () => {
    if (newTimeSlot.trim() !== "") {
        const updatedTimeSlots = [...timeSlots, newTimeSlot.trim()];
        const unitDocRef = doc(collection(db, "units"), selectedUnit.id);
        await updateDoc(unitDocRef, { timeslot: updatedTimeSlots });
        setTimeSlots(updatedTimeSlots);
        setIsAddTimeSlotModalOpen(false);
    }
    };

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



    return(
        <div class="mx-4 bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
            <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
                Time Table Monash
            </header>
            <nav className="bg-black text-white p-4">
                <ul className="flex space-x-4">
                <li><a href="http://localhost:3000/Home" className="hover:text-gray-400">Home</a></li>
                <li><a href="http://localhost:3000/Create" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">Create Unit</a></li>
                <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
                <li className="ml-auto"><a href="http://localhost:3000/" className="hover:text-gray-400">Log Out</a></li>
                </ul>
            </nav>

            <div className="flex h-screen">
                <div className="overflow-auto ring-2 ring-gray-300 w-1/5 rounded-2xl text-xl mr-4 m-20 text-center">
                    <div className="bg-gray-600 text-white p-8 hover:bg-blue-500 hover:text-white border-b-2">
                    <button onClick={() => handleAddUnitClick()}>+ Add Unit +</button>
                    </div>
                    
                    {units.map((unit) => (
                    <div key={unit.title} className={`p-8 hover:bg-black hover:text-white border-b-2 ${
                    selectedUnit === unit.title ? "bg-black text-white" : ""
                    }`}>
                    <button onClick={() => handleUnitClick(unit.title)}>{unit.title}</button>
                    </div>
                    ))}
                </div>

                
                {isAddUnitModalOpen && (
                    //This is the code for pop up page to add unit
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                            <div className="bg-white p-8 w-1/3">
                                <h2 className="text-2xl mb-4">Add Unit</h2>
                                <input
                                type="text"
                                value={newUnit}
                                onChange={(e) => setNewUnit(e.target.value)}
                                placeholder="Enter unit name"
                                className="border p-2 w-full mb-4"
                                />
                                <button onClick={handleAddUnit} className="bg-blue-500 text-white p-2">
                                Add Unit
                                </button>
                                <button onClick={() => setIsAddUnitModalOpen(false)} className="ml-2">
                                Cancel
                                </button>
                            </div>
                            </div>
                        )}
        
                <div className="overflow-auto ring-2 ring-gray-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
                    
                    <div className="bg-gray-600 text-white flex hover:bg-blue-500 hover:text-white justify-between border-b-2">
                        <span className="m-8"><button onClick={() => handleAddTimeSlotClick()}>+ Add timeslot +</button></span> 
                    </div>

                    {timeSlots.map((timeSlot, index) => (
                    <div key={index} className="flex justify-between border-b-2">
                        <span className="m-8">{timeSlot}</span>   
                    </div>
                    ))}

                    {isAddTimeSlotModalOpen && (
                            // This is the code for pop-up page to add timeslot
                            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
                            <div className="bg-white p-8 w-1/3">
                                <h2 className="text-2xl mb-4">Add Timeslot</h2>
                                <input
                                type="text"
                                value={newTimeSlot}
                                onChange={(e) => setNewTimeSlot(e.target.value)}
                                placeholder="Enter timeslot"
                                className="border p-2 w-full mb-4"
                                />
                                <button onClick={handleAddTimeSlot} className="bg-blue-500 text-white p-2">
                                Add Timeslot
                                </button>
                                <button onClick={() => setIsAddTimeSlotModalOpen(false)} className="ml-2">
                                Cancel
                                </button>
                            </div>
                            </div>
                        )}

                </div>
            </div>
        </div>
    );
};

export default CreateUnit;