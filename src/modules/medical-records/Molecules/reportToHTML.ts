// reportDetail.ts
// Builds the printable "Medical Report" HTML (matches the new BATO clinic layout).
// Use the returned string in a WebView (source={{ html }}) or with expo-print.

import { useAuthStore } from "@/modules/auth/store/auth.store";

export interface ReportTestRow {
  test_name: string;
  test_value: string;
  flag?: "NORMAL" | "HIGH" | "LOW" | "CRITICAL" | string; // shown in flag column
  unit?: string;
  normal_range?: string; // use "\n" for multi-line ranges
}

export interface ReportDetailData {
  report_token: string;
  report_date: string; // e.g. "2026-07-05"
  patient_name: string;
  civil_id?: string;
  mobile?: string; // (Retained in dataset, can be placed if needed)
  file_number: string;
  doctor_name: string;
  doctor_signature_url?: string | null; // optional image URL / data URI
  conclusion?: string | null;
  tests: ReportTestRow[];
}

const CLINIC = {
  name: "CLINIC",
  phones: "number",
  address: "address",
  email: "GMAIL.COM",
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

const getFlagClass = (flag?: string): string => {
  if (!flag) return "flag-normal";
  const upper = flag.toUpperCase();
  if (upper === "HIGH") return "flag-high";
  if (upper === "LOW") return "flag-low";
  if (upper === "CRITICAL") return "flag-critical";
  return "flag-normal";
};

export function reportToHTML(data: ReportDetailData,user:any): string {

  // Generates table body rows adapting properties into the 4-column layout of the new template
  const rows = data.tests
    .map(
      (t) => `
      <tr>
        <td>${escapeHtml(t.test_name)}</td>
        <td>${escapeHtml(t.test_value)} ${escapeHtml(t.unit)}</td>
        <td><span class="${getFlagClass(t.flag)}">${escapeHtml(t.flag || "NORMAL")}</span></td>
        <td>${escapeHtml(t.normal_range).replace(/\n/g, "<br/>")}</td>
      </tr>`
    )
    .join("");

  const signature = data.doctor_signature_url
    ? `<div class="signature-section">
         <div class="doctor-stamp">
           <p style="margin-bottom: 5px; font-weight: bold;">Dr. ${escapeHtml(data.doctor_name)}</p>
           <img src="${escapeHtml(data.doctor_signature_url)}" alt="Doctor stamp / signature" />
         </div>
       </div>`
    : "";

  const conclusion = data.conclusion
    ? `<div class="conclusion-box">
         <div class="conclusion-label">Conclusion / Remarks:</div>
         <p>${escapeHtml(data.conclusion)}</p>
       </div>`
    : "";

  const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(user?.full_name || "")} - ${escapeHtml(user?.patient_code || "")}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            background: #fff;
            padding: 20px;
            color: #222;
            font-size: 12px;
            line-height: 1.4;
        }

        .print-container {
            max-width: 960px;
            margin: 0 auto;
            background: #fff;
            padding: 10px;
        }

        .letterhead {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 12px;
            border-bottom: 1px solid #ccc;
            margin-bottom: 14px;
        }

        .logo-section img {
            max-width: 100px;
            height: auto;
        }

        .company-info {
            flex: 1;
            text-align: right;
            padding-left: 20px;
        }

        .company-info p {
            font-size: 14px;
            margin: 2px 0;
            color: #666;
            font-weight: 500;
        }

        .patient-section {
            display: flex;
            justify-content: space-between;
            margin-bottom: 14px;
            gap: 20px;
            border-bottom: 1px solid #ccc;
        }

        .patient-left,
        .patient-right {
            flex: 1;
            margin-bottom: 14px;
        }

        .info-row {
            display: flex;
            margin-bottom: 3px;
            font-size: 12px;
        }

        .info-label {
            font-weight: 700;
            width: 105px;
            flex-shrink: 0;
            color: #222;
        }

        .info-sep {
            margin: 0 6px;
            color: #555;
        }

        .info-value {
            color: #222;
        }

        .report-title {
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin: 12px 0 12px;
            padding-top: 12px;
        }

        .test-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
            font-size: 12px;
        }

        .test-table th {
            border: 1px solid #ccc;
            padding: 6px 10px;
            font-weight: 700;
            color: #222;
            text-align: left;
            background: #f5f5f5;
        }

        .test-table td {
            border: 1px solid #ccc;
            padding: 6px 10px;
            color: #222;
            vertical-align: middle;
        }

        .test-table tbody tr:nth-child(even) {
            background: #fafafa;
        }

        .flag-normal {
            color: #1a7a1a;
            font-weight: 700;
        }

        .flag-high {
            color: #cc0000;
            font-weight: 700;
        }

        .flag-low {
            color: #cc0000;
            font-weight: 700;
        }

        .flag-critical {
            color: #8b0000;
            font-weight: 700;
        }

        .conclusion-box {
            border: 1px solid #ccc;
            padding: 12px 15px;
            margin-top: 20px;
            background: #fafafa;
            font-size: 12px;
            line-height: 1.6;
            break-inside: avoid;
        }

        .conclusion-label {
            font-weight: 700;
            margin-bottom: 6px;
            font-size: 12px;
        }

        .signature-section {
            margin-top: 30px;
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
        }

        .doctor-stamp img {
            max-width: 110px;
            max-height: 110px;
            object-fit: contain;
            mix-blend-mode: multiply;
            opacity: 0.95;
            background: transparent;
            filter: contrast(1.2) brightness(1.1);
        }

        .page-layout {
            width: 100%;
            border-collapse: collapse;
        }

        .page-layout thead td {
            padding-bottom: 10px;
        }

        .page-layout tbody td {
            padding-top: 8px;
        }

        @media print {
            @page {
                margin: 15mm 10mm;
            }

            body {
                background: #fff;
                padding: 0;
                margin: 0;
            }

            .print-container {
                box-shadow: none;
                padding: 0;
            }
        }
    </style>
