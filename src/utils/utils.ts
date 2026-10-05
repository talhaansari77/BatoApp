type Appointment = {
  current_status?: string;
  payment_status?: string;
  [key: string]: any;
};

export function getAppointmentCounts(appointments: Appointment[] = []) {
  if (!Array.isArray(appointments)) {
    return { upcomingCount: 0, pendingCount: 0 };
  }

  return appointments.reduce(
    (acc, item) => {
      const status = item.current_status?.toLowerCase();
      const paymentStatus = item.payment_status?.toLowerCase();

      // Check for Upcoming
      if (status === "upcoming" || status === "scheduled" || status === "confirmed") {
        acc.upcomingCount += 1;
      }

      // Check for Pending (either by appointment status or payment status)
      if (status === "pending" || paymentStatus === "pending") {
        acc.pendingCount += 1;
      }

      return acc;
    },
    { upcomingCount: 0, pendingCount: 0 }
  );
}