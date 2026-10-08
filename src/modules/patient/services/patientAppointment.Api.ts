import { apiClient } from "../../../core/api/apiClient";


// {{base_url}}/appointment/patient/:patientId?status=&limit=50&offset=0


export type Appointment = {
  id: number;
  patient_id: number;
  [key: string]: any;
};




export const patientApi = {
  async getPatientAppointments(patientId: number = 12290) {
    const response = await apiClient.get<Appointment>(
      `/appointment/patient/${patientId}?status=&limit=50&offset=0`
    );
    // console.log(response.data?.data)
    return response.data.data;
  },


  async patientProfile() {
    const response = await apiClient.get<Appointment>("/patient/profile");
    return response.data;
  },
  async getMedicalReports(range: string = "all", search: string = "") {
    const response = await apiClient.get<Appointment>(`/patient/reports?range=${range}&search=${search}`);
    return response.data;
  },

};
