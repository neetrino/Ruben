import "server-only";

import { and, count, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";

import { getDb } from "@/db/client";
import { orders } from "@/db/schema";
import type { OrderStatus } from "@/features/orders/domain/order-status";

export type AnalyticsSalesBucket = {
  key: string;
  label: string;
  orderCount: number;
  revenueAmount: number;
};

export type AnalyticsTopCustomer = {
  customerKey: string;
  userId: string | null;
  name: string;
  email: string;
  orderCount: number;
  revenueAmount: number;
};

function revenueWhere(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
}) {
  return and(
    eq(orders.isArchived, false),
    gte(orders.placedAt, input.start),
    lte(orders.placedAt, input.end),
    inArray(orders.status, input.revenueStatuses),
  );
}

function bucketStartExpr(
  truncUnit: "day" | "week" | "month",
): ReturnType<typeof sql<string>> {
  if (truncUnit === "week") {
    return sql<string>`to_char(date_trunc('week', ${orders.placedAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  }
  if (truncUnit === "month") {
    return sql<string>`to_char(date_trunc('month', ${orders.placedAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
  }
  return sql<string>`to_char(date_trunc('day', ${orders.placedAt} at time zone 'UTC'), 'YYYY-MM-DD')`;
}

async function queryBestBucket(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
  truncUnit: "day" | "week" | "month";
}): Promise<AnalyticsSalesBucket | null> {
  const bucketExpr = bucketStartExpr(input.truncUnit);
  const [row] = await getDb()
    .select({
      key: bucketExpr,
      orderCount: count(),
      revenueAmount: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(
        Number,
      ),
    })
    .from(orders)
    .where(revenueWhere(input))
    .groupBy(bucketExpr)
    .orderBy(desc(sql`sum(${orders.totalAmount})`))
    .limit(1);

  if (!row) {
    return null;
  }

  return {
    key: row.key,
    label: formatBucketLabel(row.key, input.truncUnit),
    orderCount: row.orderCount,
    revenueAmount: row.revenueAmount,
  };
}

function formatBucketLabel(
  isoDate: string,
  truncUnit: "day" | "week" | "month",
): string {
  const date = new Date(`${isoDate}T00:00:00.000Z`);
  if (truncUnit === "day") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  if (truncUnit === "week") {
    const weekEnd = new Date(date);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    const startLabel = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
    const endLabel = weekEnd.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });
    return `${startLabel} – ${endLabel}`;
  }
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Best revenue day, ISO week, and calendar month inside the analytics window. */
export async function queryBestSalesPeriods(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
}): Promise<{
  bestDay: AnalyticsSalesBucket | null;
  bestWeek: AnalyticsSalesBucket | null;
  bestMonth: AnalyticsSalesBucket | null;
}> {
  const [bestDay, bestWeek, bestMonth] = await Promise.all([
    queryBestBucket({ ...input, truncUnit: "day" }),
    queryBestBucket({ ...input, truncUnit: "week" }),
    queryBestBucket({ ...input, truncUnit: "month" }),
  ]);

  return { bestDay, bestWeek, bestMonth };
}

async function queryTopCustomers(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
  orderBy: "revenue" | "orders";
  limit?: number;
}): Promise<AnalyticsTopCustomer[]> {
  const limit = input.limit ?? 5;
  const customerKey = sql<string>`coalesce(${orders.userId}::text, ${orders.contactEmail})`;
  const orderExpr =
    input.orderBy === "revenue"
      ? desc(sql`sum(${orders.totalAmount})`)
      : desc(count());

  const rows = await getDb()
    .select({
      customerKey,
      userId: orders.userId,
      name: sql<string>`max(${orders.contactName})`,
      email: sql<string>`max(${orders.contactEmail})`,
      orderCount: count(),
      revenueAmount: sql<number>`coalesce(sum(${orders.totalAmount}), 0)`.mapWith(
        Number,
      ),
    })
    .from(orders)
    .where(revenueWhere(input))
    .groupBy(customerKey, orders.userId)
    .orderBy(orderExpr)
    .limit(limit);

  return rows.map((row) => ({
    customerKey: row.customerKey,
    userId: row.userId,
    name: row.name,
    email: row.email,
    orderCount: row.orderCount,
    revenueAmount: row.revenueAmount,
  }));
}

/** Highest-revenue customers in the analytics window. */
export async function queryBestCustomersByRevenue(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
  limit?: number;
}): Promise<AnalyticsTopCustomer[]> {
  return queryTopCustomers({ ...input, orderBy: "revenue" });
}

/** Customers with the most orders in the analytics window. */
export async function queryTopCustomersByOrderCount(input: {
  start: Date;
  end: Date;
  revenueStatuses: OrderStatus[];
  limit?: number;
}): Promise<AnalyticsTopCustomer[]> {
  return queryTopCustomers({ ...input, orderBy: "orders" });
}
