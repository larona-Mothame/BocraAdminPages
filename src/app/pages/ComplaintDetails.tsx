import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Save, User, Calendar, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "sonner";

// Mock data
const mockComplaintDetails = {
  id: "CMP-2024-1247",
  userName: "John Doe",
  userEmail: "john.doe@example.com",
  userPhone: "+267 71234567",
  category: "Network Outage",
  status: "pending",
  priority: "High",
  dateSubmitted: "2026-03-26T10:30:00",
  description:
    "I've been experiencing severe network outages in my area for the past 3 days. The connection drops every few hours, making it impossible to work from home. I've contacted my service provider multiple times but the issue persists. This is affecting my business operations and I need urgent resolution.",
  timeline: [
    {
      action: "Complaint Submitted",
      date: "2026-03-26T10:30:00",
      user: "John Doe",
      status: "pending",
    },
    {
      action: "Complaint Received",
      date: "2026-03-26T10:31:00",
      user: "System",
      status: "pending",
    },
  ],
  internalNotes: "",
};

export default function ComplaintDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [complaint, setComplaint] = useState(mockComplaintDetails);
  const [selectedStatus, setSelectedStatus] = useState(complaint.status);
  const [internalNotes, setInternalNotes] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Complaint updated successfully");
      setIsSaving(false);
      
      // Update timeline
      const newTimelineEntry = {
        action: `Status changed to ${selectedStatus}`,
        date: new Date().toISOString(),
        user: "Admin User",
        status: selectedStatus,
      };
      
      setComplaint((prev) => ({
        ...prev,
        status: selectedStatus,
        timeline: [...prev.timeline, newTimelineEntry],
      }));
      
      if (internalNotes) {
        toast.success("Internal notes added");
        setInternalNotes("");
      }
    }, 800);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading complaint details..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/complaints")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Complaint Details
          </h1>
          <p className="text-gray-600 mt-1">{complaint.id}</p>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Complaint Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Complaint Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Category
                </label>
                <p className="mt-1 text-gray-900">{complaint.category}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Priority
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      complaint.priority === "High"
                        ? "bg-red-100 text-red-700"
                        : complaint.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {complaint.priority}
                  </span>
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <p className="mt-2 text-gray-900 leading-relaxed">
                  {complaint.description}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Date Submitted
                </label>
                <p className="mt-1 text-gray-900">
                  {new Date(complaint.dateSubmitted).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Status Timeline
            </h2>
            
            <div className="space-y-4">
              {complaint.timeline.map((entry, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    {index < complaint.timeline.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-medium text-gray-900">{entry.action}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {entry.user} •{" "}
                      {new Date(entry.date).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              User Details
            </h2>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Name</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.userName}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.userEmail}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{complaint.userPhone}</p>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Update Status
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Change Status
                </label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="under review">Under Review</SelectItem>
                    <SelectItem value="in progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Internal Notes
                </label>
                <Textarea
                  placeholder="Add internal notes (not visible to user)..."
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Alert */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-900">
                  High Priority
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  This complaint requires urgent attention. Please update the status within 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
