import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const app = new Hono();

app.use('*', logger(console.log));
app.use("/*", cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

function generateId() {
  return crypto.randomUUID();
}

function generateTrackingId(prefix: string) {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return `${prefix}-${year}-${random}`;
}

function now() {
  return new Date().toISOString();
}

/* ===================== COMPLAINTS ===================== */

app.post("/make-server-7cad94aa/complaints", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, serviceProvider, category, description } = body;

    const id = generateId();
    const trackingId = generateTrackingId("COMP");

    const { data, error } = await supabase
      .from("complaints")
      .insert([
        {
          id,
          tracking_id: trackingId,
          name,
          email,
          phone,
          provider: serviceProvider,
          category,
          description,
          status: "Submitted",
          created_at: now(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return c.json({ trackingId, complaint: data });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to submit complaint" }, 500);
  }
});

app.get("/make-server-7cad94aa/admin/complaints", async (c) => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ complaints: data });
});

app.put("/make-server-7cad94aa/admin/complaints/:id", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  const { data, error } = await supabase
    .from("complaints")
    .update({
      status,
      updated_at: now(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ complaint: data });
});

/* ===================== LICENSES ===================== */

app.post("/make-server-7cad94aa/licenses", async (c) => {
  try {
    const body = await c.req.json();
    const { companyName, registrationNumber, contactPerson, email, phone, address, licenseType } = body;

    const id = generateId();
    const trackingId = generateTrackingId("LIC");

    const { data, error } = await supabase
      .from("license_applications")
      .insert([
        {
          id,
          tracking_id: trackingId,
          company_name: companyName,
          registration_number: registrationNumber || "",
          contact_person: contactPerson,
          email,
          phone,
          address: address || "",
          license_type: licenseType,
          status: "Submitted",
          created_at: now(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return c.json({ trackingId, license: data });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to submit license" }, 500);
  }
});

app.get("/make-server-7cad94aa/admin/licenses", async (c) => {
  const { data, error } = await supabase
    .from("license_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ licenses: data });
});

app.put("/make-server-7cad94aa/admin/licenses/:id", async (c) => {
  const id = c.req.param("id");
  const { status } = await c.req.json();

  const { data, error } = await supabase
    .from("license_applications")
    .update({
      status,
      updated_at: now(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return c.json({ error: error.message }, 500);

  return c.json({ license: data });
});

/* ===================== TRACKING ===================== */

app.get("/make-server-7cad94aa/tracking/:trackingId", async (c) => {
  const trackingId = c.req.param("trackingId");

  const { data: complaint } = await supabase
    .from("complaints")
    .select("*")
    .eq("tracking_id", trackingId)
    .single();

  if (complaint) {
    return c.json({ item: { ...complaint, type: "complaint" } });
  }

  const { data: license } = await supabase
    .from("license_applications")
    .select("*")
    .eq("tracking_id", trackingId)
    .single();

  if (license) {
    return c.json({ item: { ...license, type: "license" } });
  }

  return c.json({ error: "Tracking ID not found" }, 404);
});

/* ===================== STATISTICS ===================== */

app.get("/make-server-7cad94aa/statistics", async (c) => {
  const { count: complaints } = await supabase
    .from("complaints")
    .select("*", { count: "exact", head: true });

  const { count: licenses } = await supabase
    .from("license_applications")
    .select("*", { count: "exact", head: true });

  return c.json({
    statistics: [
      { label: "Total Complaints", value: complaints || 0 },
      { label: "Total Licenses", value: licenses || 0 },
    ],
  });
});

Deno.serve(app.fetch);
