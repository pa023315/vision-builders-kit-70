import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.56.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const jsonResponse = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const githubToken = Deno.env.get("GITHUB_ACTIONS_TOKEN");
    const repository = Deno.env.get("GITHUB_REPOSITORY") ?? "pa023315/vision-builders-kit-70";
    const workflowFile = Deno.env.get("GITHUB_WORKFLOW_FILE") ?? "crowdfunding-tracker.yml";
    const ref = Deno.env.get("GITHUB_REF") ?? "main";
    const authHeader = req.headers.get("Authorization");

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse({ error: "Missing Supabase function environment" }, 500);
    }

    if (!githubToken) {
      return jsonResponse({ error: "Missing GITHUB_ACTIONS_TOKEN secret" }, 500);
    }

    if (!authHeader) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return jsonResponse({ error: "Authentication required" }, 401);
    }

    const githubResponse = await fetch(
      `https://api.github.com/repos/${repository}/actions/workflows/${workflowFile}/dispatches`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({ ref }),
      },
    );

    if (!githubResponse.ok) {
      const errorText = await githubResponse.text();
      return jsonResponse(
        {
          error: "GitHub workflow dispatch failed",
          status: githubResponse.status,
          detail: errorText,
        },
        502,
      );
    }

    return jsonResponse({
      status: "queued",
      repository,
      workflow_file: workflowFile,
      ref,
    });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : String(error) },
      500,
    );
  }
});
