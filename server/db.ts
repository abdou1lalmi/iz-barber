import { eq, and, gte, lte, isNull, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, bookings, services, availability, blockedDates, reviews } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "phone", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all services
 */
export async function getServices() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(services);
}

/**
 * Get a service by ID
 */
export async function getServiceById(serviceId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get availability for a specific day of week
 */
export async function getAvailabilityByDayOfWeek(dayOfWeek: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(availability).where(eq(availability.dayOfWeek, dayOfWeek)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all availability settings
 */
export async function getAllAvailability() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(availability).orderBy(availability.dayOfWeek);
}

/**
 * Check if a date is blocked
 */
export async function isDateBlocked(date: Date) {
  const db = await getDb();
  if (!db) return false;

  const dateStr = date.toISOString().split('T')[0];
  const result = await db.select().from(blockedDates).where(eq(blockedDates.date, dateStr as any)).limit(1);
  return result.length > 0;
}

/**
 * Get all bookings for a specific date
 */
export async function getBookingsByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];

  const dateStr = date.toISOString().split('T')[0];
  return await db.select().from(bookings).where(eq(bookings.appointmentDate, dateStr as any));
}

/**
 * Get all upcoming bookings for a client
 */
export async function getClientBookings(clientId: number) {
  const db = await getDb();
  if (!db) return [];

  const today = new Date().toISOString().split('T')[0];
  return await db.select().from(bookings)
    .where(and(
      eq(bookings.clientId, clientId),
      gte(bookings.appointmentDate, today as any)
    ))
    .orderBy(bookings.appointmentDate);
}

/**
 * Get all bookings (admin view)
 */
export async function getAllBookings() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(bookings).orderBy(desc(bookings.appointmentDate));
}

/**
 * Get a booking by ID
 */
export async function getBookingById(bookingId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Create a new booking
 */
export async function createBooking(data: {
  clientId: number;
  serviceId: number;
  appointmentDate: string;
  appointmentTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(bookings).values({
    clientId: data.clientId,
    serviceId: data.serviceId,
    appointmentDate: data.appointmentDate as any,
    appointmentTime: data.appointmentTime,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone,
    status: 'pending',
  });

  return result;
}

/**
 * Update booking status
 */
export async function updateBookingStatus(bookingId: number, status: 'pending' | 'confirmed' | 'cancelled' | 'no-show', notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const updateData: any = { status, updatedAt: new Date() };
  if (notes) updateData.notes = notes;

  return await db.update(bookings).set(updateData).where(eq(bookings.id, bookingId));
}

/**
 * Mark reminder as sent for a booking
 */
export async function markReminderSent(bookingId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.update(bookings).set({ reminderSent: true }).where(eq(bookings.id, bookingId));
}

/**
 * Get all bookings that need reminders (tomorrow, not yet sent)
 */
export async function getBookingsNeedingReminders() {
  const db = await getDb();
  if (!db) return [];

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  return await db.select().from(bookings)
    .where(and(
      eq(bookings.appointmentDate, tomorrowStr as any),
      eq(bookings.reminderSent, false),
      eq(bookings.status, 'confirmed')
    ));
}

/**
 * Get all reviews
 */
export async function getReviews() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(reviews).orderBy(desc(reviews.createdAt));
}

/**
 * Create a review
 */
export async function createReview(data: {
  bookingId: number;
  clientId: number;
  rating: number;
  comment?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return await db.insert(reviews).values({
    bookingId: data.bookingId,
    clientId: data.clientId,
    rating: data.rating,
    comment: data.comment,
  });
}

/**
 * Get booking analytics: total bookings, bookings by day of week
 */
export async function getBookingAnalytics() {
  const db = await getDb();
  if (!db) return { totalBookings: 0, bookingsByDayOfWeek: {} };

  const allBookings = await db.select().from(bookings).where(eq(bookings.status, 'confirmed'));

  const bookingsByDayOfWeek: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0
  };

  allBookings.forEach((booking) => {
    const date = new Date(booking.appointmentDate);
    const dayOfWeek = date.getDay();
    bookingsByDayOfWeek[dayOfWeek]++;
  });

  return {
    totalBookings: allBookings.length,
    bookingsByDayOfWeek,
  };
}
