# Timetable Management App
This application is a web based timetable management application built with Monash University's Allocate+ system as reference.

## Software and Hardware Requirements

No specific hardware is required to run this application.

For development, you need to have the latest version of node installed. Additionally you need to install the firebase libraries.

Any IDE is fine, but we recommend VSCode as it was used to develop this application.

### Installation and Instructions to Run

Copy the http link from the repository and run `git clone <link>` inside your chosen directory.

Run `npm install` to install all necessary libraries and dependencies. You could also create an environment and do the same.

Run `npm run start` to start the application with your development device as a local host.

The app opens in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Notes

The file `App.js` is the heart of the application and contains routes to all pages of the application.

The file `firebase-handler.js` contains all the credentials for the firebase project.

### Tech Stack

Node is used to run the program in development mode and package management.

React is used for the framework of the application.

Tailwind is is the frontend library used.

Firebase is used for the database.

