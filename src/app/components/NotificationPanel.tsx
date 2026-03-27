import { X, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { Button } from "./ui/button";

const notifications = [
  {
    id: 1,
    type: "complaint",
    title: "New Complaint Submitted",
    description: "CMP-2024-1247: Network outage complaint from John Doe",
    timestamp: "5 minutes ago",
    unread: true,
  },
  {
    id: 2,
    type: "license",
    title: "License Application Approved",
    description: "LIC-2024-0892 has been approved and ready for issuance",
    timestamp: "1 hour ago",
    unread: true,
  },
  {
    id: 3,
    type: "status",
    title: "Status Update Required",
    description: "CMP-2024-1240 pending review for over 48 hours",
    timestamp: "2 hours ago",
    unread: false,
  },
  {
    id: 4,
    type: "complaint",
    title: "Complaint Resolved",
    description: "CMP-2024-1235 has been marked as resolved",
    timestamp: "3 hours ago",
    unread: false,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "complaint":
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case "license":
      return <FileText className="w-5 h-5 text-blue-500" />;
    case "status":
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
};

export default function NotificationPanel({ onClose }: { onClose: () => void }) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="font-semibold text-gray-900">Notifications</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              You have {notifications.filter(n => n.unread).length} unread notifications
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                notification.unread ? "bg-blue-50/30" : ""
              }`}
            >
              <div className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {notification.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
}
