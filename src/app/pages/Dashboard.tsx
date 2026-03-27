import { useState, useEffect } from "react";
import { MessageSquare, FileText, CheckCircle, Clock } from "lucide-react";
import StatCard from "../components/StatCard";
import LoadingSpinner from "../components/LoadingSpinner";
import bocraLogo from "../../bocra-logo.png";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Mock data - replace with API call
const complaintsByStatus = [
  { id: 1, status: "Pending", count: 45 },
  { id: 2, status: "Under Review", count: 32 },
  { id: 3, status: "In Progress", count: 28 },
  { id: 4, status: "Resolved", count: 156 },
];

const monthlyActivity = [
  { id: 1, month: "Oct", complaints: 45, licenses: 12 },
  { id: 2, month: "Nov", complaints: 52, licenses: 18 },
  { id: 3, month: "Dec", complaints: 48, licenses: 15 },
  { id: 4, month: "Jan", complaints: 61, licenses: 22 },
  { id: 5, month: "Feb", complaints: 58, licenses: 19 },
  { id: 6, month: "Mar", complaints: 67, licenses: 25 },
];

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Loading dashboard data..." />;
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      
      <div>
        <h1 className="text-3xl font-bold text-gray-900">System Overview</h1>
        <p className="text-gray-600 mt-2">Welcome to the BOCRA Admin Dashboard</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Complaints"
          value={261}
          icon={MessageSquare}
          iconColor="text-blue-600"
          iconBgColor="bg-blue-100"
          trend={{ value: "+12% from last month", isPositive: true }}
        />
        <StatCard
          title="Active Complaints"
          value={105}
          icon={Clock}
          iconColor="text-orange-600"
          iconBgColor="bg-orange-100"
        />
        <StatCard
          title="License Applications"
          value={111}
          icon={FileText}
          iconColor="text-purple-600"
          iconBgColor="bg-purple-100"
          trend={{ value: "+8% from last month", isPositive: true }}
        />
        <StatCard
          title="Pending Approvals"
          value={23}
          icon={CheckCircle}
          iconColor="text-green-600"
          iconBgColor="bg-green-100"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Complaints by Status */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Complaints by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="status" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[8, 8, 0, 0]} name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Activity Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
              <YAxis stroke="#6b7280" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="complaints"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: "#2563eb" }}
                name="Complaints"
              />
              <Line
                type="monotone"
                dataKey="licenses"
                stroke="#9333ea"
                strokeWidth={2}
                dot={{ fill: "#9333ea" }}
                name="Licenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            {
              id: "CMP-2024-1247",
              type: "Complaint",
              action: "New submission",
              user: "John Doe",
              time: "5 minutes ago",
            },
            {
              id: "LIC-2024-0892",
              type: "License",
              action: "Approved",
              user: "Admin User",
              time: "1 hour ago",
            },
            {
              id: "CMP-2024-1246",
              type: "Complaint",
              action: "Status updated to In Progress",
              user: "Admin User",
              time: "2 hours ago",
            },
            {
              id: "LIC-2024-0891",
              type: "License",
              action: "New application",
              user: "Tech Solutions Ltd",
              time: "3 hours ago",
            },
          ].map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {activity.id} - {activity.action}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {activity.type} • {activity.user}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}