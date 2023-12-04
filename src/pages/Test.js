import React, {useRef, useState} from "react";
import {db} from "../firebase-handler";
import { addDoc, collection } from "firebase/firestore";

export default function Test() {
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
    <div>
      <form onSubmit={handleSave}>
        <label>Enter a Name</label>
        <input type="text" ref={nameRef} />
        <button type="submit">Save</button>
      </form>
    </div>
  )
}
