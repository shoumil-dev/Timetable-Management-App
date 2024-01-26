// CreateUnit.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase-handler";
import {
  doc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-solid-svg-icons";

const CreateUnit = () => {
  const [units, setUnits] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState({});
  const [selectedTimeslot, setSelectedTimeslot] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [newUnit, setNewUnit] = useState("");
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [isAddTimeSlotModalOpen, setIsAddTimeSlotModalOpen] = useState(false);
  const [editedTimeSlot, setEditedTimeSlot] = useState("");
  const [editedLocation, setEditedLocation] = useState("");
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);

  const [isEditTimeSlotModalOpen, setIsEditTimeSlotModalOpen] = useState(false);
  const [editedTimeSlotIndex, setEditedTimeSlotIndex] = useState(null);

  const [users, setUsers] = useState([]);
  const [slots, setSlots] = useState([]);

  const toggleNavbarVisibility = () => {
    setIsNavbarVisible(!isNavbarVisible);
  };


  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, "users");
      const snapshot = await getDocs(usersCollection);

      const userData = snapshot.docs.map((doc) => doc.data());
      setUsers(userData);

      const slotsCollection = collection(db, "slots");
      const slotssnapshot = await getDocs(slotsCollection);

      const slotData = slotssnapshot.docs.map((doc) => doc.data());
      setSlots(slotData);
    };
    fetchData();


  }, [selectedUnit]);

  useEffect(() => {
    const fetchData = async () => {
      const unitsCollection = collection(db, "units");
      const snapshot = onSnapshot(unitsCollection, (snapshot) => {
        const unitData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUnits(unitData);
      });
    };
    fetchData();
  }, [selectedUnit]);

  const filterUnitsBySlots = () => {
    // Filter units based on the user's slots
    const userSlots = selectedUnit.slots || [];
    const filteredUnits = units.map((unit) => ({
      ...unit,
      isVisible: userSlots.some((slot) => slot.unit === unit.title),
    }));

    setUnits(filteredUnits);
  };

  useEffect(() => {
    filterUnitsBySlots();
  }, [selectedUnit]);


  useEffect(() => {
    const fetchData = async () => {
      const unitsCollection = collection(db, "units");
      // const snapshot = await getDocs(unitsCollection);

      // const unitData = snapshot.docs.map((doc) => doc.data());
      // Use onSnapshot to listen for real-time updates
      const snapshot = onSnapshot(unitsCollection, (snapshot) => {
        const unitData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUnits(unitData);
      });
    };
    fetchData();
  }, [selectedUnit]);

  const handleAddUnitClick = () => {
    setIsAddUnitModalOpen(true);
  };

  const handleAddUnit = async () => {
    if (newUnit.trim() !== "") {
      const unitData = {
        title: newUnit.trim(),
        timeslot: [],
      };

      try {
        const unitRef = await addDoc(collection(db, "units"), unitData);
        setUnits([...units, { ...unitData, id: unitRef.id }]);
        setIsAddUnitModalOpen(false);

        // Fetch the updated data from Firestore and update the state
        const updatedData = await fetchUpdatedData();
        setUnits(updatedData);
      } catch (error) {
        console.error("Error adding unit:", error);
      }
    }
  };

  const addSlotToFirestore = async (unitId, timeSlot) => {
    try {
      const slotData = {
        unit: selectedUnit.title,
        timeSlot: timeSlot.trim(),
        notification: [],
      };
      const slotRef = await addDoc(collection(db, 'slots'), slotData);
      console.log('Slot added with ID:', slotRef.id);
    } catch (error) {
      console.error('Error adding slot:', error);
    }
  };

  const handleAddTimeSlotClick = () => {
    console.log("Add timeslot button clicked"); // Check if this is logged
    setIsAddTimeSlotModalOpen(true);
  };

  const validateTimeSlotFormat = (timeSlot) => {
    const timeSlotRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \w+( \d{1,2}:\d{2}-\d{1,2}:\d{2})?$/;
    return timeSlotRegex.test(timeSlot);
  };

  const handleAddTimeSlot = async () => {

    if (selectedUnit && selectedUnit.id && newTimeSlot.trim() !== "") {
      const isValidFormat = validateTimeSlotFormat(newTimeSlot.trim());

      if (!isValidFormat) {
        // Show an error message or handle the invalid format
        toast.error("Invalid time slot format. Please enter a valid format.");
        return;
      }

      if (selectedUnit && selectedUnit.id && newTimeSlot.trim() !== "") {
        try {
          const updatedTimeSlots = [...timeSlots, newTimeSlot.trim()];

          await addSlotToFirestore(selectedUnit.id, newTimeSlot.trim());

          const unitDocRef = doc(collection(db, "units"), selectedUnit.id);

          await updateDoc(unitDocRef, { timeslot: updatedTimeSlots });

          console.log("Updated timeSlots:", updatedTimeSlots);

          // Update the 'slots' field in Firestore with the new time slot
          const slotCollection = collection(db, 'slots');
          await addDoc(slotCollection, {
            unit: selectedUnit.title,
            timeSlot: newTimeSlot.trim(),
            location: "",  // Add location if needed
          });

          // Fetch the updated data from Firestore and log it
          const updatedData = await fetchUpdatedData();
          console.log("Updated data from Firestore:", updatedData);

          setTimeSlots(updatedTimeSlots);
          setSelectedUnit((prevUnit) => ({
            ...prevUnit,
            timeslot: updatedTimeSlots,
          }));

          setIsAddTimeSlotModalOpen(false);
        } catch (error) {
          console.error("Error updating document:", error);
        }
      }
    }
  };


  const handleEditTimeSlotClick = (timeSlot, index) => {
    console.log("Edit timeslot button clicked"); // Check if this is logged

    setEditedTimeSlot(timeSlot);
    setEditedTimeSlotIndex(index);

    const selectedTimeslotData = slots.find(
      (slot) => slot.unit === selectedUnit.title && slot.timeSlot === timeSlot
    );
    setSelectedTimeslot(selectedTimeslotData);

    console.log("selected data: ", selectedTimeslotData)
    console.log("selected timeslot: ", selectedTimeslot)

    setIsEditTimeSlotModalOpen(true);
  };

  const handleEditTimeSlot = async () => {
    if (selectedUnit && selectedUnit.id && editedTimeSlot.trim() !== "") {
      // Validate the format of editedTimeSlot
      const timeSlotRegex = /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) \w+( \d{1,2}:\d{2}-\d{1,2}:\d{2})?$/;
  
      if (!timeSlotRegex.test(editedTimeSlot.trim())) {
        // Show an error message or handle the invalid format
        toast.error("Invalid time slot format. Please enter a valid format.");
        console.error("Invalid time slot format. Please enter a valid format.");
        return;
      }
  
      try {
        const oriTimeslot = selectedTimeslot.timeSlot + "";
        console.log("oriTimeslot: ", oriTimeslot);
        const updatedTimeSlots = [...timeSlots];
  
        const slotCollection = collection(db, 'slots');
  
        const slotQuery = query(
          slotCollection,
          where('unit', '==', selectedUnit.title),
          where('timeSlot', '==', oriTimeslot)
        );
  
        const slotSnapshot = await getDocs(slotQuery);
  
        if (!slotSnapshot.empty) {
          console.log("Inside if statement");
          const slotDocRef = slotSnapshot.docs[0].ref;
  
          const updatedSlots = slots.map((slot) => {
            if (slot.timeSlot) {
              if (slot.unit === selectedUnit.title) {
                slot.timeSlot = editedTimeSlot.trim();
                slot.location = editedLocation.trim();
              }
            }
            return slot;
          });
          setSlots(updatedSlots);
  
          // Update the notification field in the same slot document
          const slotData = slotSnapshot.docs[0].data();
          const notificationArray = slotData.notification || [];
  
          await updateDoc(slotDocRef, {
            timeSlot: editedTimeSlot.trim(),
            location: editedLocation.trim(),
            notification: [
              ...notificationArray,
              `${selectedUnit.title} ${oriTimeslot} has been changed to ${editedTimeSlot.trim()}.`,
            ],
          });
        }

        // Loop through each user and update the corresponding timeSlot
        const updatedUsers = users.map((user) => {
          if (user.slots) {
            user.slots.forEach((slot, index) => {
              if (
                slot.timeSlot === updatedTimeSlots[editedTimeSlotIndex] &&
                slot.unit === selectedUnit.title
              ) {
                user.slots[index].timeSlot = editedTimeSlot.trim();
                user.slots[index].location = editedLocation.trim();

                const notificationMessage = `${selectedUnit.title} ${oriTimeslot} has been changed to ${editedTimeSlot.trim()}.`;
                user.notifications = user.notifications || [];
                user.notifications.push(notificationMessage);
              }
            });
            user.notifications = (user.notifications || []).filter(Boolean);
          }
          return user;
        });

        // Update the users locally
        setUsers(updatedUsers);

        // Update the documents in Firestore for all users
        const updateUsersPromises = updatedUsers.map(async (user) => {
          const userDocRef = doc(collection(db, "users"), user.userId);
          console.log("updateuserpromises line244")
          await updateDoc(userDocRef, { slots: user.slots, notifications: user.notifications });
        });
        await Promise.all(updateUsersPromises);

        updatedTimeSlots[editedTimeSlotIndex] = editedTimeSlot.trim();
        const unitDocRef = doc(collection(db, "units"), selectedUnit.id);
        console.log("line251")
        await updateDoc(unitDocRef, {
          timeslot: updatedTimeSlots
        });

        // Show success notification
        toast.success("Timeslot has been edited successfully!");

        // Fetch the updated data from Firestore and log it
        const updatedData = await fetchUpdatedData();
        console.log("Updated data from Firestore:", updatedData);

        setTimeSlots(updatedTimeSlots);
        setSelectedUnit((prevUnit) => ({
          ...prevUnit,
          timeSlot: updatedTimeSlots
        }));

        setIsEditTimeSlotModalOpen(false);
        setEditedTimeSlot("");
        setEditedTimeSlotIndex(null);
      } catch (error) {
        console.error("Error updating document:", error);
        // Show error notification
        toast.error("Error updating timeslot. You can only update timeslots created by this account.");
      }
    }
  };

  const fetchUpdatedData = async () => {
    const unitsCollection = collection(db, "units");
    const snapshot = await getDocs(unitsCollection);
    return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const unitsCollection = collection(db, "units");

      // Use onSnapshot to listen for real-time updates
      const unsubscribe = onSnapshot(unitsCollection, (snapshot) => {
        const unitData = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setUnits(unitData);

        if (unitData.length > 0) {
          const initialUnit = unitData[0];
          setSelectedUnit(initialUnit);
          setTimeSlots(initialUnit.timeslot || []);
        }
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    };

    fetchData();
  }, []);


  const handleUnitClick = async (unit) => {
    const unitDoc = units.find((u) => u.title === unit);
    console.log(unitDoc)
    if (unitDoc) {
      setSelectedUnit({ ...unitDoc, title: unit, id: unitDoc.id });
      const timeSlotsData = unitDoc.timeslot || [];
      setTimeSlots(timeSlotsData);
    }
  };

  const handleRemoveTimeSlot = async (index) => {
    try {
      const updatedTimeSlots = [...timeSlots];
      const removedTimeSlot = updatedTimeSlots.splice(index, 1)[0];

      const unitDocRef = doc(collection(db, "units"), selectedUnit.id);

      await updateDoc(unitDocRef, { timeslot: updatedTimeSlots });

      // Remove timeslot from the "slots" collection
      const slotQuery = query(
        collection(db, 'slots'),
        where('unit', '==', selectedUnit.title),
        where('timeSlot', '==', removedTimeSlot)
      );
      const slotSnapshot = await getDocs(slotQuery);

      if (!slotSnapshot.empty) {
        const slotDocRef = slotSnapshot.docs[0].ref;
        await deleteDoc(slotDocRef);
      }

      // Fetch the updated data from Firestore and log it
      const updatedData = await fetchUpdatedData();
      console.log("Updated data from Firestore:", updatedData);

      setTimeSlots(updatedTimeSlots);
      setSelectedUnit((prevUnit) => ({
        ...prevUnit,
        timeslot: updatedTimeSlots,
      }));

      console.log("Removed timeslot:", removedTimeSlot);
    } catch (error) {
      console.error("Error updating document:", error);
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
            <li>
              <a
                href="http://localhost:3000/User"
                className="hover:text-zinc-400"
              >
                <FontAwesomeIcon icon={faUser} />
              </a>
            </li>
            <li>
              <a
                href="http://localhost:3000/Home"
                className="hover:text-zinc-400"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="http://localhost:3000/Create"
                className="hover:text-zinc-400 bg-blue-500 text-white hover:bg-blue-600 p-4"
              >
                Create Unit
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
          <div className="bg-black text-white p-8 hover:bg-blue-500 hover:text-white border-b-2">
            <button onClick={() => handleAddUnitClick()}>+ Add Unit +</button>
          </div>

          {units.map((unit) => (
            <div
              key={unit.title}
              className={`p-8 hover:bg-black dark:hover:bg-blue-500 hover:text-white border-b-2 ${selectedUnit?.title === unit.title ? "bg-black text-white dark:bg-blue-500" : ""
                }`}
            >
              <button onClick={() => handleUnitClick(unit.title)}>
                {unit.title}
              </button>
            </div>
          ))}
        </div>

        {isAddUnitModalOpen && (
          <div
            className="fixed inset-0 bg-zinc-500 bg-opacity-75 flex items-center justify-center z-50"
            style={{ pointerEvents: "initial" }}
          >
            <div className="bg-white p-8 w-1/3 dark:bg-zinc-900 dark:text-white">
              <h2 className="text-2xl mb-4">Add Unit</h2>
              <input
                type="text"
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="Enter unit name"
                className="border p-2 w-full mb-4 text-black"
              />
              <button
                onClick={handleAddUnit}
                className="bg-blue-500 text-white p-2"
              >
                Add Unit
              </button>
              <button
                onClick={() => setIsAddUnitModalOpen(false)}
                className="ml-2 p-2 bg-red-500 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="overflow-auto ring-2 ring-zinc-300 w-4/5 rounded-2xl text-xl ml-4 m-20">
          <div className="bg-black text-white flex hover:bg-blue-500 hover:text-white justify-between border-b-2">
            <span className="m-8">
              <button onClick={() => handleAddTimeSlotClick()}>
                + Add Timeslot +
              </button>
            </span>
          </div>

          {timeSlots.map((timeSlot, index) => (
            <div key={index} className="flex justify-between border-b-2">
              <span className="m-8">{timeSlot}</span>
              <div className="flex items-center">
                <button
                  className="bg-blue-500 text-white py-2 px-4 rounded-2xl m-6 hover:bg-blue-600 transition duration-300"
                  onClick={() => handleEditTimeSlotClick(timeSlot, index)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white py-2 px-4 rounded-2xl m-6 hover:bg-red-600 transition duration-300"
                  onClick={() => handleRemoveTimeSlot(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {isAddTimeSlotModalOpen && (
            <div
              className="fixed inset-0 bg-zinc-500 bg-opacity-75 flex items-center justify-center z-50"
              style={{ pointerEvents: "initial" }}
            >
              <div className="bg-white p-8 w-1/3 dark:bg-zinc-900 dark:text-white">
                <h2 className="text-2xl mb-4">Add Timeslot</h2>
                <input
                  type="text"
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  placeholder='Enter timeslot (Format: Day TypeClass hh:mm-hh:mm)'
                  className="border p-2 w-full mb-4 text-black"
                />
                <span style={{ position: "relative" }}>
                  Example: Tuesday Lab 14:00-16:00
                </span>
                <br />
                <br />
                <button
                  onClick={handleAddTimeSlot}
                  className="bg-blue-500 text-white p-2"
                >
                  Add Timeslot
                </button>
                <button
                  onClick={() => setIsAddTimeSlotModalOpen(false)}
                  className="ml-2 p-2 bg-red-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {isEditTimeSlotModalOpen && (
            <div
              className="fixed inset-0 bg-zinc-500 bg-opacity-75 flex items-center justify-center z-50"
              style={{ pointerEvents: "initial" }}
            >
              <div className="bg-white p-8 w-1/3 dark:bg-zinc-900">
                <h2 className="text-2xl mb-4">Edit Timeslot</h2>
                <input
                  type="text"
                  value={editedTimeSlot}
                  onChange={(e) => setEditedTimeSlot(e.target.value)}
                  placeholder="Enter Edited Timeslot"
                  className="border p-2 w-full mb-4 text-black"
                />
                <input
                  type="text"
                  value={editedLocation}
                  onChange={(e) => setEditedLocation(e.target.value)}
                  placeholder="Location"
                  className="border p-2 w-full mb-4 text-black"
                />
                <button
                  onClick={handleEditTimeSlot}
                  className="bg-blue-500 text-white p-2"
                >
                  Edit Timeslot
                </button>
                <button
                  onClick={() => setIsEditTimeSlotModalOpen(false)}
                  className="ml-2 p-2 bg-red-500 text-white"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
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

export default CreateUnit;