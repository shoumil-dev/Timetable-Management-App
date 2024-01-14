// SignIn.jsx
import { auth } from "../firebase-handler";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setDoc, doc, getDoc, collection } from "firebase/firestore";
import { db } from "../firebase-handler";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const signIn = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const userId = userCredential.user.uid;
        console.log("userId:", userId);
        const userRef = doc(db, "users", userId);

        getDoc(userRef).then((docSnapShot) => {
          if (docSnapShot.exists()) {
            console.log("User already exists:", userId);
            navigate("/home");
          } else {
            const usersRef = collection(db, "users");
            setDoc(doc(usersRef, userId), {
              userId,
              email,
              slots: [],
              notification: [],
            });
            console.log("Logged in Successfully");
            navigate("/home");
          }
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <html className="dark:bg-zinc-900 h-screen">
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 font-mono">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-6xl font-bold leading-9 tracking-tight text-zinc-900 dark:text-white my-12">
            Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form
            className="space-y-6"
            action="#"
            method="POST"
            onSubmit={signIn}
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white"
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
                  className="block w-full rounded-full border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6 
                  dark:text-white dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-zinc-900 dark:text-white"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-zinc-900 hover:text-zinc-500 dark:text-white dark:hover:text-zinc-300"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-full border-0 py-1.5 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-zinc-900 sm:text-sm sm:leading-6
                  dark:text-white dark:bg-zinc-900 dark:focus:ring-zinc-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="flex w-2/5 justify-center rounded-full bg-zinc-900 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-zinc-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900
                dark:bg-zinc-700 dark:focus-visible:outline-zinc-50 transition duration-300"
              >
                Sign in
              </button>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <a
                  href="http://localhost:3000/signup"
                  className="font-semibold text-zinc-900 hover:text-zinc-500 underline dark:text-white dark:hover:text-zinc-300"
                >
                  Create account?
                </a>
              </div>
            </div>
          </form>
        </div>
      </div>
    </html>
  );
};
export default SignIn;
