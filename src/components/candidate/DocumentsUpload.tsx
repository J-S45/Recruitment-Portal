// import { AlertTriangle, User } from "lucide-react";

// const DocumentsUpload = () => {
 
//   const loggedInUser = JSON.parse(sessionStorage.getItem("user") || "{}");

//   return (
//     <div className="flex-1 flex flex-col">
//       <nav className="h-16 bg-amber-400 border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 shadow-sm">
//             <h1 className="text-3xl font-medium">Upload Documents</h1>
//     <div className="flex items-center gap-3 cursor-pointer">
//           <div className="w-8 h-8 rounded-full  bg-gray-500 flex items-center justify-center">
//             <User className="w-4 h-4 text-black" />
//           </div>
//           <div className="flex flex-col">
//            <span className="text-sm font-semibold text-gray-800">
//               {loggedInUser?.fullName}
//             </span>
//             <span className="text-xs text-gray-400">
//               {loggedInUser?.roles}
//             </span>
//           </div>
//         </div>

//       </nav>
//        <div className="px-4 sm:px-8">
//         <h3 className="text-2xl sm:text-3xl text-[#222d32] font-bold mt-8">Document Submission</h3>
//         <p className="text-sm sm:text-base text-[#222d32] mt-1">
//           Upload all required documents to complete your application. Accepted formats: PDF, DOC, DOCX, JPG, PNG (max 5MB each).
//         </p>
//          <div className="flex gap-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mt-3 mb-8">
//           <AlertTriangle className="w-4 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
//           <p className="text-md text-amber-800 leading-relaxed">
//             Ensure all documents are <strong>clear, legible, and unaltered</strong>. Submitting fraudulent documents will result in immediate disqualification and possible legal action.
//           </p>
//       </div>
//       </div>
     
// </div>
//   );
// };

// export default DocumentsUpload;


import { useState } from "react";
import { CheckCircle, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
// import { type Document, REQUIRED_DOCUMENTS } from "@/utils/constants";

export interface Document {
  id: number;
  name: string;
 }

const REQUIRED_DOCUMENTS:Document[] = [
  { id: 1, name: "Signed Contracts" },
  { id: 2, name: "Passport Pictures" },
  { id: 3, name: "Valid National ID" },
  { id: 4, name: "Current CV" },
  { id: 5, name: "Educational Certificates" },
  { id: 6, name: "National Service Certificate" },
  { id: 7, name: "Birth Certificate for Employee" },
  { id: 8, name: "Birth Certificates for Children" },
  { id: 9, name: "Marriage Certificate" },
  { id: 10, name: "SSNIT Number" },
  { id: 11, name: "Ghana Card Number" },
  { id: 12, name: "Police Report" },
  { id: 13, name: "Affidavit/Gazette" },
];


const DocumentsUpload = () => {
  const [documents, setDocuments] = useState<Document[]>(
    REQUIRED_DOCUMENTS.map((doc) => ({ ...doc, file: null, uploaded: false }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (id: number, file: File | null) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file, uploaded: false } : doc
      )
    );
  };

  const handleRemoveFile = (id: number) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === id ? { ...doc, file: null, uploaded: false } : doc
      )
    );
  };

  const uploadedCount = documents.filter((d) => d.file !== null).length;
  const progress = Math.round((uploadedCount / documents.length) * 100);

  const handleSubmit = async () => {
    const missing = documents.filter((d) => d.file === null).map((d) => d.name);
    if (missing.length > 0) {
      toast.error(`Please upload all required documents.`, {
        position: "top-right",
        style: { color: "#ef4444" },
      });
      return;
    }

    setIsSubmitting(true);
    // 👇 Replace with actual API call
    setTimeout(() => {
      setIsSubmitting(false);
      setDocuments((prev) => prev.map((doc) => ({ ...doc, uploaded: true })));
      toast.success("All documents submitted successfully!", {
        position: "top-right",
        style: { color: "#237227" },
      });
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">

      {/* Navbar */}
      <nav className="h-16 bg-amber-400 border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl sm:text-2xl font-medium">Documents Upload</h1>
        <span className="text-sm font-semibold text-black">
          {uploadedCount}/{documents.length} uploaded
        </span>
      </nav>

      <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-[#222d32]">Onboarding Checklist</h2>
          <p className="text-sm text-gray-400 mt-1">To be submitted by employee</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Upload Progress</span>
            <span className="text-sm font-bold text-amber-600">{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Document Table */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

          {/* Table Header */}
          <div className="grid grid-cols-[40px_1fr_180px_120px] bg-[#222d32] text-white text-sm font-semibold px-4 py-3">
            <span>S/N</span>
            <span>Documents</span>
            <span>Upload File</span>
            <span className="text-center">Status</span>
          </div>

          {/* Document Rows */}
          <div className="flex flex-col divide-y divide-gray-100">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className={`grid grid-cols-[40px_1fr_180px_120px] items-center px-4 py-3 transition-colors
                  ${doc.file ? "bg-green-50" : "bg-white hover:bg-gray-50"}`}
              >
                {/* S/N */}
                <span className="text-sm text-gray-500 font-medium">{doc.id}</span>

                {/* Document Name */}
                <div className="flex items-center gap-2 pr-4">
                  <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-800">{doc.name}</span>
                </div>

                {/* Upload */}
                <div className="pr-4">
                  {doc.file ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 truncate max-w-[120px]">
                        {doc.file.name}
                      </span>
                      <button
                        onClick={() => handleRemoveFile(doc.id)}
                        className="text-red-400 hover:text-red-600 flex-shrink-0 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center gap-1.5 cursor-pointer text-amber-600 hover:text-amber-700 text-xs font-semibold">
                      <Upload className="w-3.5 h-3.5" />
                      Choose File
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => handleFileChange(doc.id, e.target.files?.[0] ?? null)}
                      />
                    </label>
                  )}
                </div>

                {/* Status */}
                <div className="flex justify-center">
                  {doc.uploaded ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : doc.file ? (
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                      Ready
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                      Pending
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || uploadedCount === 0}
            className="flex items-center gap-2 px-8 py-3 bg-amber-400 hover:bg-amber-500 text-black font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Submit All Documents
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default DocumentsUpload;