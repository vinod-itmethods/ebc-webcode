import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Upload, Trash2, FileText, X } from "lucide-react";
import { partners } from "@/data/partners";

interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  url?: string;
}

interface ProviderDocuments {
  [providerId: string]: UploadedDocument[];
}

export default function AdminDocuments() {
  const navigate = useNavigate();
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    partners[0]?.id || "",
  );
  const [documents, setDocuments] = useState<ProviderDocuments>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("contract");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Check admin authentication
    const adminEmail = localStorage.getItem("adminEmail");
    if (!adminEmail) {
      navigate("/admin");
      return;
    }

    // Load all documents
    const allDocs: ProviderDocuments = {};
    partners.forEach((partner) => {
      const storedDocs = localStorage.getItem(
        `provider_documents_${partner.id}`,
      );
      if (storedDocs) {
        try {
          allDocs[partner.id] = JSON.parse(storedDocs);
        } catch {
          allDocs[partner.id] = [];
        }
      } else {
        allDocs[partner.id] = [];
      }
    });
    setDocuments(allDocs);
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedProviderId) {
      alert("Please select a file and a provider");
      return;
    }

    setUploading(true);

    // Read file as data URL for storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const fileUrl = event.target?.result as string;
      const newDocument: UploadedDocument = {
        id: Date.now().toString(),
        name: selectedFile.name,
        type: documentType,
        uploadedAt: new Date().toISOString(),
        url: fileUrl,
      };

      // Update documents
      const updatedDocs = {
        ...documents,
        [selectedProviderId]: [
          ...(documents[selectedProviderId] || []),
          newDocument,
        ],
      };

      // Save to localStorage
      localStorage.setItem(
        `provider_documents_${selectedProviderId}`,
        JSON.stringify(updatedDocs[selectedProviderId]),
      );

      setDocuments(updatedDocs);
      setSelectedFile(null);
      setDocumentType("contract");
      setUploading(false);
      alert("Document uploaded successfully!");
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDeleteDocument = (providerId: string, docId: string) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

    const updatedDocs = {
      ...documents,
      [providerId]: documents[providerId].filter((doc) => doc.id !== docId),
    };

    localStorage.setItem(
      `provider_documents_${providerId}`,
      JSON.stringify(updatedDocs[providerId]),
    );

    setDocuments(updatedDocs);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="container max-w-4xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-2">
              Manage Provider Documents
            </h1>
            <p className="text-lg text-foreground/90">
              Upload contracts and other documents for technology providers.
            </p>
          </div>

          {/* Upload Section */}
          <div className="bg-white rounded-lg border border-border p-6 mb-12">
            <h3 className="text-lg font-bold text-foreground mb-6">
              Upload Document
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select Provider
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(193_45%_45%)]"
                >
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Document Type
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(193_45%_45%)]"
                >
                  <option value="contract">Contract</option>
                  <option value="agreement">Agreement</option>
                  <option value="nda">NDA</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Select File
                </label>
                <label className="flex items-center justify-center gap-2 px-4 py-6 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to select a file"}
                    </p>
                    <p className="text-xs text-foreground/60">
                      or drag and drop
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? "Uploading..." : "Upload Document"}
              </Button>
            </div>
          </div>

          {/* Documents by Provider */}
          <div className="space-y-8">
            {partners.map((partner) => {
              const providerDocs = documents[partner.id] || [];
              return (
                <div key={partner.id}>
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    {partner.name}
                  </h3>

                  {providerDocs.length > 0 ? (
                    <div className="space-y-2">
                      {providerDocs.map((doc) => (
                        <div
                          key={doc.id}
                          className="bg-white rounded-lg border border-border p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <FileText className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-foreground/60">
                                {doc.type} •{" "}
                                {new Date(doc.uploadedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteDocument(partner.id, doc.id)
                            }
                            className="ml-4 p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex-shrink-0"
                            title="Delete document"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground/60 bg-slate-50 rounded-lg p-4">
                      No documents uploaded
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
