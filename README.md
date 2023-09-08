# Dental Clinic API

Welcome to the Dental Clinic API Documentation. This comprehensive guide provides all the necessary information about the API endpoints, requests, and responses for managing appointments, patients, prescriptions, and authentication in your dental clinic.

## Project Information

- **Name**: dental-clinic-api
- **Version**: 1.0.0
- **Author**: Khaled Walead Abu Eriban
- **License**: ISC

## Technologies and Dependencies

### Technologies

#### Node.js

- **Description**: Node.js is a server-side runtime environment for executing JavaScript code.
- **Purpose**: Node.js forms the core of the Dental Clinic API, enabling the execution of JavaScript on the server.

#### Express.js

- **Description**: Express.js is a minimal and flexible Node.js web application framework.
- **Purpose**: Express.js is used to create RESTful API endpoints, handle routing, and manage middleware.

#### MongoDB

- **Description**: MongoDB is a NoSQL database that stores data in a flexible, JSON-like format.
- **Purpose**: MongoDB serves as the database for storing patient information, appointments, prescriptions, and other relevant data.

#### Mongoose

- **Description**: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.
- **Purpose**: Mongoose provides a schema-based solution for modeling and interacting with MongoDB data. It facilitates data schema definition, database operations, and data validation.

#### Winston

- **Description**: Winston is a widely-used logging library for Node.js.
- **Purpose**: Winston is employed for logging events, errors, and operational information of the application, aiding in debugging and monitoring.

### Dependencies

- **bcrypt**: Securely hashes passwords.
- **body-parser**: Middleware for parsing JSON and URL-encoded data.
- **cors**: Middleware enabling Cross-Origin Resource Sharing.
- **dotenv**: Library for loading environment variables from a file.
- **express-session**: Middleware for managing user sessions.
- **express-validator**: Library for validating and sanitizing user input.
- **express-xss-sanitizer**: Middleware for sanitizing user input to prevent cross-site scripting (XSS) attacks.
- **joi**: Library for data validation and schema creation.
- **nodemon**: Utility for monitoring changes in the source code and automatically restarting the server during development.
- **express-mongo-sanitize**: Middleware for sanitizing MongoDB queries to prevent NoSQL injection attacks.
- **express-rate-limit**: Middleware for rate limiting requests to prevent abuse and DDoS attacks.

These technologies and dependencies collectively contribute to the development, security, and functionality of the Dental Clinic API, ensuring its smooth operation.

## Authentication

### Register

- **Route**: `/auth/register`
- **Method**: `POST`
- **Description**: Register a new user in the system.
- **Request Body**:
  - `email` (string): The user's email address.
  - `password` (string): The user's password.

### Login

- **Route**: `/auth/login`
- **Method**: `POST`
- **Description**: Authenticate a user and generate a token for further API access.
- **Request Body**:
  - `email` (string): The user's email address.
  - `password` (string): The user's password.

## Patients

### Create a New Patient

- **Route**: `/patients`
- **Method**: `POST`
- **Description**: Create a new patient record.
- **Request Body**:
  - `name` (string): The patient's name.
  - `email` (string): The patient's email address.
  - `phone` (string): The patient's phone number.
  - `address` (string): The patient's address.

### Get Patient by ID or List

- **Route**: `/patients/:idOrPage?`
- **Method**: `GET`
- **Description**: Retrieve a specific patient by ID or get a paginated list of patients.
- **Parameters**:
  - `idOrPage` (string, optional): The patient's ID or page number.

### Update a Patient

- **Route**: `/patients/:id`
- **Method**: `PUT`
- **Description**: Update a patient's information by their ID.
- **Parameters**:
  - `id` (string): The patient's ID.
- **Request Body**:
  - `name` (string, optional): The patient's name.
  - `email` (string, optional): The patient's email address.
  - `phone` (string, optional): The patient's phone number.
  - `address` (string, optional): The patient's address.

### Delete a Patient

- **Route**: `/patients/:id`
- **Method**: `DELETE`
- **Description**: Delete a patient record by their ID.
- **Parameters**:
  - `id` (string): The patient's ID.

## Prescriptions

### Create a New Prescription

- **Route**: `/prescriptions`
- **Method**: `POST`
- **Description**: Create a new prescription record.
- **Request Body**:
  - `patientId` (string): The ID of the patient associated with the prescription.
  - `dentistId` (string): The ID of the dentist who issued the prescription.
  - `medications` (array of objects): The list of medications included in the prescription.
  - `diagnosis` (string): The diagnosis or medical condition.
  - `issuedDate` (string): The date the prescription was issued.

