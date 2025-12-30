CREATE TABLE "public"."site_logs" (
    "id" bigint NOT NULL,
    "project_id" bigint NOT NULL,
    "image_url" text,
    "notes" text,
    "markup_data" jsonb,
    "location_data" jsonb,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "public"."site_logs" OWNER TO "postgres";

CREATE SEQUENCE "public"."site_logs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."site_logs_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."site_logs_id_seq" OWNED BY "public"."site_logs"."id";

ALTER TABLE ONLY "public"."site_logs" ALTER COLUMN "id" SET DEFAULT nextval('public.site_logs_id_seq'::regclass);

ALTER TABLE ONLY "public"."site_logs"
    ADD CONSTRAINT "site_logs_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."site_logs"
    ADD CONSTRAINT "site_logs_project_id_fkey" FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;
