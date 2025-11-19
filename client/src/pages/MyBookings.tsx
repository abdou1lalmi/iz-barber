import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, Calendar, Clock, Phone, Mail, X } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export default function MyBookings() {
  const { user, isAuthenticated, loading } = useAuth();
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

  // Fetch user's bookings
  const { data: bookings, isLoading, refetch } = trpc.bookings.getMyBookings.useQuery(undefined, {
    enabled: isAuthenticated && !loading,
  });

  // Cancel booking mutation
  const cancelMutation = trpc.bookings.cancel.useMutation({
    onSuccess: () => {
      refetch();
      setSelectedBookingId(null);
    },
  });

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-slate-900" />
          <p className="text-slate-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>Please sign in to view your bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-4">You need to be logged in to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const upcomingBookings = bookings?.filter((b) => new Date(b.appointmentDate) >= new Date()) || [];
  const pastBookings = bookings?.filter((b) => new Date(b.appointmentDate) < new Date()) || [];

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

  const handleCancelBooking = async (bookingId: number) => {
    try {
      await cancelMutation.mutateAsync({ bookingId });
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">💈 My Bookings at IZ BARBER</h1>
          <p className="text-lg text-slate-600">Welcome, {user?.name || "Guest"}!</p>
        </div>

        {/* Upcoming Bookings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Upcoming Appointments</h2>
          {upcomingBookings.length > 0 ? (
            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{booking.clientName}</CardTitle>
                        <CardDescription>Booking ID: #{booking.id}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm text-slate-600">Date</p>
                          <p className="font-semibold text-slate-900">
                            {format(new Date(booking.appointmentDate), "PPP")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm text-slate-600">Time</p>
                          <p className="font-semibold text-slate-900">{booking.appointmentTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm text-slate-600">Email</p>
                          <p className="font-semibold text-slate-900 text-sm">{booking.clientEmail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-slate-600" />
                        <div>
                          <p className="text-sm text-slate-600">Phone</p>
                          <p className="font-semibold text-slate-900">{booking.clientPhone}</p>
                        </div>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-sm text-slate-600 mb-1">Notes</p>
                        <p className="text-slate-900">{booking.notes}</p>
                      </div>
                    )}

                    {booking.status === "confirmed" && (
                      <div className="flex gap-2 pt-4 border-t">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => setSelectedBookingId(booking.id)}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to cancel this booking? You can only cancel if the appointment is more than 24 hours away.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex gap-2">
                              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelBooking(booking.id)}
                                disabled={cancelMutation.isPending}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {cancelMutation.isPending ? (
                                  <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Cancelling...
                                  </>
                                ) : (
                                  "Cancel Booking"
                                )}
                              </AlertDialogAction>
                            </div>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-slate-50 border-dashed">
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No upcoming appointments</p>
                <Button asChild>
                  <a href="/booking">Book an Appointment</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Past Appointments</h2>
            <div className="grid gap-4">
              {pastBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{booking.clientName}</CardTitle>
                        <CardDescription>
                          {format(new Date(booking.appointmentDate), "PPP")} at {booking.appointmentTime}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
