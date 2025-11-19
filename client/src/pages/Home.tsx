import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Scissors, Calendar, Users, BarChart3, Shield, Zap, MapPin, Phone, Mail, Clock } from "lucide-react";
import { getLoginUrl, BARBER_NAME, SITE_SUBTITLE, BARBER_LOCATION, BARBER_PHONE, BARBER_EMAIL, BARBER_HOURS } from "@/const";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💈</span>
            <span className="text-xl font-bold text-white">{BARBER_NAME}</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-slate-300">Welcome, {user?.name}!</span>
                {user?.role === "admin" ? (
                  <>
                    <Button asChild variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
                      <a href="/admin">Admin Dashboard</a>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="text-white border-slate-600 hover:bg-slate-800">
                      <a href="/my-bookings">My Bookings</a>
                    </Button>
                    <Button asChild className="bg-amber-600 hover:bg-amber-700">
                      <a href="/booking">Book Now</a>
                    </Button>
                  </>
                )}
                <Button variant="ghost" onClick={logout} className="text-slate-300 hover:text-white">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button asChild className="bg-amber-600 hover:bg-amber-700">
                  <a href={getLoginUrl()}>Sign In</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          💈 {BARBER_NAME} 💈
        </h1>
        <p className="text-2xl text-amber-400 font-semibold mb-6">{SITE_SUBTITLE}</p>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Experience premium barber services with expert hands. Book your appointment in seconds.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          {isAuthenticated ? (
            <>
              {user?.role === "admin" ? (
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <a href="/admin">Go to Admin Dashboard</a>
                </Button>
              ) : (
                <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
                  <a href="/booking">Book an Appointment</a>
                </Button>
              )}
            </>
          ) : (
            <Button asChild size="lg" className="bg-amber-600 hover:bg-amber-700">
              <a href={getLoginUrl()}>Get Started</a>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-800/50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-slate-800 border-slate-700 hover:border-amber-500 transition-colors">
              <CardHeader>
                <Calendar className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-white">Easy Booking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Browse available slots and book in seconds. No phone calls needed.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-amber-500 transition-colors">
              <CardHeader>
                <Zap className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-white">Instant Confirmation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Get email confirmation immediately. Receive reminders 24 hours before.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 hover:border-amber-500 transition-colors">
              <CardHeader>
                <Scissors className="h-8 w-8 text-amber-500 mb-2" />
                <CardTitle className="text-white">Expert Barbers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">
                  Professional haircuts and beard trims from experienced barbers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Basic Haircut</CardTitle>
              <CardDescription className="text-slate-400">30 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">Classic haircut with wash and style</p>
              <p className="text-2xl font-bold text-amber-500">$25</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Beard Trim</CardTitle>
              <CardDescription className="text-slate-400">20 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">Beard shaping and trimming</p>
              <p className="text-2xl font-bold text-amber-500">$15</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Haircut + Beard</CardTitle>
              <CardDescription className="text-slate-400">45 minutes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-4">Full haircut with beard trim</p>
              <p className="text-2xl font-bold text-amber-500">$35</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-amber-600 to-amber-700 py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Book?</h2>
          <p className="text-amber-50 mb-8">
            Join hundreds of satisfied customers who book with us every month.
          </p>
          {isAuthenticated ? (
            <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-slate-100">
              <a href="/booking">Book Your Appointment</a>
            </Button>
          ) : (
            <Button asChild size="lg" className="bg-white text-amber-700 hover:bg-slate-100">
              <a href={getLoginUrl()}>Sign In to Book</a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <span className="text-2xl">💈</span>
                {BARBER_NAME}
              </h3>
              <div className="space-y-2 text-slate-400 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {BARBER_LOCATION}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {BARBER_PHONE}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {BARBER_EMAIL}
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {BARBER_HOURS}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="/booking" className="hover:text-amber-400 transition">Book Appointment</a></li>
                <li><a href="/my-bookings" className="hover:text-amber-400 transition">My Bookings</a></li>
                <li><a href="/" className="hover:text-amber-400 transition">Home</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400 text-sm">
            <p>&copy; 2025 {BARBER_NAME}. All rights reserved. | Premium Barber Services</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
