// UserPage.jsxs
import React, { useEffect, useState } from "react";
import { db } from "../firebase-handler";
import { Link } from 'react-router-dom';
import { doc, collection, getDoc, setDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';

const UserPage = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [nameInput, setNameInput] = useState("");
  const [genderInput, setGenderInput] = useState("");
  const [birthdateInput, setBirthdateInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => { 
    const fetchUserDetails = async () => {
      try {
        const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          setUserDetails(userDocSnapshot.data());
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleNameSubmit = async () => {
    try {
      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      await setDoc(userDocRef, { name: nameInput }, { merge: true });

      setUserDetails({ ...userDetails, name: nameInput });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user name:", error);
    }
  };

  const handleGenderSubmit = async () => {
    try {
      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      await setDoc(userDocRef, { gender: genderInput }, { merge: true });

      setUserDetails({ ...userDetails, gender: genderInput });
    } catch (error) {
      console.error("Error updating gender:", error);
    }
  };
  
  const handleBirthdateSubmit = async () => {
    try {
      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      await setDoc(userDocRef, { birthdate: birthdateInput }, { merge: true });

      setUserDetails({ ...userDetails, birthdate: birthdateInput });
    } catch (error) {
      console.error("Error updating birthdate:", error);
    }
  };

  const handleRemoveSlot = async (index) => {
    try {
      const updatedSlots = [...userDetails.slots];
      updatedSlots.splice(index, 1);

      const userDocRef = doc(collection(db, "users"), auth.currentUser.uid);
      await setDoc(userDocRef, { slots: updatedSlots }, { merge: true });

      setUserDetails({ ...userDetails, slots: updatedSlots });
    } catch (error) {
      console.error("Error removing time slot:", error);
    }
  };

  return (
    <div className="bg-white shadow-xl overflow-hidden">
      <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white">
        Time Table Monash
      </header>
      <nav className="bg-black text-white p-4">
        <ul className="flex space-x-4">
          <li>
            <Link to="/Home" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4">
              <FontAwesomeIcon icon={faUserEdit} />
            </Link>
          </li>
          <li><Link to="/Home" className="hover:text-gray-400">Home</Link></li>
          <li><Link to="/Create" className="hover:text-gray-400">Create Unit</Link></li>
          <li><Link to="/Select" className="hover:text-gray-400">Timeslot Allocation</Link></li>
          <li className="ml-auto"><Link to="/" className="hover:text-gray-400">Log Out</Link></li>
        </ul>
      </nav>

      <div className="m-4" >
        <h2 className="text-3xl font-bold mb-4">User Details</h2>
        {userDetails ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-700 font-bold text-lg">Name:</div>
            <div className="flex items-center">
              {isEditing ? (
                <div>
                  <input
                    type="text"
                    className="border-2 border-gray-500 rounded-md p-2 text-lg"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                  />
                  <button
                    onClick={handleNameSubmit}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <p className="text-gray-600 text-lg">{userDetails.name || "Name not set"}</p>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    {userDetails.name ? "Edit" : "Add"}
                  </button>
                </div>
              )} 
            </div>

            <div className="text-gray-700 font-bold text-lg">Email:</div>
            <div className="text-gray-600 text-lg">{userDetails.email}</div>

            <div className="text-gray-700 font-bold text-lg">User Id:</div>
            <div className="text-gray-600 text-lg">{userDetails.userId}</div>

            <div className="text-gray-700 font-bold text-lg">Account type:</div>
            <div className="text-gray-600 text-lg">{userDetails.role}</div>

            <div className="text-gray-700 font-bold text-lg">Class slots:</div>
            <div className="text-gray-600 text-lg">
              {userDetails.slots && userDetails.slots.length > 0 ? (
                <ul>
                  {userDetails.slots.map((slot, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div>{slot.unit} - {slot.timeSlot}</div>
                      <button
                        onClick={() => handleRemoveSlot(index)}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded text-sm ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No time slots allocated.</p>
              )}
            </div>

            <div className="text-gray-700 font-bold text-lg">Gender:</div>
          <div className="flex items-center">
            {isEditing ? (
              <div>
                <select
                  value={genderInput}
                  onChange={(e) => setGenderInput(e.target.value)}
                  className="border-2 border-gray-500 rounded-md p-2 text-lg"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <button
                  onClick={handleGenderSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-600 text-lg">{userDetails.gender || "Gender not set"}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  {userDetails.gender ? "Edit" : "Add"}
                </button>
              </div>
            )}
          </div>

          <div className="text-gray-700 font-bold text-lg">Birthdate:</div>
          <div className="flex items-center">
            {isEditing ? (
              <div>
                <input
                  type="date"
                  value={birthdateInput}
                  onChange={(e) => setBirthdateInput(e.target.value)}
                  className="border-2 border-gray-500 rounded-md p-2 text-lg"
                />
                <button
                  onClick={handleBirthdateSubmit}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <p className="text-gray-600 text-lg">{userDetails.birthdate || "Birthdate not set"}</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2"
                >
                  {userDetails.birthdate ? "Edit" : "Add"}
                </button>
              </div>
            )}
          </div>

          
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div> 
    </div>
  );
};

export default UserPage;
