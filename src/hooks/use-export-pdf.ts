import { buildDetailsPdfHtml } from "@/lib/pdf";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useState } from "react";

type Transaction = {
  label: string;
  value: number;
  currency: string;
};

type UseExportPdfParams = {
  reference: string;
  incomings: Transaction[];
  expenses: Transaction[];
};

export function useExportPdf({
  reference,
  incomings,
  expenses,
}: UseExportPdfParams) {
  const [isExporting, setIsExporting] = useState(false);

  async function exportPdf() {
    setIsExporting(true);
    try {
      const html = buildDetailsPdfHtml({ reference, incomings, expenses });
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: `${reference}.pdf`,
        UTI: "com.adobe.pdf",
      });
    } finally {
      setIsExporting(false);
    }
  }

  return { exportPdf, isExporting };
}
