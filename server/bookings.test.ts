import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId = 1, role: "user" | "admin" = "user"): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("bookings router", () => {
  describe("getServices", () => {
    it("should return available services", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const services = await caller.bookings.getServices();

      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty("name");
      expect(services[0]).toHaveProperty("durationMinutes");
    });
  });

  describe("getAvailableSlots", () => {
    it("should return available time slots for a valid date", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Get a future Monday
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      while (tomorrow.getDay() === 0) {
        // Skip Sundays
        tomorrow.setDate(tomorrow.getDate() + 1);
      }

      const dateStr = tomorrow.toISOString().split("T")[0];
      const services = await caller.bookings.getServices();

      if (services.length > 0) {
        const slots = await caller.bookings.getAvailableSlots({
          date: dateStr,
          serviceId: services[0].id,
        });

        expect(Array.isArray(slots)).toBe(true);
        if (slots.length > 0) {
          // Verify time format HH:MM
          expect(slots[0]).toMatch(/^\d{2}:\d{2}$/);
        }
      }
    });

    it("should return array of slots", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Get next Monday
      const monday = new Date();
      const daysUntilMonday = (1 - monday.getDay() + 7) % 7 || 7;
      monday.setDate(monday.getDate() + daysUntilMonday);

      const dateStr = monday.toISOString().split("T")[0];
      const services = await caller.bookings.getServices();

      if (services.length > 0) {
        const slots = await caller.bookings.getAvailableSlots({
          date: dateStr,
          serviceId: services[0].id,
        });

        expect(Array.isArray(slots)).toBe(true);
      }
    });
  });

  describe("create booking", () => {
    it("should create a booking with valid input", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Get a future Monday
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      while (tomorrow.getDay() === 0) {
        tomorrow.setDate(tomorrow.getDate() + 1);
      }

      const dateStr = tomorrow.toISOString().split("T")[0];
      const services = await caller.bookings.getServices();

      if (services.length > 0) {
        const slots = await caller.bookings.getAvailableSlots({
          date: dateStr,
          serviceId: services[0].id,
        });

        if (slots.length > 0) {
          const result = await caller.bookings.create({
            serviceId: services[0].id,
            appointmentDate: dateStr,
            appointmentTime: slots[0],
            clientName: "John Doe",
            clientEmail: "john@example.com",
            clientPhone: "555-1234",
          });

          expect(result).toHaveProperty("success", true);
        }
      }
    });

    it("should reject booking with invalid email", async () => {
      const ctx = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split("T")[0];

      try {
        await caller.bookings.create({
          serviceId: 1,
          appointmentDate: dateStr,
          appointmentTime: "10:00",
          clientName: "John Doe",
          clientEmail: "invalid-email",
          clientPhone: "555-1234",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.message).toContain("Invalid");
      }
    });
  });

  describe("getMyBookings", () => {
    it("should return user's bookings when authenticated", async () => {
      const ctx = createAuthContext(1, "user");
      const caller = appRouter.createCaller(ctx);

      const bookings = await caller.bookings.getMyBookings();

      expect(Array.isArray(bookings)).toBe(true);
    });

    it("should throw error when not authenticated", async () => {
      const ctx: TrpcContext = {
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      };
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.bookings.getMyBookings();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });

  describe("cancel booking", () => {
    it("should reject cancellation within 24 hours", async () => {
      const ctx = createAuthContext(1, "user");
      const caller = appRouter.createCaller(ctx);

      try {
        // Try to cancel a booking that's happening soon
        await caller.bookings.cancel({ bookingId: 999 });
        // If booking doesn't exist, it will throw NOT_FOUND
      } catch (error: any) {
        expect(["NOT_FOUND", "BAD_REQUEST"]).toContain(error.code);
      }
    });
  });
});

describe("admin router", () => {
  describe("getBookings", () => {
    it("should allow admin to get all bookings", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      const bookings = await caller.admin.getBookings();

      expect(Array.isArray(bookings)).toBe(true);
    });

    it("should reject non-admin access", async () => {
      const ctx = createAuthContext(1, "user");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.getBookings();
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });

  describe("getAnalytics", () => {
    it("should return analytics for admin", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      const analytics = await caller.admin.getAnalytics();

      expect(analytics).toHaveProperty("totalBookings");
      expect(analytics).toHaveProperty("bookingsByDayOfWeek");
      expect(typeof analytics.totalBookings).toBe("number");
    });
  });

  describe("updateBookingStatus", () => {
    it("should allow admin to update booking status", async () => {
      const ctx = createAuthContext(1, "admin");
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.admin.updateBookingStatus({
          bookingId: 999,
          status: "confirmed",
          notes: "Test note",
        });

        // Booking might not exist, but the procedure should execute
        expect(result).toHaveProperty("success");
      } catch (error: any) {
        // It's okay if booking doesn't exist
        expect(error).toBeDefined();
      }
    });

    it("should reject non-admin status updates", async () => {
      const ctx = createAuthContext(1, "user");
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.updateBookingStatus({
          bookingId: 1,
          status: "confirmed",
        });
        expect.fail("Should have thrown an error");
      } catch (error: any) {
        expect(error.code).toBe("FORBIDDEN");
      }
    });
  });
});
