import React, { useEffect, useState } from "react";
import { db } from "../firebase-handler";
import { Link } from 'react-router-dom';
import { doc, collection, getDoc } from "firebase/firestore";
import { auth } from "../firebase-handler";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faBuilding, faCogs, faFlag, faUser } from '@fortawesome/free-solid-svg-icons';

const UserPage = () => {
  const [userDetails, setUserDetails] = useState(null);

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

  return (
    <div>
      <div className="bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <header className="bg-black text-white text-center font-serif text-3xl py-6 border-b border-white dark:border-slate-800">
          Time Table Monash
        </header>
        <nav className="bg-black text-white p-4">
          <ul className="flex space-x-4">
            <li><Link to="/Home" className="hover:text-gray-400 bg-blue-500 text-white hover:bg-blue-600 p-4"><FontAwesomeIcon icon={faUser} /></Link></li>
            <li><a href="http://localhost:3000/Home" className="hover:text-gray-400">Home</a></li>
            <li><a href="http://localhost:3000/Create" className="hover:text-gray-400">Create Unit</a></li>
            <li><a href="http://localhost:3000/Select" className="hover:text-gray-400">Timeslot allocation</a></li>
            <li className="ml-auto"><a href="http://localhost:3000/" className="hover:text-gray-400">Log Out</a></li>
          </ul>
        </nav>
      </div>

      <div className="m-4">
        <h2 className="text-2xl font-bold mb-4">User Details</h2>
        {userDetails ? (
          <div>
            <table className="table-auto w-full">
              <tbody>
                <tr>
                  <td className="font-semibold">Name:</td>
                  <td>{userDetails.displayName}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Email:</td>
                  <td>{userDetails.email}</td>
                </tr>
                <tr>
                  <td className="font-semibold">Id:</td>
                  <td>{userDetails.userId}</td>
                </tr>
                {userDetails.slots && userDetails.slots.length > 0 && (
                  <tr>
                    <td className="font-semibold">Class Slots:</td>
                    <td>
                      <ul>
                        {userDetails.slots.map((slot, index) => (
                          <li key={index}>{slot.unit} - {slot.timeSlot}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
