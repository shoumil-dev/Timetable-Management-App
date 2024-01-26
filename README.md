# Timetable Management App Handover Documentation 📅
This document helps with the handover of the application development resources from the development team to the maintenance team.
## Overview and Purpose
The Timetable Management App is a web-based application developed with inspiration from Monash University's Allocate+ system. Its purpose is to provide an efficient and user-friendly platform for managing schedules and timetables.

## Software and Hardware Requirements 🖥️
Any computer that was made in the last 10 years should be able to run this application. Since it is a web app, it is compatible with any modern browser running on any operating system.

### Prerequisites
- Node.js (latest version)
- Firebase libraries
- Web browser (compatible with the latest web standards)

### Installation and Instructions to Run 🚀

1. Clone the Repository:
   ```bash
   git clone <repository-link>
   ```

2. Install Dependencies:
   ```bash
   npm install
   ```

3. Run the Application:
   ```bash
   npm run start
   ```

   The application will be accessible at [http://localhost:3000](http://localhost:3000) in your browser.

### Configuration ⚙️

1. Firebase Credentials:
   - Open `firebase-handler.js` and update the Firebase credentials. The current credentials are already linked to the Firebase project. Change it only if you're migrating to another Firebase project.

2. Additional Configuration:
   - Tailwind has already been preconfigured and doesn't require any further configuration as of now. If required, you can modify the `tailwind.config.js` file in the root directory.

### Firestore Filesystem Structure 🗃️
We use Firebase's Firestore database for storage, reading and writing of data. However, to access and interact with this database, some knowledge of the filesystem structure is required beforehand.

Each unit is stored in the **units** *collection* as a *document*. Inside each unit, there are two *fields*. These are the **timeslot** array and the **title**.

The **timeslot** array has a very specific format. It is in the form of: `<day> <typeofclass> <starttime>-<endtime>`. 

So, for example, a slot would be:
> Monday Forum 12:00-15:00

Note that the time should be in the 24h format.

On the other hand, each user is stored in the **users** *collection*. Each user has a number of fields. These are **email**, **name**, **role**, **userId** and the **slots** and **notifications** arrays.

Each entry in the **slots** array has a **timeSlot**, **location**, **notification** array and a **unit** name.

Therefore, the structure of the firestore filesystem is as follows.

> - units
>    - unit (stored as an id)
>       - timeslot (array)
>       - title
> - users
>    - user (stored as an id)
>       - email
>       - name
>       - role
>       - slots (array)
>          - slot (as an index)
>             - location
>             - timeslot
>             - unit
>       - notifications (array)
>       - userId
> - slots
>    - slot (stored as an id)
>       - location
>       - notification (array)
>       - timeSlot
>       - unit

**Note: The userIDs are auto-generated.**

### Testing 🧪
To test the web application, you can use testing frameworks like Jest and the React Testing Library. You can then run `npm test` to execute tests. Currently, there are no tests written. Everything has been tested manually.

### Troubleshooting ⚠️
Dependency Errors in React: A common issue during development is that developers forget to `npm install` before running the application and after pulling.

### Security Considerations 🔐
For security, we rely on Google's Firebase encryption. The only way to gain access to the database is to access it using a developer's Google account. However, all Google accounts come with two-factor authentication now, making unauthorised access extremely difficult.

### Future Roadmap 🚀
Share plans for future development, upcoming features, improvements, or known limitations to be addressed in future releases.

For future releases, our roadmap suggests implementing the following features:
- Profile pictures for users 📸
- Sounds when interacting with elements 🔊

### Licensing 📄
The Timetable Management App is distributed under the MIT license. Refer to the LICENSE file for details.

### Contact Information 📧
For inquiries or support, contact the original project team:
- [Mikhail - mhar0027@student.monash.edu](mailto:mhar0027@student.monash.edu)
- [En Xin - ewon0024@student.monash.edu](mailto:ewon0024@student.monash.edu)
- [Khoa - angu0093@student.monash.edu](mailto:angu0093@student.monash.edu)
- [Shoumil - sguh0003@student.monash.edu](mailto:sguh0003@student.monash.edu)

