import { Appointment, Visit } from "./type";

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
        a.appointmentDateTime.getTime() - b.appointmentDateTime.getTime(),
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

export const formatDateWithOrdinal = (
  value: Date | string | null | undefined,
) => {
  if (!value) return "";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "Invalid date";
  const day = d.getDate();
  const month = d.toLocaleString(undefined, { month: "long" });
  const year = d.getFullYear();
  return `${day}${getOrdinal(day)} ${month} ${year}`;
};

export const sendReceipt = (visit: Visit) => {
  if (!visit) {
    alert("No visit found to send receipt.");
    return;
  }

  const formatPhoneForWhatsApp = (rawPhone: string | null | undefined) => {
    let digits = (rawPhone || "").replace(/\D/g, "");
    if (digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }
    return digits;
  };

  const phone = formatPhoneForWhatsApp(visit?.patient?.phone);

  if (!phone || phone.length < 11) {
    alert("Patient phone number is missing or invalid.");
    return;
  }

  const formatMoney = (amount: number | null | undefined) =>
    `Rs. ${Number(amount || 0).toLocaleString()}`;

  const credit = visit?.paidAmount || 0;
  const balance = visit?.dueAmount || 0;

  let paymentLines = `💵 Total Bill: *${formatMoney(visit?.totalAmount)}*`;

  if (credit > 0) {
    paymentLines += `\n💳 Paid: ${formatMoney(credit)}`;
  }

  if (balance > 0) {
    paymentLines += `\n📌 Balance Due: *${formatMoney(balance)}*`;
  } else {
    paymentLines += `\n✅ _Fully Paid_`;
  }

  // Conditionally build clinical section — only included if present
  let clinicalLines = "";
  if (visit?.diagnosis) {
    clinicalLines += `\n🩺 Diagnosis: ${visit.diagnosis}`;
  }
  if (visit?.prescription) {
    clinicalLines += `\n💊 Prescription: ${visit.prescription}`;
  }

  const message = `🦷 *MEHREEN DENTAL CLINIC* 🦷
_Visit Receipt_

👤 Patient: *${visit?.patient?.name}*
📞 Contact: ${visit?.patient?.phone}
👨‍⚕️ Doctor: ${visit?.doctorName}

📅 Date: ${formatDateWithOrdinal(visit?.date)}
⏰ Time: ${visit?.time}
💼 Service: ${visit?.reason || "General Checkup"}${clinicalLines}

${paymentLines}

✨ Thank you for visiting *Mehreen Dental Clinic*.
We look forward to your next visit! 🦷`;



  // const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};


type AppointmentReminderPayload = {
  date: string;
  time: string;
  doctorName?: string | null;
  reason?: string | null;
  patient: {
    name: string;
    phone?: string | null;
  };
};

//appointment reminder:
 export const sendAppointmentReminder = (appointment: AppointmentReminderPayload) => {
  if (!appointment ) {
    alert("Invalid appointment data.");
    return;
  }

  const formatPhoneForWhatsApp = (rawPhone: string | null | undefined = "") => {
    let digits = (rawPhone || "").replace(/\D/g, "");

    // Convert Pakistani numbers (03xxxxxxxxx -> 923xxxxxxxxx)
    if (digits.startsWith("0")) {
      digits = "92" + digits.slice(1);
    }

    return digits;
  };

  const phone = formatPhoneForWhatsApp(appointment.patient.phone);

  if (!phone) {
    alert("Invalid patient phone number.");
    return;
  }

  const formattedDate = new Date(appointment.date).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const message = `🦷 *MEHREEN DENTAL CLINIC*
_Appointment Reminder_

Dear *${appointment.patient.name}*,

This is a friendly reminder of your upcoming appointment.

👨‍⚕️ *Doctor:* ${appointment.doctorName || "Dentist"}
📅 *Date:* ${formattedDate}
⏰ *Time:* ${appointment.time}
🦷 *Reason:* ${appointment.reason || "Dental Consultation"}

📍 *Location:*
Chaudhry Bostan Khan Rd, above Allied Bank, Gulrez Housing Scheme, Rawalpindi, Punjab 46000

🕒 Please arrive *10 minutes early* to complete any necessary formalities.

If you need to reschedule or cancel your appointment, please let us know in advance.

Thank you for choosing *Mehreen Dental Clinic*.
We look forward to seeing you! 😊`;

  // New WhatsApp URL
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(
    message
  )}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
};