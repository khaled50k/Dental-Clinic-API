const Appointment = require("../models/Appointment");
const { appointmentSchema } = require("../validation/appointmentValidation");
const getAvailableHoursForDate = async (dentistId, appointmentDateTime) => {
  try {
    const selectedDate = new Date(
      new Date(appointmentDateTime)
        .toISOString()
        .split("T")[0]
        .replace(/-/g, "/")
    );
    const date = selectedDate;

    const hours = [];
    const year = date.getFullYear();
    const month = date.getMonth(); // Month is 0-based, no need to add 1
    const day = date.getDate();

    // Create an array of Date objects for the hours you want to check
    for (let hour = 13; hour <= 22; hour++) {
      for (let minute = 0; minute <= 60; minute += 15) {
        hours.push(new Date(year, month, day, hour, minute));
      }
    }

    const dentistAppointments = await Appointment.find({
      dentist: dentistId,
      appointmentDateTime: {
        $gte: selectedDate,
        $lt: new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    const availableHours = [];

    for (let i = 0; i < hours.length; i++) {
      const currentHour = hours[i];

      const isBooked = dentistAppointments.some((appointment) => {
        const appointmentStart = appointment.appointmentDateTime;
        const appointmentEnd = new Date(
          appointmentStart.getTime() + appointment.durationMinutes * 60000
        );

        return currentHour >= appointmentStart && currentHour < appointmentEnd;
      });

      // Check if the time is booked, but is marked as cancelled
      const isCancelled = dentistAppointments.some((appointment) => {
        const appointmentStart = appointment.appointmentDateTime;
        const appointmentEnd = new Date(
          appointmentStart.getTime() + appointment.durationMinutes * 60000
        );

        return (
          currentHour >= appointmentStart &&
          currentHour < appointmentEnd &&
          appointment.status === "Canceled"
        );
      });

      if (!isBooked && !isCancelled) {
        let rangeStart = currentHour;
        let rangeEnd = currentHour;

        while (i < hours.length - 1) {
          const nextHour = hours[i + 1];

          if (
            !dentistAppointments.some((appointment) => {
              const appointmentStart = appointment.appointmentDateTime;
              const appointmentEnd = new Date(
                appointmentStart.getTime() + appointment.durationMinutes * 60000
              );

              return nextHour > appointmentStart && nextHour < appointmentEnd;
            })
          ) {
            rangeEnd = nextHour;
            i++;
          } else {
            break;
          }
        }

        availableHours.push({
          from: rangeStart.toISOString(),
          to: rangeEnd.toISOString(),
        });
      }
    }

    return availableHours;
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error.");
  }
};

// Create a new appointment
exports.createAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    const { durationMinutes, appointmentDateTime, dentist } = value;
    if (error) {
      return res.status(400).json({ error: error.details });
    }
    // Call getAvailableHoursForDate function to check availability
    const availableHours = await getAvailableHoursForDate(
      dentist,
      appointmentDateTime
    );
    // Check if the desired appointment time is available
    const isAppointmentAvailable = availableHours.some((timeSlot) => {
      const slotStart = new Date(timeSlot.from);
      const slotEnd = new Date(timeSlot.to);
      const appointmentStart = appointmentDateTime;
      const appointmentEnd = new Date(
        appointmentStart.getTime() + durationMinutes * 60000
      );

      return (
        appointmentStart.getTime() >= slotStart.getTime() &&
        appointmentEnd.getTime() <= slotEnd.getTime()
      );
    });

    if (!isAppointmentAvailable) {
      return res
        .status(400)
        .json({ error: "Appointment slot is not available." });
    }
    // Calculate the end time based on the duration
    const appointmentEnd = new Date(appointmentDateTime);
    appointmentEnd.setMinutes(appointmentEnd.getMinutes() + durationMinutes);

    const appointment = new Appointment({
      ...value,
      appointmentEnd, // Include the appointmentEnd in the document
    });
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
        // .populate("patient dentist")
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

// Update an existing appointment by ID, checking availability if necessary
exports.updateAppointment = async (req, res) => {
  try {
    const { error, value } = appointmentSchema.validate(req.body);
    const { durationMinutes, appointmentDateTime, dentist } = value;
    const appointmentId = req.params.id; // Assuming the appointment ID is passed in the URL

    if (error) {
      return res.status(400).json({ error: error.details });
    }

    // Find the existing appointment by ID
    const existingAppointment = await Appointment.findById(appointmentId);

    if (!existingAppointment) {
      return res.status(404).json({ error: "Appointment not found." });
    }

    // Check if durationMinutes or appointmentDateTime have changed
    const isDurationOrDateTimeChanged =
      durationMinutes !== existingAppointment.durationMinutes ||
      appointmentDateTime.toISOString() !==
        existingAppointment.appointmentDateTime.toISOString();

    if (
      isDurationOrDateTimeChanged &&
      appointmentId !== existingAppointment._id.toString()
    ) {
      return res.status(400).json({
        error: "Changing appointment date and time is not allowed.",
      });
    }

    // Call getAvailableHoursForDate function to check availability
    const availableHours = await getAvailableHoursForDate(
      dentist,
      appointmentDateTime
    );

    // Check if the desired appointment time is available
    const isAppointmentAvailable = availableHours.some((timeSlot) => {
      const slotStart = new Date(timeSlot.from);
      const slotEnd = new Date(timeSlot.to);
      const appointmentStart = appointmentDateTime;
      const appointmentEnd = new Date(
        appointmentStart.getTime() + durationMinutes * 60000
      );

      // Skip availability check for the same appointment
      if (
        appointmentId === existingAppointment._id.toString() &&
        appointmentStart.getTime() ===
          existingAppointment.appointmentDateTime.getTime() &&
        durationMinutes === existingAppointment.durationMinutes
      ) {
        return true;
      }

      return (
        appointmentStart.getTime() >= slotStart.getTime() &&
        appointmentEnd.getTime() <= slotEnd.getTime()
      );
    });

    if (!isAppointmentAvailable) {
      return res
        .status(400)
        .json({ error: "Appointment slot is not available." });
    }

    // Update the appointment data
    existingAppointment.set({
      ...value,
    });

    // Save the updated appointment to the database
    const updatedAppointment = await existingAppointment.save();

    res.json({
      message: "Appointment updated successfully.",
      appointment: updatedAppointment,
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

// Controller to get all appointments for a specific date
exports.suggestAppointments = async (req, res) => {
  try {
    const { dentistId, appointmentDateTime } = req.params; // Assuming you pass dentistId and appointmentDateTime as parameters

    const availableHours = await getAvailableHoursForDate(
      dentistId,
      appointmentDateTime
    );
    res.status(200).json(availableHours);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error." });
  }
};
