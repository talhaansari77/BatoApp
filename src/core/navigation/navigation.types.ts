
export type RootStackParamList = {
  Auth: undefined;
  PatientApp: undefined;
  DoctorApp: undefined;
  AdminApp: undefined;
  ReportsApp: undefined;
};
// src/core/navigation/navigation.types.ts

export type AuthStackParamList = {
  Splash: undefined;
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  OtpVerification: {
    phone?: string;
    email?: string;
  } | undefined;
  ForgotPassword: undefined;
  RoleSelection: undefined;
};

export type PatientTabParamList = {
  PatientHome: undefined;
  PatientServices: undefined;
  PatientAppointments: undefined;
  PatientProgress: undefined;
  PatientProfile: undefined;
};

export type DoctorTabParamList = {
  DoctorDashboard: undefined;
  DoctorAppointments: undefined;
  DoctorPatients: undefined;
  DoctorMessages: undefined;
  DoctorProfile: undefined;
};

export type AdminTabParamList = {
  AdminDashboard: undefined;
  AdminAppointments: undefined;
  AdminPatients: undefined;
  AdminDoctors: undefined;
  AdminMore: undefined;
};

export type AdminStackParamList = {
  AdminTabs: undefined;
  AdminServices: undefined;
  AdminReports: undefined;
  AdminPayments: undefined;
  AdminPromotions: undefined;
  AdminBranches: undefined;
  AdminSettings: undefined;
  AdminStaffPermissions: undefined;
  AdminNotifications: undefined;
  AdminAuditLogs: undefined;
};

export type PatientStackParamList = {
  PatientTabs: undefined;
  ServiceDetails: undefined;
  DoctorProfile: undefined;
  BookingBranch: undefined;
  BookingDateTime: undefined;
  BookingPayment: undefined;
  AppointmentConfirmation: undefined;
};

export type ReportsStackParamList = {
  MedicalReports: undefined;
  ReportDetails: {reportId:string};
};