### Get Prescriptions by ID or Pagination

- **Route**: `/prescriptions/:idOrPage?`
- **Method**: `GET`
- **Description**: Retrieve a specific prescription by ID or get a paginated list of prescriptions.
- **Parameters**:
  - `idOrPage` (string, optional): The prescription's ID or page number.

### Update a Prescription

- **Route**: `/prescriptions/:id`
- **Method**: `PUT`
- **Description**: Update a prescription by its ID.
- **Parameters**:
  - `id` (string): The prescription's ID.
- **Request Body**:
  - `medications` (array of objects, optional): The updated list of medications.
  - `diagnosis` (string, optional): The updated diagnosis or medical condition.
  - `issuedDate` (string, optional): The updated issued date.

### Delete a Prescription

- **Route**: `/prescriptions/:id`
- **Method**: `DELETE`
- **Description**: Delete a prescription record by its ID.
- **Parameters**:
  - `id` (string): The prescription's ID.

### Get Prescriptions by Patient ID

- **Route**: `/prescriptions/patient/:patientId`
- **Method**: `GET`
- **Description**: Retrieve prescriptions associated with a specific patient.
- **Parameters**:
  - `patientId` (string): The ID of the patient.

### Get Prescriptions by Dentist ID

- **Route**: `/prescriptions/dentist/:dentistId`
- **Method**: `GET`
- **Description**: Retrieve prescriptions issued by a specific dentist.
- **Parameters**:
  - `dentistId` (string): The ID of the dentist.

## Appointments

### Create a New Appointment

- **Route**: `/appointments`
- **Method**: `POST`
- **Description**: Create a new appointment for a patient.
- **Request Body**:
  - `patient` (string): The ID of the patient.
  - `dentist` (string): The ID of the dentist.
  - `appointmentDateTime` (string): The date and time of the appointment (e.g., "2023-09-09T10:00:00.000Z").
  - `durationMinutes` (number): The duration of the appointment in minutes.
  - `status` (string): The appointment status (e.g., "Scheduled").

### Get Appointments by ID or Pagination

- **Route**: `/appointments/:idOrPage?`
- **Method**: `GET`
- **Description**: Retrieve a specific appointment by ID or get a paginated list of appointments.
- **Parameters**:
  - `idOrPage` (string, optional): The appointment's ID or page number.

### Update an Appointment

- **Route**: `/appointments/:id`
- **Method**: `PUT`
- **Description**: Update an appointment by its ID.
- **Parameters**:
  - `id` (string): The appointment's ID.
- **Request Body**:
  - `patient` (string, optional): The updated patient ID.
  - `dentist` (string, optional): The updated dentist ID.
  - `appointmentDateTime` (string, optional): The updated appointment date and time.
  - `durationMinutes` (number, optional): The updated duration in minutes.
  - `status` (string, optional): The updated appointment status.

### Delete an Appointment

- **Route**: `/appointments/:id`
- **Method**: `DELETE`
- **Description**: Delete an appointment by its ID.
- **Parameters**:
  - `id` (string): The appointment's ID.

### Suggest Appointments for a Dentist

- **Route**: `/appointments/dentist/:dentistId/suggest-appointments/:appointmentDateTime`
- **Method**: `GET`
- **Description**: Get suggested appointment slots for a dentist based on a specific date and time.
- **Parameters**:
  - `dentistId` (string): The ID of the dentist.
  - `appointmentDateTime` (string): The date and time to suggest appointments for (e.g., "2023-09-09T10:00:00.000Z").

### Get Available Hours for a Date

- **Route**: `/appointments/available-hours/:dentistId/:appointmentDateTime`
- **Method**: `GET`
- **Description**: Get available appointment hours for a specific date and dentist.
- **Parameters**:
  - `dentistId` (string): The ID of the dentist.
  - `appointmentDateTime` (string): The date to check for available hours (e.g., "2023-09-09").

## Published Documentation on Postman

For detailed examples and testing the API endpoints, you can visit the following URL on Postman:

[![Postman Documentation](https://documenter.getpostman.com/view/24527103/2s9YC1VtcV)](https://documenter.getpostman.com/view/24527103/2s9YC1VtcV)

Feel free to explore and use this documentation to integrate the Dental Clinic API into your applications.
