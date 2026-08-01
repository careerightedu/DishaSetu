import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

/**
 * Mirror User Profile to Supabase PostgreSQL 'profiles' table
 */
export async function syncUserProfileToSupabase(uid: string, profile: any) {
  if (!supabase) {
    console.warn("Supabase mirroring skipped: NEXT_PUBLIC_SUPABASE_URL or keys not configured in env.");
    return;
  }

  try {
    const payload = {
      id: uid,
      full_name: profile.fullName || null,
      segment: profile.segment || null,
      city_tier: profile.cityTier || null,
      academic_stream: profile.stream || null,
      degree: profile.degree || null,
      specialization: profile.specialization || null,
      school_board: profile.schoolBoard || null,
      grade: profile.grade || null,
      college_name: profile.collegeName || null,
      job_title: profile.jobTitle || null,
      industry: profile.industry || null,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("profiles")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase profile sync error:", error.message);
    } else {
      console.log(`[Supabase Mirror] Successfully synced profile for user ${uid}`);
    }
  } catch (err) {
    console.warn("Supabase profile sync warning:", err);
  }
}

/**
 * Mirror Assessment Session to Supabase PostgreSQL 'assessment_sessions' table
 */
export async function syncAssessmentSessionToSupabase(uid: string, sessionData: any) {
  if (!supabase) {
    console.warn("Supabase mirroring skipped: NEXT_PUBLIC_SUPABASE_URL or keys not configured in env.");
    return;
  }

  try {
    const payload = {
      id: uid,
      user_id: uid,
      status: sessionData.status || "completed",
      scores: sessionData.scores || {},
      recommendations: sessionData.recommendations || [],
      contextual_summary: sessionData.contextualSummary || {},
      counselor_analysis: sessionData.counselorAnalysis || {},
      archetype: sessionData.archetype || {},
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from("assessment_sessions")
      .upsert(payload, { onConflict: "id" });

    if (error) {
      console.error("Supabase session sync error:", error.message);
    } else {
      console.log(`[Supabase Mirror] Successfully synced assessment session for user ${uid}`);
    }
  } catch (err) {
    console.warn("Supabase session sync warning:", err);
  }
}
