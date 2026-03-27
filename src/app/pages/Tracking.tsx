import { useState } from "react";
import { Search, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import EmptyState from "../components/EmptyState";

const mockTrackingData: Record<string, any> = {
  "CMP-2024-1247": {
    id: "CMP-2024-1247",
    type: "Complaint",
    title: "Network Outage Complaint",
    submittedDate: "2026-03-26",
    currentStatus: "pending",
    timeline: [
      {
        status: "Submitted",
        date: "2026-03-26T10:30:00",
        completed: true,
        description: "Your complaint has been successfully submitted",
      },
      {
        status: "Under Review",
        date: null,
        completed: false,
        description: "Our team is reviewing your complaint",
      },
      {
        status: "In Progress",
        date: null,
        completed: false,
        description: "We are working on resolving your complaint",
      },
      {
        status: "Resolved",
        date: null,
        completed: false,
        description: "Your complaint has been resolved",
      },
    ],
  },
  "LIC-2024-0892": {
    id: "LIC-2024-0892",
    type: "License Application",
    title: "Telecommunications Service Provider License",
    submittedDate: "2026-03-25",
    currentStatus: "under review",
    timeline: [
      {
        status: "Submitted",
        date: "2026-03-25T14:20:00",
        completed: true,
        description: "Your application has been received",
      },
      {
        status: "Under Review",
        date: "2026-03-25T15:00:00",
        completed: true,
        description: "Application is being reviewed by our team",
      },
      {
        status: "Approved",
        date: null,
        completed: false,
        description: "Application will be approved or rejected",
      },
      {
        status: "Completed",
        date: null,
        completed: false,
        description: "License issued and ready for collection",
      },
    ],
  },
};

export default function Tracking() {
  const [trackingId, setTrackingId] = useState("");
  const [trackingData, setTrackingData] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = () => {
    if (!trackingId.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    // Simulate API call
    setTimeout(() => {
      const data = mockTrackingData[trackingId.toUpperCase()];
      if (data) {
        setTrackingData(data);
        setNotFound(false);
      } else {
        setTrackingData(null);
        setNotFound(true);
      }
      setIsSearching(false);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Track Your Submission</h1>
        <p className="text-gray-600 mt-2">
          Enter your tracking ID to check the status of your complaint or license
          application
        </p>
      </div>

      {/* Search Box */}
      <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Enter tracking ID (e.g., CMP-2024-1247 or LIC-2024-0892)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              onKeyPress={handleKeyPress}
              className="pl-10 h-12 text-base"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !trackingId.trim()}
            className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-600 disabled:opacity-80"
          >
            {isSearching ? "Searching..." : "Track"}
          </Button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>
            <strong>Sample IDs to try:</strong> CMP-2024-1247, LIC-2024-0892
          </p>
        </div>
      </div>

      {/* Results */}
      {notFound && (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <EmptyState
            icon={Search}
            title="No results found"
            description={`We couldn't find any submission with ID "${trackingId}". Please check the ID and try again.`}
          />
        </div>
      )}

      {trackingData && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 space-y-6">
          {/* Header Info */}
          <div className="pb-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {trackingData.id}
                  </h2>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {trackingData.type}
                  </span>
                </div>
                <p className="text-gray-600">{trackingData.title}</p>
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Submitted on:{" "}
                {new Date(trackingData.submittedDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Status Timeline
            </h3>
            <div className="space-y-8">
              {trackingData.timeline.map((step: any, index: number) => {
                const isActive = step.completed;
                const isLast = index === trackingData.timeline.length - 1;

                return (
                  <div key={index} className="flex gap-6">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                          isActive
                            ? "bg-green-50 border-green-500"
                            : "bg-gray-50 border-gray-300"
                        }`}
                      >
                        {isActive ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-0.5 h-16 ${
                            isActive ? "bg-green-500" : "bg-gray-300"
                          }`}
                        ></div>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-semibold ${
                            isActive ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {step.status}
                        </h4>
                        {step.date && (
                          <span className="text-sm text-gray-600">
                            {new Date(step.date).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          isActive ? "text-gray-600" : "text-gray-500"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Need help?</strong> Contact BOCRA support at{" "}
                <a
                  href="mailto:support@bocra.org.bw"
                  className="underline hover:text-blue-700"
                >
                  support@bocra.org.bw
                </a>{" "}
                or call +267 3958 0000
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}