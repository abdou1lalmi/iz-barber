import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { skipToken } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch services
  const { data: services, isLoading: servicesLoading } = trpc.bookings.getServices.useQuery();

  // Fetch available slots
  const { data: availableSlots, isLoading: slotsLoading } = trpc.bookings.getAvailableSlots.useQuery(
    selectedDate && selectedService
      ? {
          date: format(selectedDate, "yyyy-MM-dd"),
          serviceId: selectedService,
        }
      : skipToken
  );

  // Create booking mutation
  const createBookingMutation = trpc.bookings.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      alert("Please select a service, date, and time");
      return;
    }

    setIsSubmitting(true);
    try {
      await createBookingMutation.mutateAsync({
        serviceId: selectedService,
        appointmentDate: format(selectedDate, "yyyy-MM-dd"),
        appointmentTime: selectedTime,
        clientName,
        clientEmail,
        clientPhone,
      });
      alert("Booking confirmed! Check your email for details.");
      // Reset form
      setSelectedService(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setClientName("");
      setClientEmail("");
      setClientPhone("");
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">💈 Book Your Perfect Cut 💈</h1>
          <p className="text-lg text-slate-600">Reserve your appointment at IZ BARBER in just a few clicks</p>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-t-lg">
            <CardTitle>Appointment Details</CardTitle>
            <CardDescription className="text-slate-300">Select your service, date, and time</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div className="space-y-2">
                <Label htmlFor="service" className="text-base font-semibold">
                  Select Service
                </Label>
                <Select
                  value={selectedService?.toString() || ""}
                  onValueChange={(val) => {
                    setSelectedService(Number(val));
                    setSelectedTime(null); // Reset time when service changes
                  }}
                >
                  <SelectTrigger id="service" className="h-11">
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {servicesLoading ? (
                      <div className="p-2 text-sm text-slate-500">Loading services...</div>
                    ) : services && services.length > 0 ? (
                      services.map((service) => (
                        <SelectItem key={service.id} value={service.id.toString()}>
                          {service.name} ({service.durationMinutes} min)
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-2 text-sm text-slate-500">No services available</div>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">Select Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full h-11 justify-start text-left font-normal"
                      disabled={!selectedService}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date..."}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start" side="bottom">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => setSelectedDate(date || null)}
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today || date.getDay() === 0;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Selection */}
              {selectedDate && selectedService && (
                <div className="space-y-2">
                  <Label htmlFor="time" className="text-base font-semibold">
                    Select Time
                  </Label>
                  <Select value={selectedTime || ""} onValueChange={setSelectedTime}>
                    <SelectTrigger id="time" className="h-11">
                      <SelectValue placeholder="Choose a time..." />
                    </SelectTrigger>
                    <SelectContent>
                      {slotsLoading ? (
                        <div className="p-2 text-sm text-slate-500">Loading available times...</div>
                      ) : availableSlots && availableSlots.length > 0 ? (
                        availableSlots.map((slot) => (
                          <SelectItem key={slot} value={slot}>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              {slot}
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-slate-500">No available times</div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Client Information */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-slate-900">Your Information</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      required
                      className="h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={
                  !selectedService ||
                  !selectedDate ||
                  !selectedTime ||
                  !clientName ||
                  !clientEmail ||
                  !clientPhone ||
                  isSubmitting ||
                  createBookingMutation.isPending
                }
                className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold"
              >
                {isSubmitting || createBookingMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </Button>

              {createBookingMutation.isError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Error: {createBookingMutation.error?.message || "Failed to create booking"}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">✂️ Professional Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Expert barbers with years of experience</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📧 Instant Confirmation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Receive email confirmation immediately</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔔 Reminders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">Get reminder 24 hours before appointment</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
