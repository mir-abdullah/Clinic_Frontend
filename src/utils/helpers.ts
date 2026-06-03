import { Appointment } from "./type";

  export const getUpcomingAppointment = (appointments: Appointment[]) => {
    const today = new Date();

    // Convert appointmentDate to Date and filter only future ones
    const futureAppointments = appointments
      .map((appt) => ({
        ...appt,
        appointmentDate: new Date(appt.date), // ensure Date object
      }))
      .filter((appt) => appt.appointmentDate >= today) // only future or today
      .sort((a, b) => a.appointmentDate.getTime() - b.appointmentDate.getTime()); // sort ascending

    return futureAppointments.length > 0 ? futureAppointments[0] : null;
  };

      const getOrdinal = (n: number) => {
          const s = n % 100;
          if (s >= 11 && s <= 13) return "th";
          switch (n % 10) {
              case 1:
                  return "st";
              case 2:
                  return "nd";
              case 3:
                  return "rd";
              default:
                  return "th";
          }
      };
  
    export   const formatDateWithOrdinal = (value: Date | string | null | undefined) => {
          if (!value) return "";
          const d = typeof value === "string" ? new Date(value) : value;
          if (Number.isNaN(d.getTime())) return "Invalid date";
          const day = d.getDate();
          const month = d.toLocaleString(undefined, { month: "long" });
          const year = d.getFullYear();
          return `${day}${getOrdinal(day)} ${month} ${year}`;
      };
  