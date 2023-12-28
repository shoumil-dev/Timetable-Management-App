import React, {useRef} from "react";
import {db} from "../firebase-handler";
import { addDoc, collection } from "firebase/firestore";

const Test = () => {
  const nameRef = useRef();
  const ref = collection(db, "Names");

  const handleSave = async (e) => {
    e.preventDefault();
    console.log(nameRef.current.value); 

    let data = {
      message: nameRef.current.value,
    };

    addDoc(ref, data);
  };
  
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
      <form onSubmit={handleSave}>
        <label>Enter a Name</label>
        <input type="text" ref={nameRef} />
        <button type="submit">Save</button>
      </form>
      
    </div>
  );
};

export default Test;