</head>

<body>
    <div class="print-container">
        <table class="page-layout">
            <thead>
                <tr>
                    <td>
                        <!-- LETTERHEAD -->
                        <div class="letterhead">
                            <div class="logo-section">
                                <img src="https://yourdomain.com" alt="BATO Logo">
                            </div>
                            <div class="company-info">
                                <p>${escapeHtml(CLINIC.name)}</p>
                                <p>${escapeHtml(CLINIC.phones)}</p>
                                <p>${escapeHtml(CLINIC.address)}</p>
                                <p>${escapeHtml(CLINIC.email)}</p>
                            </div>
                        </div>

                        <!-- PATIENT INFO -->
                        <div class="patient-section">
                            <div class="patient-left">
                                <div class="info-row">
                                    <span class="info-label">Patient Name</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${escapeHtml(user?.full_name)}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Civil ID</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${escapeHtml(user?.civil_id || "-")}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Mobile</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${escapeHtml(user?.full_mobile_number || "-")}</span>
                                </div>
                            </div>
                            <div class="patient-right">
                                <div class="info-row">
                                    <span class="info-label">File Number</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${escapeHtml(user?.patient_code)}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Doctor Name</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${escapeHtml(data.doctor_name)}</span>
                                </div>
                                <div class="info-row">
                                    <span class="info-label">Report Date</span>
                                    <span class="info-sep">:</span>
                                    <span class="info-value">${formatDate(data.report_date)}</span>
                                </div>
                            </div>
                        </div>

                        <!-- REPORT TITLE -->
                        <div class="report-title">
                            MEDICAL REPORT
                        </div>

                        <!-- TEST TABLE -->
                        <table class="test-table">
                            <thead>
                                <tr>
                                    <th>Test</th>
                                    <th>Result</th>
                                    <th>Flag</th>
                                    <th>Ref. Range</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>

                        <!-- CONCLUSION -->
                        ${conclusion}

                        <!-- SIGNATURE -->
                        <div class="signature-section">
                            ${signature}
                        </div>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <!-- FOOTER -->
                        <div style="text-align: center; margin-top: 20px; padding-top: 10px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
                            <p>This is a computer-generated report. No signature is required.</p>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>
</html>`;
  return html;
}
