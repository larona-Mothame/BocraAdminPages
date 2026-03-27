interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const statusConfig = {
  pending: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "Pending",
  },
  "under review": {
    bg: "bg-purple-100",
    text: "text-purple-700",
    label: "Under Review",
  },
  "in progress": {
    bg: "bg-blue-100",
    text: "text-blue-700",
    label: "In Progress",
  },
  resolved: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Resolved",
  },
  approved: {
    bg: "bg-green-100",
    text: "text-green-700",
    label: "Approved",
  },
  rejected: {
    bg: "bg-red-100",
    text: "text-red-700",
    label: "Rejected",
  },
  closed: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: "Closed",
  },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusKey = status.toLowerCase() as keyof typeof statusConfig;
  const config = statusConfig[statusKey] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center ${config.bg} ${config.text} ${
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm"
      } rounded-full font-medium`}
    >
      {config.label}
    </span>
  );
}
