import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, Download, Eye, Info } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { getAuthUser } from "../utils/auth";

// Mock data - replace with API call
const mockComplaints = [
  {
    id: "CMP-2024-1247",
    userName: "John Doe",
    category: "Network Outage",
    status: "pending",
    dateSubmitted: "2026-03-26",
    priority: "High",
    department: "complaints",
  },
  {
    id: "CMP-2024-1246",
    userName: "Jane Smith",
    category: "Billing Issue",
    status: "in progress",
    dateSubmitted: "2026-03-25",
    priority: "Medium",
    department: "complaints",
  },
  {
    id: "CMP-2024-1245",
    userName: "Robert Johnson",
    category: "Service Quality",
    status: "under review",
    dateSubmitted: "2026-03-24",
    priority: "Low",
    department: "technical",
  },
  {
    id: "CMP-2024-1244",
    userName: "Mary Williams",
    category: "Network Outage",
    status: "resolved",
    dateSubmitted: "2026-03-23",
    priority: "High",
    department: "complaints",
  },
  {
    id: "CMP-2024-1243",
    userName: "James Brown",
    category: "Data Privacy",
    status: "pending",
    dateSubmitted: "2026-03-22",
    priority: "Medium",
    department: "legal",
  },
  {
    id: "CMP-2024-1242",
    userName: "Patricia Davis",
    category: "Billing Issue",
    status: "in progress",
    dateSubmitted: "2026-03-21",
    priority: "Low",
    department: "complaints",
  },
  {
    id: "CMP-2024-1241",
    userName: "Michael Miller",
    category: "Service Quality",
    status: "resolved",
    dateSubmitted: "2026-03-20",
    priority: "Medium",
    department: "technical",
  },
  {
    id: "CMP-2024-1240",
    userName: "Linda Wilson",
    category: "Network Outage",
    status: "under review",
    dateSubmitted: "2026-03-19",
    priority: "High",
    department: "enforcement",
  },
];

export default function Complaints() {
  const navigate = useNavigate();
  const user = getAuthUser();
  const [isLoading, setIsLoading] = useState(true);
  const [complaints, setComplaints] = useState(mockComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  // Filter complaints by department first, then by other filters
  const filteredComplaints = complaints.filter((complaint) => {
    // First filter by user's department
    const matchesDepartment = complaint.department === user?.department;
    
    const matchesSearch =
      complaint.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      complaint.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || complaint.category === categoryFilter;
    return matchesDepartment && matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedComplaints = filteredComplaints.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleViewDetails = (id: string) => {
    navigate(`/complaints/${id}`);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading complaints..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Complaints Management</h1>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
              <Info className="w-4 h-4" />
              {user?.department ? user.department.charAt(0).toUpperCase() + user.department.slice(1) : "Your"} Department Only
            </span>
          </div>
          <p className="text-gray-600">
            Viewing complaints assigned to your department
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, name, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under review">Under Review</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Network Outage">Network Outage</SelectItem>
              <SelectItem value="Billing Issue">Billing Issue</SelectItem>
              <SelectItem value="Service Quality">Service Quality</SelectItem>
              <SelectItem value="Data Privacy">Data Privacy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredComplaints.length)} of{" "}
          {filteredComplaints.length} complaints
        </p>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paginatedComplaints.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No complaints found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Complaint ID</TableHead>
                <TableHead className="font-semibold">User Name</TableHead>
                <TableHead className="font-semibold">Category</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date Submitted</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedComplaints.map((complaint) => (
                <TableRow key={complaint.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{complaint.id}</TableCell>
                  <TableCell>{complaint.userName}</TableCell>
                  <TableCell>{complaint.category}</TableCell>
                  <TableCell>
                    <StatusBadge status={complaint.status} size="sm" />
                  </TableCell>
                  <TableCell>
                    {new Date(complaint.dateSubmitted).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(complaint.id)}
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}