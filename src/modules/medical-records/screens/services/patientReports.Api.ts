import { apiClient } from "../../../../core/api/apiClient";

// {{base_url}}/appointment/patient/:patientId?status=&limit=50&offset=0


// export type Report = {
//   patient:{
//     id:number,
//     full_name:string,
//     file_number:string,
//   }
//   reports:any[]
//   [key: string]: any;
// };
export type Report = {
  [key: string]: any;
};




export const patientReportsApi = {

  async getMedicalReports(range: string = "all", search: string = "") {
    const response = await apiClient.get<Report>(`/patient/reports?range=${range}&search=${search}`);
    return response?.data?.data;
  },
  async getMedicalReportDetails(report_token: string) {
    const response = await apiClient.get<Report>(`/patient/reports/${report_token}`);
    return response?.data?.data;
  },

};
