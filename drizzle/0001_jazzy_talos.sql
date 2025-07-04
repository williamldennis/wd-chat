CREATE TABLE "exercise" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exercise_name" text,
	"youtube_demo_short_url" text,
	"youtube_demo_in_depth_url" text,
	"difficulty" text,
	"target_muscle_group" text,
	"prime_mover_muscle" text,
	"secondary_muscle" text,
	"tertiary_muscle" text,
	"primary_equipment" text,
	"primary_equipment_qt" integer,
	"secondary_equipment" text,
	"secondary_equipment_qt" integer,
	"posture" text,
	"single_or_double_arm" text,
	"continuous_or_alternating_arms" text,
	"grip" text,
	"load_position_ending" text,
	"continuous_or_alternating_legs" text,
	"foot_elevation" text,
	"combination_exercises" text,
	"movement_pattern_1" text,
	"movement_pattern_2" text,
	"movement_pattern_3" text,
	"plane_of_motion_1" text,
	"plane_of_motion_2" text,
	"plane_of_motion_3" text,
	"body_region" text,
	"force_type" text,
	"mechanics" text,
	"laterality" text,
	"primary_exercise_classification" text
);
