"use client";

// components/DownloadReportPdfButton.tsx

import { useState } from "react";
import { Download, LoaderCircle } from "lucide-react";

type DownloadReportPdfButtonProps = {
  ventureName: string;
};

export function DownloadReportPdfButton({
  ventureName,
}: DownloadReportPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  function downloadPdf() {
    if (isGenerating) return;

    setIsGenerating(true);

    const previousTitle = document.title;

    const safeFileName = ventureName
      .trim()
      .replace(/[^a-zA-Z0-9\s-_]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();

    document.title = `${safeFileName || "empresafi"}-venture-intelligence-report`;

    /**
     * Give the browser a moment to update the title
     * before opening the print dialog.
     */
    requestAnimationFrame(() => {
      window.print();

      window.setTimeout(() => {
        document.title = previousTitle;
        setIsGenerating(false);
      }, 800);
    });
  }

  return (
    <button
      type="button"
      onClick={downloadPdf}
      disabled={isGenerating}
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-xl
        border
        border-emerald-400/20
        bg-emerald-400/10
        px-4
        py-3
        text-sm
        font-medium
        text-emerald-100
        transition
        hover:border-emerald-400/30
        hover:bg-emerald-400/15
        disabled:cursor-not-allowed
        disabled:opacity-60
        print:hidden
      "
    >
      {isGenerating ? (
        <>
          <LoaderCircle className="h-4 w-4 animate-spin" />
          Preparing PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Download PDF
        </>
      )}
    </button>
  );
}