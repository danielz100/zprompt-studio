// Hand-written until `supabase gen types typescript` is wired (T20).
// Mirrors supabase/migrations 1:1.

export type Locale = "es" | "en";

export interface Pillars {
  core: Record<string, unknown>;
  optics: Record<string, unknown>;
  physics: Record<string, unknown>;
  design: Record<string, unknown>;
  chemistry: Record<string, unknown>;
  void: Record<string, unknown>;
}

export interface ProfileRow {
  id: string;
  username: string | null;
  display_name: string | null;
  locale: Locale;
  telemetry_opt_in: boolean;
  created_at: string;
  updated_at: string;
}

export interface RecipeRow {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  schema_version: number;
  metadata_version: string;
  pillars: Pillars;
  prompt_compiled: string | null;
  thumbnail_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FavoriteRow {
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export type RecipeInsert = Omit<RecipeRow, "id" | "created_at" | "updated_at" | "schema_version" | "metadata_version"> & {
  id?: string;
  schema_version?: number;
  metadata_version?: string;
};

export type RecipeUpdate = Partial<Omit<RecipeRow, "id" | "user_id" | "created_at">>;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Pick<ProfileRow, "id"> & Partial<ProfileRow>;
        Update: Partial<ProfileRow>;
      };
      recipes: {
        Row: RecipeRow;
        Insert: RecipeInsert;
        Update: RecipeUpdate;
      };
      favorites: {
        Row: FavoriteRow;
        Insert: Omit<FavoriteRow, "created_at"> & { created_at?: string };
        Update: never;
      };
    };
  };
}
