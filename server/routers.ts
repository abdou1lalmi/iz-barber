import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "./db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateProfile: protectedProcedure
      .input(z.object({
        phone: z.string().optional(),
        name: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Update user profile in database
        return { success: true };
      }),
  }),

  bookings: router({
    // Get available services
    getServices: publicProcedure.query(async () => {
      return await db.getServices();
    }),

    // Get available time slots for a specific date and service
    getAvailableSlots: publicProcedure
      .input(z.object({
        date: z.string(), // YYYY-MM-DD format
        serviceId: z.number(),
      }))
      .query(async ({ input }) => {
        const appointmentDate = new Date(input.date);
        const dayOfWeek = appointmentDate.getDay();

        // Check if date is blocked
        const isBlocked = await db.isDateBlocked(appointmentDate);
        if (isBlocked) return [];

        // Get availability for this day of week
        const dayAvailability = await db.getAvailabilityByDayOfWeek(dayOfWeek);
        if (!dayAvailability || !dayAvailability.isOpen) return [];

        // Get service duration
        const service = await db.getServiceById(input.serviceId);
        if (!service) return [];

        // Get existing bookings for this date
        const existingBookings = await db.getBookingsByDate(appointmentDate);
        const bookedTimes = new Set(existingBookings.map(b => b.appointmentTime));

        // Generate available slots
        const slots: string[] = [];
        const [startHour, startMin] = dayAvailability.startTime.split(':').map(Number);
        const [endHour, endMin] = dayAvailability.endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const duration = service.durationMinutes;

        for (let time = startMinutes; time + duration <= endMinutes; time += 30) {
          const hours = Math.floor(time / 60);
          const minutes = time % 60;
          const timeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
          if (!bookedTimes.has(timeStr)) {
            slots.push(timeStr);
          }
        }

        return slots;
      }),

    // Create a new booking
    create: publicProcedure
      .input(z.object({
        serviceId: z.number(),
        appointmentDate: z.string(),
        appointmentTime: z.string(),
        clientName: z.string(),
        clientEmail: z.string().email(),
        clientPhone: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Validate slot is still available
        const existingBookings = await db.getBookingsByDate(new Date(input.appointmentDate));
        const isBooked = existingBookings.some(b => b.appointmentTime === input.appointmentTime && b.status !== 'cancelled');
        if (isBooked) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Time slot already booked' });
        }

        await db.createBooking({
          clientId: ctx.user?.id || 0,
          serviceId: input.serviceId,
          appointmentDate: input.appointmentDate,
          appointmentTime: input.appointmentTime,
          clientName: input.clientName,
          clientEmail: input.clientEmail,
          clientPhone: input.clientPhone,
        });

        // TODO: Send confirmation email
        return { success: true };
      }),

    // Get client's upcoming bookings
    getMyBookings: protectedProcedure.query(async ({ ctx }) => {
      return await db.getClientBookings(ctx.user!.id);
    }),

    // Cancel a booking
    cancel: protectedProcedure
      .input(z.object({ bookingId: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const booking = await db.getBookingById(input.bookingId);
        if (!booking) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Booking not found' });
        }
        if (booking.clientId !== ctx.user!.id) {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot cancel other users bookings' });
        }

        // Check if cancellation is allowed (>24 hours before)
        const appointmentDate = new Date(booking.appointmentDate);
        const now = new Date();
        const hoursUntil = (appointmentDate.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursUntil < 24) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Cannot cancel within 24 hours of appointment' });
        }

        await db.updateBookingStatus(input.bookingId, 'cancelled');
        // TODO: Send cancellation email
        return { success: true };
      }),
  }),

  admin: router({
    // Get all bookings
    getBookings: adminProcedure.query(async () => {
      return await db.getAllBookings();
    }),

    // Get all availability settings
    getAvailability: adminProcedure.query(async () => {
      return await db.getAllAvailability();
    }),

    // Update booking status
    updateBookingStatus: adminProcedure
      .input(z.object({
        bookingId: z.number(),
        status: z.enum(['pending', 'confirmed', 'cancelled', 'no-show']),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateBookingStatus(input.bookingId, input.status, input.notes);
        // TODO: Send notification email to client
        return { success: true };
      }),

    // Get analytics
    getAnalytics: adminProcedure.query(async () => {
      return await db.getBookingAnalytics();
    }),
  }),
});

export type AppRouter = typeof appRouter;
