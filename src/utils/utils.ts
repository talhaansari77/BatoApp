import { useAppTheme } from "@/app/providers/ThemeProvider";

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


export function getStatusColors(
  status?: string,
  themeColors?: ReturnType<typeof useAppTheme>["colors"],
) {
  const s = status?.toLowerCase();
  if (s === "completed" || s === "done") {
    return {
      text: themeColors?.successText ?? "#356B4A",
      bg: themeColors?.success ?? "#E4F3EA",
    };
  }
  if (s === "pending" || s === "waiting") {
    return {
      text: themeColors?.warningText ?? "#8A6500",
      bg: themeColors?.warning ?? "#FFF0CC",
    };
  }
  if (s === "cancelled" || s === "rejected") {
    return {
      text: themeColors?.errorText ?? "#9B3D3D",
      bg: themeColors?.error ?? "#F8E2E2",
    };
  }
  if (s === "upcoming" || s === "scheduled"|| s === "active" || s === "confirmed") {
    return {
      text: themeColors?.infoText ?? "#3F6178",
      bg: themeColors?.info ?? "#E5EEF5",
    };
  }
  return {
    text: themeColors?.textMuted ?? "#707070",
    bg: themeColors?.cardMuted ?? "#F5F5F5",
  };
}

export function getFirstName(fullName:string) {
  // Trim extra spaces and split the string by spaces
  const parts = fullName.trim().split(' ');
  
  // Return the first part, or an empty string if nothing was provided
  return parts[0] || '';
}