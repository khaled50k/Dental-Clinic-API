const Appointment = require("../models/Appointment");
const { appointmentSchema } = require("../validation/appointmentValidation");

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    const { durationMinutes, appointmentDateTime, dentist } = value; // Correct the typo here, it should be "value"
    if (error) {
      return res.status(400).json({ error: error.details });
    }
    // Calculate the end time based on the duration
    const appointmentEnd = new Date(appointmentDateTime);
    appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMinutes);

    // Check if there's an overlapping appointment for the same dentist
    const existingAppointment = await Appointment.findOne({
      dentist,
      $or: [
        {
          appointmentDateTime: {
            $lte: appointmentDateTime,
            $gte: appointmentEnd,
          },
        },
        {
          appointmentEnd: { $lte: appointmentDateTime, $gte: appointmentEnd },
        },
      ],
    });

    if (existingAppointment && existingAppointment.status == "Scheduled") {
      return res
        .status(400)
        .json({ error: "Appointment slot is already booked." });
    }

    const appointment = new Appointment(value);

    await appointment.save();

    res
      .status(201)
      .json({ message: "Appointment created successfully.", appointment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Get appointments based on ID or pagination
exports.getAppointments = async (req, res) => {
  try {
    const idOrPage = req.params.idOrPage ?? 1;

    // Check if idOrPage is a number (page) or not (id)
    if (!isNaN(idOrPage)) {
      // It's a page number, handle pagination logic here
      const page = parseInt(idOrPage);

      // Validate that the page is at least 1
      if (page < 1) {
        return res.status(400).json({ error: "Page must be at least 1." });
      }
      // Your pagination logic goes here
      // Example: Fetch the 10 appointments for the specified page
      const appointmentsPerPage = 10;
      const skip = (page - 1) * appointmentsPerPage;
      const appointments = await Appointment.find()
        .populate("patient dentist")
        .skip(skip)
        .limit(appointmentsPerPage);

      res.status(200).json(appointments);
    } else {
      // It's an ID, handle retrieving a specific appointment by ID here
      const appointment = await Appointment.findById(idOrPage).populate(
        "patient dentist"
      );
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found." });
      }
      res.status(200).json(appointment);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Update an appointment by ID
exports.updateAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      value,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({
      message: "Appointment updated successfully.",
      updatedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete an appointment by ID
exports.deleteAppointment = async (req, res) => {
  try {
    const deletedAppointment = await Appointment.findByIdAndRemove(
      req.params.id
    );

    if (!deletedAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    res.status(200).json({
      message: "Appointment deleted successfully.",
      deletedAppointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Additional controller for appointment suggestions
exports.suggestAppointments = async (req, res) => {
  try {
    const { dentistId } = req.params; // Assuming you pass the dentistId as a parameter

    // Get all appointments for the specified dentist
    const dentistAppointments = await Appointment.find({ dentist: dentistId });

    // Define a range of time for which you want to suggest appointments
    // For example, suggesting appointments for the next 7 days
    const currentDate = new Date();
    const endDate = new Date();
    endDate.setDate(currentDate.getDate() + 7);

    // Create an object to store available dates and hours
    const availableDatesAndHours = {};

    // Iterate over the date range and check availability
    let currentDateIter = new Date(currentDate);
    while (currentDateIter <= endDate) {
      const dateKey = currentDateIter.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

      // Initialize available hours for this date
      const availableHours = [];

      // Iterate over hours and 15-minute intervals (e.g., from 9:00 AM to 5:00 PM)
      for (let hour = 9; hour <= 20; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const appointmentStart = new Date(
            dateKey + "T" + hour + ":" + minute + ":00.000Z"
          );
          const appointmentEnd = new Date(
            dateKey + "T" + hour + ":" + (minute + 15) + ":00.000Z"
          );

          const isAvailable = !dentistAppointments.some((appointment) => {
            // Check if the current time slot falls within any existing appointment
            return (
              appointment.status === "Scheduled" &&
              appointmentStart >= appointment.appointmentDateTime &&
              appointmentStart <
                new Date(
                  appointment.appointmentDateTime.getTime() +
                    appointment.durationMinutes * 60000
                ) &&
              appointmentEnd > appointment.appointmentDateTime &&
              appointmentEnd <=
                new Date(
                  appointment.appointmentDateTime.getTime() +
                    appointment.durationMinutes * 60000
                )
            );
          });

          if (isAvailable) {
            availableHours.push(hour + ":" + (minute < 10 ? "0" : "") + minute);
          }
        }
      }

      if (availableHours.length > 0) {
        availableDatesAndHours[dateKey] = availableHours;
      }

      // Move to the next day
      currentDateIter.setDate(currentDateIter.getDate() + 1);
    }

    res.status(200).json(availableDatesAndHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Controller to get available hours for a specific date
exports.getAvailableHoursForDate = async (req, res) => {
  try {
    const { dentistId, appointmentDateTime } = req.params; // Assuming you pass dentistId, year, month, and day as parameters

    // Create a JavaScript Date object for the specified date
    const selectedDate = new Date(appointmentDateTime);

    // Get all appointments for the specified dentist on the selected date
    const dentistAppointments = await Appointment.find({
      dentist: dentistId,
      appointmentDateTime: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000), // Add 24 hours to selectedDate
      },
    });

    // Define available hours (e.g., from 9:00 AM to 4:00 PM)
    const availableHours = {};
    let currentDateIter = new Date(selectedDate);
    const dateKey = currentDateIter.toISOString().split("T")[0]; // Format date as YYYY-MM-DD

    // Iterate over hours and 15-minute intervals (e.g., from 9:00 AM to 5:00 PM)
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const appointmentStart = new Date(
          dateKey + "T" + hour + ":" + minute + ":00.000Z"
        );
        const appointmentEnd = new Date(
          dateKey + "T" + hour + ":" + (minute + 15) + ":00.000Z"
        );

        const isAvailable = !dentistAppointments.some((appointment) => {
          // Check if the current time slot falls within any existing appointment
          return (
            appointment.status === "Scheduled" &&
            appointmentStart >= appointment.appointmentDateTime &&
            appointmentStart <
              new Date(
                appointment.appointmentDateTime.getTime() +
                  appointment.durationMinutes * 60000
              ) &&
            appointmentEnd > appointment.appointmentDateTime &&
            appointmentEnd <=
              new Date(
                appointment.appointmentDateTime.getTime() +
                  appointment.durationMinutes * 60000
              )
          );
        });

        if (isAvailable) {
          const timeString = hour + ":" + (minute < 10 ? "0" : "") + minute;
          if (!availableHours[selectedDate.toISOString()]) {
            availableHours[selectedDate.toISOString()] = [];
          }
          availableHours[selectedDate.toISOString()].push(timeString);
        }
      }
    }

    res.status(200).json(availableHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};