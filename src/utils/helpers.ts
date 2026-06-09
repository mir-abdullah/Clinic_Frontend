import { Appointment } from "./type";

export const getUpcomingAppointment = (appointments: Appointment[]) => {
  const now = new Date();

  const futureAppointments = appointments
    .map((appt) => {
      // Combine date + time into a single Date object
      const appointmentDateTime = new Date(appt.date);

      if (appt.time) {
        const [hours, minutes] = appt.time.split(":").map(Number);

        appointmentDateTime.setHours(hours);
        appointmentDateTime.setMinutes(minutes);
        appointmentDateTime.setSeconds(0);
        appointmentDateTime.setMilliseconds(0);
      }

      return {
        ...appt,
        appointmentDateTime,
      };
    })
    .filter((appt) => appt.appointmentDateTime >= now)
    .sort(
      (a, b) =>
        a.appointmentDateTime.getTime() -
        b.appointmentDateTime.getTime()
    );

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
  