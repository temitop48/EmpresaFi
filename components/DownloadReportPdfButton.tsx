"use client";

// components/DownloadReportPdfButton.tsx

import { Download } from "lucide-react";

type DownloadReportPdfButtonProps = {
  ventureName: string;
};

/**
 * Opens the browser's native print-to-PDF interface.
 *
 * Native printing preserves long report layouts and vector-quality text
 * more reliably than capturing the complete page as one large image.
 */
export function DownloadReportPdfButton({
  ventureName,
}: DownloadReportPdfButtonProps) {
  function downloadPdf() {
    const previousTitle = document.title;

    const safeFileName = ventureName
      .trim()
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    document.title = `${safeFileName || "empresafi"}-venture-report`;

    window.print();

    /**
     * Restore the original browser title after the print window opens.
     */
    window.setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  }

  return (
    <button
      type="button"
      onClick={downloadPdf}
      className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100 transition hover:border-emerald-400/30 hover:bg-emerald-400/15"
    >
      <Download className="h-4 w-4" />
      Download PDF
    </button>
  );
}