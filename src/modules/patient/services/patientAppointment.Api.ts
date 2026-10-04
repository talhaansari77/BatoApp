import { apiClient } from "../../../core/api/apiClient";
import { tokenStorage } from "../../../core/storage/tokenStorage";

export type UserRole = "Patient" | "Doctor" | "Admin";
type Gender = "male" | "female";
// {{base_url}}/appointment/patient/:patientId?status=&limit=50&offset=0


export type Appointment = {
  id: number;
  patient_id: number;
};




export const patientApi = {
  async getPatientAppointments() {
    const response = await apiClient.get<any>(
      "/appointment/patient/12290?status=&limit=50&offset=0"
    );
    // console.log(response.data?.data)
    return response.data.data;
  },


  async patientProfile() {
    const response = await apiClient.get<Appointment>("/patient/profile");
    return response.data;
  },

};
