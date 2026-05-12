import { Appointment } from "./data";

  export const getUpcomingAppointment = (appointments: Appointment[]) => {
    const today = new Date();

    // Convert appointmentDate to Date and filter only future ones
    const futureAppointments = appointments
      .map((appt) => ({
        ...appt,
        appointmentDate: new Date(appt.appointmentDate), // ensure Date object
      }))
      .filter((appt) => appt.appointmentDate >= today) // only future or today
      .sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime()); // sort ascending

    return futureAppointments.length > 0 ? futureAppointments[0] : null;
  };