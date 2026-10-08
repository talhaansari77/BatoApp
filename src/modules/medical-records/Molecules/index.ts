// reportDetail.ts
// Builds the printable "Medical Report" HTML (matches the BATO clinic layout).
// Use the returned string in a WebView (source={{ html }}) or with expo-print.

export interface ReportTestRow {
  name: string;
  result: string;
  status?: "NORMAL" | "HIGH" | "LOW" | string; // shown next to the result
  unit?: string;
  ref_range?: string; // use "\n" for multi-line ranges
  remarks?: string;
}

export interface ReportDetailData {
  report_token: string;
  report_date: string; // e.g. "2026-07-05"
  patient_name: string;
  civil_id?: string;
  mobile?: string;
  file_number: string;
  doctor_name: string;
  doctor_signature_url?: string | null; // optional image URL / data URI
  conclusion?: string | null;
  tests: ReportTestRow[];
}

const CLINIC = {
  handle: "@BATOCLINIC",
  phones: "22027200 | 60072700",
  address: "SALMIYA BLOCK 75, BUILDING 24",
  email: "CLINICBATO@GMAIL.COM",
};

const escapeHtml = (value: unknown): string =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return escapeHtml(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}/${mm}/${d.getFullYear()}`;
};

const statusColor = (status?: string): string => {
  if (!status) return "#222";
  return status.toUpperCase() === "NORMAL" ? "#2e7d32" : "#c62828";
};

export function reportDetail(data: ReportDetailData): string {
  const rows = data.tests
    .map(
      (t) => `
      <tr>
        <td>${escapeHtml(t.name)}</td>
        <td>${escapeHtml(t.result)}${
          t.status
            ? ` <b style="color:${statusColor(t.status)}">${escapeHtml(t.status)}</b>`
            : ""
        }</td>
        <td>${escapeHtml(t.unit)}</td>
        <td>${escapeHtml(t.ref_range).replace(/\n/g, "<br/>")}</td>
        <td>${escapeHtml(t.remarks)}</td>
      </tr>`
    )
    .join("");

  const signature = data.doctor_signature_url
    ? `<img src="${escapeHtml(data.doctor_signature_url)}" alt="Doctor signature" style="height:48px;" />`
    : "";

  const conclusion = data.conclusion
    ? `<p class="conclusion"><b>Conclusion:</b> ${escapeHtml(data.conclusion)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Medical Report ${escapeHtml(data.report_token)}</title>
  <style>
    * { box-sizing: border-box; }
    body { font-family: Helvetica, Arial, sans-serif; color: #222; margin: 0; padding: 24px; font-size: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid #ddd; }
    .logo { font-size: 56px; letter-spacing: 4px; line-height: 1; font-weight: 300; }
    .logo small { display: block; font-size: 11px; letter-spacing: 2px; margin-top: 6px; color: #555; }
    .clinic { text-align: right; line-height: 1.7; font-size: 13px; color: #444; }
    .info { display: flex; justify-content: space-between; margin: 20px 0; gap: 24px; }
    .info table { border-collapse: collapse; }
    .info td { padding: 3px 12px 3px 0; vertical-align: top; }
    .info td:first-child { font-weight: bold; }
    h2 { text-align: center; font-size: 16px; margin: 24px 0 12px; }
    table.tests { width: 100%; border-collapse: collapse; }
    table.tests th, table.tests td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; vertical-align: middle; }
    table.tests th { background: #f7f7f7; }
    .conclusion { margin-top: 16px; }
    .footer { margin-top: 32px; display: flex; justify-content: flex-end; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">BATO<small>Health/Beauty</small></div>
    <div class="clinic">
      ${escapeHtml(CLINIC.handle)}<br/>
      ${escapeHtml(CLINIC.phones)}<br/>
      ${escapeHtml(CLINIC.address)}<br/>
      ${escapeHtml(CLINIC.email)}
    </div>
  </div>

  <div class="info">
    <table>
      <tr><td>Patient Name</td><td>: ${escapeHtml(data.patient_name)}</td></tr>
      <tr><td>Civil ID</td><td>: ${escapeHtml(data.civil_id)}</td></tr>
      <tr><td>Mobile</td><td>: ${escapeHtml(data.mobile)}</td></tr>
    </table>
    <table>
      <tr><td>File No.</td><td>: ${escapeHtml(data.file_number)}</td></tr>
      <tr><td>Doctor Name</td><td>: ${escapeHtml(data.doctor_name)}</td></tr>
      <tr><td>Report Date</td><td>: ${formatDate(data.report_date)}</td></tr>
    </table>
  </div>

  <h2>MEDICAL REPORT</h2>

  <table class="tests">
    <thead>
      <tr>
        <th>Test</th><th>Result</th><th>Unit</th><th>Ref. Range</th><th>Remarks</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  ${conclusion}

  <div class="footer">${signature}</div>
</body>
</html>`;
}