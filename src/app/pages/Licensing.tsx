import { useState, useEffect } from "react";
import { Search, Download, CheckCircle, XCircle, Eye, Info } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import StatusBadge from "../components/StatusBadge";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { toast } from "sonner";
import { getAuthUser } from "../utils/auth";

// Mock data
const mockLicenses = [
  {
    id: "LIC-2024-0892",
    companyName: "Tech Solutions Ltd",
    licenseType: "Telecommunications Service Provider",
    status: "pending",
    dateSubmitted: "2026-03-25",
    documents: 8,
    department: "licensing",
  },
  {
    id: "LIC-2024-0891",
    companyName: "Digital Networks Pty",
    licenseType: "Internet Service Provider",
    status: "approved",
    dateSubmitted: "2026-03-20",
    documents: 12,
    department: "licensing",
  },
  {
    id: "LIC-2024-0890",
    companyName: "Mobile Connect Inc",
    licenseType: "Mobile Network Operator",
    status: "under review",
    dateSubmitted: "2026-03-18",
    documents: 15,
    department: "technical",
  },
  {
    id: "LIC-2024-0889",
    companyName: "Broadband Solutions",
    licenseType: "Internet Service Provider",
    status: "pending",
    dateSubmitted: "2026-03-15",
    documents: 9,
    department: "licensing",
  },
  {
    id: "LIC-2024-0888",
    companyName: "Wireless Systems Co",
    licenseType: "Telecommunications Service Provider",
    status: "rejected",
    dateSubmitted: "2026-03-12",
    documents: 6,
    department: "licensing",
  },
  {
    id: "LIC-2024-0887",
    companyName: "Fiber Network Ltd",
    licenseType: "Infrastructure Provider",
    status: "approved",
    dateSubmitted: "2026-03-10",
    documents: 14,
    department: "technical",
  },
];

export default function Licensing() {
  const user = getAuthUser();
  const [isLoading, setIsLoading] = useState(true);
  const [licenses, setLicenses] = useState(mockLicenses);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [licenseTypeFilter, setLicenseTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLicense, setSelectedLicense] = useState<any>(null);
  const [actionDialog, setActionDialog] = useState<"approve" | "reject" | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  }, []);

  // Filter licenses by department first, then by other filters
  const filteredLicenses = licenses.filter((license) => {
    // First filter by user's department
    const matchesDepartment = license.department === user?.department;
    
    const matchesSearch =
      license.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      license.licenseType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || license.status === statusFilter;
    const matchesType =
      licenseTypeFilter === "all" || license.licenseType === licenseTypeFilter;
    return matchesDepartment && matchesSearch && matchesStatus && matchesType;
  });

  const totalPages = Math.ceil(filteredLicenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLicenses = filteredLicenses.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleAction = (license: any, action: "approve" | "reject") => {
    setSelectedLicense(license);
    setActionDialog(action);
  };

  const confirmAction = () => {
    if (!selectedLicense || !actionDialog) return;

    const newStatus = actionDialog === "approve" ? "approved" : "rejected";
    
    setLicenses((prev) =>
      prev.map((lic) =>
        lic.id === selectedLicense.id ? { ...lic, status: newStatus } : lic
      )
    );

    toast.success(
      `License ${selectedLicense.id} has been ${actionDialog}d successfully`
    );
    
    setActionDialog(null);
    setSelectedLicense(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading license applications..." />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">
              License Management
            </h1>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700">
              <Info className="w-4 h-4" />
              {user?.department ? user.department.charAt(0).toUpperCase() + user.department.slice(1) : "Your"} Department Only
            </span>
          </div>
          <p className="text-gray-600">
            Viewing license applications assigned to your department
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
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by ID, company name, or license type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under review">Under Review</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={licenseTypeFilter} onValueChange={setLicenseTypeFilter}>
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All License Types</SelectItem>
              <SelectItem value="Telecommunications Service Provider">
                Telecom Service Provider
              </SelectItem>
              <SelectItem value="Internet Service Provider">
                Internet Service Provider
              </SelectItem>
              <SelectItem value="Mobile Network Operator">
                Mobile Network Operator
              </SelectItem>
              <SelectItem value="Infrastructure Provider">
                Infrastructure Provider
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {startIndex + 1}-
          {Math.min(startIndex + itemsPerPage, filteredLicenses.length)} of{" "}
          {filteredLicenses.length} applications
        </p>
      </div>

      {/* Licenses Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {paginatedLicenses.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No license applications found"
            description="Try adjusting your search or filter criteria"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Application ID</TableHead>
                <TableHead className="font-semibold">Company Name</TableHead>
                <TableHead className="font-semibold">License Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Date Submitted</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLicenses.map((license) => (
                <TableRow key={license.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{license.id}</TableCell>
                  <TableCell>{license.companyName}</TableCell>
                  <TableCell className="max-w-xs">{license.licenseType}</TableCell>
                  <TableCell>
                    <StatusBadge status={license.status} size="sm" />
                  </TableCell>
                  <TableCell>
                    {new Date(license.dateSubmitted).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      {license.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleAction(license, "approve")}
                          >
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleAction(license, "reject")}
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
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

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog !== null} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog === "approve" ? "Approve" : "Reject"} License Application
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {actionDialog} license application{" "}
              <strong>{selectedLicense?.id}</strong> for{" "}
              <strong>{selectedLicense?.companyName}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={confirmAction}
              className={
                actionDialog === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              Confirm {actionDialog === "approve" ? "Approval" : "Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}