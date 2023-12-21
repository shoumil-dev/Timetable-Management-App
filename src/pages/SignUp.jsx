import { auth } from "../firebase-handler";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, collection } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import { db } from "../firebase-handler";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(""); // Add status state for admin/lecturer/student
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const userId = userCredential.user.uid;

      const usersRef = collection(db, "users");
      await setDoc(doc(usersRef, userId), {
        userId,
        email,
        status,
        slots: [],
      });

      // Display a toast notification
      toast.success("User successfully registered!", {
        position: "top-center",
        autoClose: 10000, // Close after 3000 milliseconds (3 seconds)
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Navigate to the sign-in page
      navigate("/");
    } catch (error) {
      console.error("Sign-up error:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center my-52 px-6 py-12 lg:px-8 font-mono">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-6xl font-bold leading-9 tracking-tight text-gray-900 my-12">
          Sign Up
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={signUp}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500">{error}</div>
          )}

<div>
          <label
            htmlFor="status"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            User Status
          </label>
          <div className="mt-2">
            <select
              id="status"
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="block w-full rounded-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-gray-900 sm:text-sm sm:leading-6"
            >
              <option value="">Select status</option>
              <option value="lecturer">Lecturer</option>
              <option value="student">Student</option>
            </select>
          </div>
        </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="flex w-2/5 justify-center rounded-full bg-gray-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-neutral-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
            >
              Sign Up
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
      <div className="text-sm text-center mt-4">
        <span>Already have an account?</span>{" "}
        <Link to="/">Sign In</Link>
      </div>
    </div>
  );
};

export default SignUp;
