import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { partners, type Partner } from "@/data/partners";
import { Upload, X, Plus } from "lucide-react";

interface EditablePartner extends Partner {
  additionalTopic?: string;
}

export default function PartnerProfileEditor() {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>(partners[0].id);
  const [partnerData, setPartnerData] = useState<EditablePartner>(partners[0]);
  const [isSaved, setIsSaved] = useState(false);
  const [topics, setTopics] = useState<string[]>(partners[0].topics || []);
  const [additionalTopic, setAdditionalTopic] = useState("");

  // Load partner data when selection changes
  useEffect(() => {
    const selected = partners.find(p => p.id === selectedPartnerId);
    if (selected) {
      const savedData = localStorage.getItem(`partner_${selectedPartnerId}`);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        setPartnerData(parsed);
        setTopics(parsed.topics || []);
        setAdditionalTopic(parsed.additionalTopic || "");
      } else {
        setPartnerData(selected);
        setTopics(selected.topics || []);
        setAdditionalTopic("");
      }
    }
    setIsSaved(false);
  }, [selectedPartnerId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        setPartnerData(prev => ({
          ...prev,
          speakerImage: imageUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (field: keyof EditablePartner, value: string) => {
    setPartnerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...topics];
    newTopics[index] = value;
    setTopics(newTopics);
  };

  const addTopic = () => {
    if (additionalTopic.trim()) {
      setTopics([...topics, additionalTopic]);
      setAdditionalTopic("");
    }
  };

  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };


  const handleSave = () => {
    const dataToSave = {
      ...partnerData,
      topics,
      additionalTopic
    };
    localStorage.setItem(`partner_${selectedPartnerId}`, JSON.stringify(dataToSave));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const selectedPartner = partners.find(p => p.id === selectedPartnerId);

  return (
    <div className="space-y-8">
      {/* Partner Selection */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Select Partner</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {partners.map(partner => (
            <button
              key={partner.id}
              onClick={() => setSelectedPartnerId(partner.id)}
              className={`p-3 rounded-lg border-2 transition-all text-center ${
                selectedPartnerId === partner.id
                  ? "border-primary bg-blue-50"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-full h-12 object-contain mb-2"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <p className="text-xs font-medium text-foreground line-clamp-1">
                {partner.name}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Company Information */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Company Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Name
            </label>
            <Input
              value={partnerData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Your company name"
              className="w-full"
              disabled
            />
            <p className="text-xs text-foreground/50 mt-1">Company name cannot be changed. Contact support if you need to update this.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Company Logo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-16 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-slate-50 flex-shrink-0">
                {partnerData.logo ? (
                  <img
                    src={partnerData.logo}
                    alt="Logo"
                    className="max-h-14 object-contain"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-foreground/40" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-xs text-foreground/60 mb-2">Upload your company logo (PNG, JPG)</p>
                <p className="text-xs text-foreground/50 mb-2">Supported formats: PNG, JPG, SVG</p>
                <Button asChild variant="outline" className="w-full">
                  <label>
                    <span>Upload Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled
                    />
                  </label>
                </Button>
                <p className="text-xs text-foreground/50 mt-2">Logo uploads will be enabled in a future update</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Speaker Information */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Featured Speaker</h3>
        <div className="space-y-4">
          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Speaker Photo
            </label>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-slate-50 flex-shrink-0">
                {partnerData.speakerImage ? (
                  <img
                    src={partnerData.speakerImage}
                    alt="Speaker"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <Upload className="w-6 h-6 text-foreground/40" />
                )}
              </div>
              <label className="flex-1">
                <Button asChild variant="outline" className="w-full">
                  <span>Upload Photo</span>
                </Button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Speaker Name
              </label>
              <Input
                value={partnerData.speakerName || ""}
                onChange={(e) => handleInputChange("speakerName", e.target.value)}
                placeholder="Full name"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title / Role
              </label>
              <Input
                value={partnerData.speakerTitle || ""}
                onChange={(e) => handleInputChange("speakerTitle", e.target.value)}
                placeholder="CEO, Founder, etc."
                className="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Speaker Bio
            </label>
            <textarea
              value={partnerData.speakerBio || ""}
              onChange={(e) => handleInputChange("speakerBio", e.target.value)}
              placeholder="Brief biography of the speaker"
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Speaker Quote
            </label>
            <textarea
              value={partnerData.speakerQuote || ""}
              onChange={(e) => handleInputChange("speakerQuote", e.target.value)}
              placeholder="Insightful quote from the speaker"
              className="w-full p-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Discussion Topics */}
      <div className="bg-white rounded-lg border border-border p-6">
        <h3 className="text-lg font-bold text-foreground mb-6">Example Discussion Topics</h3>
        <div className="space-y-3">
          {topics.map((topic, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={topic}
                  onChange={(e) => handleTopicChange(idx, e.target.value)}
                  placeholder="Discussion topic"
                  className="w-full"
                />
              </div>
              <Button
                onClick={() => removeTopic(idx)}
                variant="ghost"
                size="sm"
                className="text-red-600 hover:bg-red-50"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}

          {/* Add custom topic */}
          <div className="flex gap-2 items-end pt-2 border-t border-border">
            <Input
              value={additionalTopic}
              onChange={(e) => setAdditionalTopic(e.target.value)}
              placeholder="Add another topic or 'Other' field"
              className="w-full"
            />
            <Button
              onClick={addTopic}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>
        </div>
      </div>


      {/* Save and Preview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Button
            onClick={handleSave}
            className="w-full font-semibold py-6 rounded-lg"
          >
            {isSaved ? "✓ Changes Saved" : "Save Changes"}
          </Button>
          <p className="text-xs text-foreground/60 mt-2 text-center">
            Changes are saved locally and will appear on your partner card
          </p>
        </div>

        {/* Live Preview */}
        {selectedPartner && (
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-lg border border-border p-6">
            <h4 className="text-sm font-bold text-foreground mb-4">Live Preview</h4>
            <div className="bg-white rounded-lg p-4 border border-border space-y-4">
              <div>
                <div className="w-full h-20 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                  {partnerData.logo ? (
                    <img
                      src={partnerData.logo}
                      alt={partnerData.name}
                      className="max-h-16 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-slate-400">{partnerData.name}</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-foreground">{partnerData.name}</p>
                <p className="text-xs text-foreground/70 mt-1">{partnerData.tagline}</p>
              </div>

              {partnerData.speakerImage && (
                <div className="pt-2 border-t border-border">
                  <div className="flex gap-3 items-start">
                    <img
                      src={partnerData.speakerImage}
                      alt={partnerData.speakerName}
                      className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="text-xs">
                      <p className="font-semibold text-foreground">
                        {partnerData.speakerName}
                      </p>
                      <p className="text-foreground/70">
                        {partnerData.speakerTitle?.split(',')[0]}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
