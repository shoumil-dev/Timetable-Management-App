# Timetable Management App Handover Documentation

## Overview and Purpose
The Timetable Management App is a web-based application developed with inspiration from Monash University's Allocate+ system. Its purpose is to provide an efficient and user-friendly platform for managing schedules and timetables.

## Software and Hardware Requirements

### Prerequisites
- Node.js (latest version)
- Firebase libraries
- Web browser (compatible with the latest web standards)

### Installation and Instructions to Run

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

### Configuration

1. Firebase Credentials:
   - Open `firebase-handler.js` and update the Firebase credentials. The current credentials are already linked to the Firebase project. Change it only if you're migrating to another Firebase project.

2. Additional Configuration:
   - Tailwind has already been preconfigured and doesn't require any further configuration as of now. If required, you can modify the `tailwind.config.js` file in the root directory.

### Firestore Filesystem Structure
We use Firebase's Firestore database for storage, reading and writing of data. However, to access and interact with this database, some knowledge of the filesystem structure is required beforehand.

### Deployment
Provide instructions on deploying the application in a production environment, including steps for configuring a production build and setting up a production database.

### Testing
Explain how to run tests for the application, including details on testing frameworks and sample test cases.

### Troubleshooting
- Dependency Errors in React: A common issue during development is that developers forget to `npm install` before running the application and after pulling.

### Contribution Guidelines
Encourage contributions by providing guidelines on coding standards, submitting pull requests, and reporting issues.

### Security Considerations
For security, we rely on Google's Firebase encryption. The only way to gain access to the database is to access it using a developer's Google account. However, all Google accounts come with two-factor authentication now, making unauthorised access extremely difficult.

### Future Roadmap
Share plans for future development, upcoming features, improvements, or known limitations to be addressed in future releases.

### Licensing
The Timetable Management App is distributed under the MIT license. Refer to the LICENSE file for details.

### Contact Information
For inquiries or support, contact the original project team:
- [Mikhail](mailto:mhar0027@student.monash.edu)
- [Shoumil](mailto:sguh0003@student.monash.edu)
- [En Xin](mailto:ewon0024@student.monash.edu)
- [Khoa](mailto:angu0093@student.monash.edu)
