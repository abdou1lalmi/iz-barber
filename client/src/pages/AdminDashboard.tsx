import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, Clock, User, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Fetch all bookings
  const { data: bookings, isLoading, refetch } = trpc.admin.getBookings.useQuery(undefined, {
    enabled: isAuthenticated && !loading && user?.role === "admin",
  });

  // Fetch analytics
  const { data: analytics } = trpc.admin.getAnalytics.useQuery(undefined, {
    enabled: isAuthenticated && !loading && user?.role === "admin",
  });

  // Update booking status mutation
  const updateStatusMutation = trpc.admin.updateBookingStatus.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-900" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Admin access required</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">You do not have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredBookings = selectedStatus
    ? bookings?.filter((b) => b.status === selectedStatus)
    : bookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "no-show":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <AlertCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        bookingId,
        status: newStatus as "pending" | "confirmed" | "cancelled" | "no-show",
      });
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">💈 IZ BARBER Admin Dashboard</h1>
          <p className="text-lg text-slate-600">Manage bookings and view analytics</p>
        </div>

        {/* Analytics Cards */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Total Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{analytics.totalBookings}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Busiest Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {analytics.bookingsByDayOfWeek
                    ? Object.entries(analytics.bookingsByDayOfWeek).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"
                    : "N/A"}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  {analytics.bookingsByDayOfWeek
                    ? Object.entries(analytics.bookingsByDayOfWeek).sort(([, a], [, b]) => b - a)[0]?.[1] || 0
                    : 0}{" "}
                  bookings
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-slate-600">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {bookings?.filter((b) => b.status === "pending").length || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage client appointments</CardDescription>
              </div>
              <Select value={selectedStatus || "all"} onValueChange={(val) => setSelectedStatus(val === "all" ? null : val)}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No-Show</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {filteredBookings && filteredBookings.length > 0 ? (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div>
                        <p className="text-sm text-slate-600">Client</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {booking.clientName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Date & Time</p>
                        <p className="font-semibold text-slate-900 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(booking.appointmentDate), "MMM dd")}
                        </p>
                        <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4" />
                          {booking.appointmentTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Contact</p>
                        <p className="text-sm text-slate-900">{booking.clientEmail}</p>
                        <p className="text-sm text-slate-900">{booking.clientPhone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Status</p>
                        <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(booking.status)}
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Select
                          value={booking.status}
                          onValueChange={(newStatus) => handleStatusChange(booking.id, newStatus)}
                          disabled={updateStatusMutation.isPending}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirm</SelectItem>
                            <SelectItem value="cancelled">Cancel</SelectItem>
                            <SelectItem value="no-show">No-Show</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-600">
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600">No bookings found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
