CREATE TABLE "food_recognitions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"image_url" varchar NOT NULL,
	"recognized_items" jsonb NOT NULL,
	"suggested_recipes" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "google_play_purchases" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"purchase_token" varchar NOT NULL,
	"product_id" varchar NOT NULL,
	"package_name" varchar NOT NULL,
	"purchase_time" timestamp NOT NULL,
	"purchase_state" integer NOT NULL,
	"consumption_state" integer NOT NULL,
	"auto_renewing" boolean DEFAULT false,
	"acknowledged" boolean DEFAULT false,
	"subscription_id" varchar,
	"order_id" varchar,
	"verified_at" timestamp,
	"verification_method" varchar DEFAULT 'google_play_api',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "google_play_purchases_purchase_token_unique" UNIQUE("purchase_token")
);
--> statement-breakpoint
CREATE TABLE "menu_plans" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"name" varchar NOT NULL,
	"week_start_date" timestamp NOT NULL,
	"preferences" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipe_library" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"meal_type" varchar NOT NULL,
	"cuisine" varchar,
	"dietary_tags" jsonb DEFAULT '[]',
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"nutrition_info" jsonb NOT NULL,
	"cooking_time" integer NOT NULL,
	"servings" integer NOT NULL,
	"difficulty" varchar DEFAULT 'medium',
	"estimated_cost" real,
	"seasonal_tags" jsonb DEFAULT '[]',
	"allergens" jsonb DEFAULT '[]',
	"is_approved" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recipes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_plan_id" varchar NOT NULL,
	"day_of_week" integer NOT NULL,
	"meal_type" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" text,
	"ingredients" jsonb NOT NULL,
	"instructions" jsonb NOT NULL,
	"nutrition_info" jsonb,
	"cooking_time" integer,
	"servings" integer DEFAULT 4,
	"image_url" varchar,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shopping_lists" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"menu_plan_id" varchar NOT NULL,
	"items" jsonb NOT NULL,
	"total_estimated_cost" real,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"provider" varchar DEFAULT 'email',
	"provider_id" varchar,
	"is_email_verified" boolean DEFAULT false,
	"is_premium" boolean DEFAULT false,
	"subscription_status" varchar DEFAULT 'free',
	"google_play_purchase_token" varchar,
	"subscription_id" varchar,
	"purchase_time" timestamp,
	"expiry_time" timestamp,
	"auto_renewing" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "food_recognitions" ADD CONSTRAINT "food_recognitions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "google_play_purchases" ADD CONSTRAINT "google_play_purchases_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "menu_plans" ADD CONSTRAINT "menu_plans_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recipes" ADD CONSTRAINT "recipes_menu_plan_id_menu_plans_id_fk" FOREIGN KEY ("menu_plan_id") REFERENCES "public"."menu_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shopping_lists" ADD CONSTRAINT "shopping_lists_menu_plan_id_menu_plans_id_fk" FOREIGN KEY ("menu_plan_id") REFERENCES "public"."menu_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");