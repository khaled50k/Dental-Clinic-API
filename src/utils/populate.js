// utils/populateUtils.js

// Function to get patient data without sensitive information
const getPatientWithoutSensitiveData = (patient) => {
    // Implement your logic to return patient data without sensitive information
    return {
      _id: patient._id,
      name: patient.name,
      // Add any other non-sensitive fields here
    };
  };
  
  // Function to get doctor data without sensitive information
  const getDoctorWithoutSensitiveData = (doctor) => {
    // Implement your logic to return doctor data without sensitive information
    return {
      _id: doctor._id,
      name: doctor.name,
      // Add any other non-sensitive fields here
    };
  };
  
  module.exports = {
    getPatientWithoutSensitiveData,
    getDoctorWithoutSensitiveData,
  };
  