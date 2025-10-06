-- Location: supabase/migrations/20250103064123_socialsync_pro_complete_schema.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new schema for social media management platform
-- Dependencies: None (fresh project)

-- ===============================
-- TYPES AND ENUMS
-- ===============================

CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'editor', 'viewer');
CREATE TYPE public.social_platform AS ENUM ('instagram', 'facebook', 'linkedin', 'twitter', 'tiktok', 'youtube');
CREATE TYPE public.post_status AS ENUM ('draft', 'scheduled', 'published', 'failed');
CREATE TYPE public.content_type AS ENUM ('text', 'image', 'video', 'carousel', 'story');
CREATE TYPE public.approval_status AS ENUM ('pending', 'approved', 'rejected', 'needs_revision');
CREATE TYPE public.team_member_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE public.activity_type AS ENUM (
    'content_created', 'content_published', 'content_scheduled', 'content_approved', 
    'content_rejected', 'team_member_added', 'team_member_removed', 'role_changed',
    'account_connected', 'account_disconnected'
);

-- ===============================
-- CORE TABLES
-- ===============================

-- User profiles table (critical intermediary table)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    role public.user_role DEFAULT 'editor'::public.user_role,
    timezone TEXT DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Organizations/Workspaces
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    subscription_plan TEXT DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Team members
CREATE TABLE public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    role public.user_role DEFAULT 'editor'::public.user_role,
    status public.team_member_status DEFAULT 'active'::public.team_member_status,
    permissions JSONB DEFAULT '{}',
    joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, user_id)
);

-- Social media accounts
CREATE TABLE public.social_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform public.social_platform NOT NULL,
    account_name TEXT NOT NULL,
    account_username TEXT NOT NULL,
    account_id TEXT NOT NULL,
    access_token TEXT,
    refresh_token TEXT,
    is_connected BOOLEAN DEFAULT true,
    follower_count INTEGER DEFAULT 0,
    profile_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, platform, account_id)
);

-- ===============================
-- CONTENT MANAGEMENT
-- ===============================

-- Content posts
CREATE TABLE public.posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    content_type public.content_type DEFAULT 'text'::public.content_type,
    status public.post_status DEFAULT 'draft'::public.post_status,
    scheduled_for TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    approval_status public.approval_status DEFAULT 'pending'::public.approval_status,
    approved_by UUID REFERENCES public.user_profiles(id),
    approved_at TIMESTAMPTZ,
    hashtags TEXT[],
    mention_users TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Post media files
CREATE TABLE public.post_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER,
    alt_text TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Post platform assignments
CREATE TABLE public.post_platforms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    platform_post_id TEXT,
    platform_url TEXT,
    custom_content TEXT,
    engagement_metrics JSONB DEFAULT '{}',
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, social_account_id)
);

-- Content calendar events
CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME,
    event_type TEXT DEFAULT 'post',
    related_post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    color TEXT DEFAULT '#3b82f6',
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- ANALYTICS AND METRICS
-- ===============================

-- Analytics data
CREATE TABLE public.analytics_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    metric_name TEXT NOT NULL,
    metric_value INTEGER NOT NULL,
    metric_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(social_account_id, post_id, metric_name, metric_date)
);

-- Daily analytics summary
CREATE TABLE public.analytics_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    social_account_id UUID REFERENCES public.social_accounts(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    followers_count INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(organization_id, social_account_id, date)
);

-- ===============================
-- COLLABORATION
-- ===============================

-- Activity feed
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    activity_type public.activity_type NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Comments on posts
CREATE TABLE public.post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===============================
-- INDEXES
-- ===============================

CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_organizations_owner_id ON public.organizations(owner_id);
CREATE INDEX idx_team_members_organization_id ON public.team_members(organization_id);
CREATE INDEX idx_team_members_user_id ON public.team_members(user_id);
CREATE INDEX idx_social_accounts_organization_id ON public.social_accounts(organization_id);
CREATE INDEX idx_posts_organization_id ON public.posts(organization_id);
CREATE INDEX idx_posts_author_id ON public.posts(author_id);
CREATE INDEX idx_posts_status ON public.posts(status);
CREATE INDEX idx_posts_scheduled_for ON public.posts(scheduled_for);
CREATE INDEX idx_post_media_post_id ON public.post_media(post_id);
CREATE INDEX idx_post_platforms_post_id ON public.post_platforms(post_id);
CREATE INDEX idx_post_platforms_social_account_id ON public.post_platforms(social_account_id);
CREATE INDEX idx_calendar_events_organization_id ON public.calendar_events(organization_id);
CREATE INDEX idx_calendar_events_event_date ON public.calendar_events(event_date);
CREATE INDEX idx_analytics_data_organization_id ON public.analytics_data(organization_id);
CREATE INDEX idx_analytics_data_metric_date ON public.analytics_data(metric_date);
CREATE INDEX idx_analytics_summary_organization_id ON public.analytics_summary(organization_id);
CREATE INDEX idx_analytics_summary_date ON public.analytics_summary(date);
CREATE INDEX idx_activities_organization_id ON public.activities(organization_id);
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_post_comments_post_id ON public.post_comments(post_id);
CREATE INDEX idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX idx_notifications_read ON public.notifications(read);

-- ===============================
-- FUNCTIONS
-- ===============================

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'editor'::public.user_role)
    );
    RETURN NEW;
END;
$$;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Function to create organization for new user
CREATE OR REPLACE FUNCTION public.create_default_organization()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
DECLARE
    org_id UUID;
BEGIN
    -- Create default organization
    INSERT INTO public.organizations (name, owner_id)
    VALUES (NEW.full_name || '''s Workspace', NEW.id)
    RETURNING id INTO org_id;
    
    -- Add user as admin team member
    INSERT INTO public.team_members (organization_id, user_id, role, status)
    VALUES (org_id, NEW.id, 'admin'::public.user_role, 'active'::public.team_member_status);
    
    RETURN NEW;
END;
$$;

-- ===============================
-- TRIGGERS
-- ===============================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to create default organization
CREATE TRIGGER on_user_profile_created
    AFTER INSERT ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_default_organization();

-- Updated at triggers
CREATE TRIGGER handle_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_social_accounts_updated_at
    BEFORE UPDATE ON public.social_accounts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_post_comments_updated_at
    BEFORE UPDATE ON public.post_comments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ===============================
-- ROW LEVEL SECURITY
-- ===============================

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ===============================
-- RLS POLICIES
-- ===============================

-- User profiles policies (Pattern 1 - Core User Table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Helper function for organization access
CREATE OR REPLACE FUNCTION public.user_has_org_access(org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.team_members tm
    WHERE tm.organization_id = org_id 
    AND tm.user_id = auth.uid()
    AND tm.status = 'active'::public.team_member_status
)
$$;

-- Organizations policies
CREATE POLICY "users_view_accessible_organizations"
ON public.organizations
FOR SELECT
TO authenticated
USING (public.user_has_org_access(id));

CREATE POLICY "owners_manage_organizations"
ON public.organizations
FOR ALL
TO authenticated
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Team members policies
CREATE POLICY "users_view_team_members"
ON public.team_members
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "admins_manage_team_members"
ON public.team_members
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = team_members.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'admin'::public.user_role
        AND tm.status = 'active'::public.team_member_status
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = team_members.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'admin'::public.user_role
        AND tm.status = 'active'::public.team_member_status
    )
);

-- Social accounts policies
CREATE POLICY "org_members_view_social_accounts"
ON public.social_accounts
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "admins_manage_social_accounts"
ON public.social_accounts
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = social_accounts.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = social_accounts.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
);

-- Posts policies
CREATE POLICY "org_members_view_posts"
ON public.posts
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "creators_editors_manage_posts"
ON public.posts
FOR ALL
TO authenticated
USING (
    public.user_has_org_access(organization_id) AND
    (author_id = auth.uid() OR 
     EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = posts.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
     )
    )
)
WITH CHECK (
    public.user_has_org_access(organization_id) AND
    (author_id = auth.uid() OR 
     EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = posts.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
     )
    )
);

-- Post media policies
CREATE POLICY "org_members_view_post_media"
ON public.post_media
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        WHERE p.id = post_media.post_id
        AND public.user_has_org_access(p.organization_id)
    )
);

CREATE POLICY "content_creators_manage_post_media"
ON public.post_media
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.team_members tm ON tm.organization_id = p.organization_id
        WHERE p.id = post_media.post_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.posts p
        JOIN public.team_members tm ON tm.organization_id = p.organization_id
        WHERE p.id = post_media.post_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
);

-- Similar policies for other tables
CREATE POLICY "org_members_view_post_platforms"
ON public.post_platforms
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        WHERE p.id = post_platforms.post_id
        AND public.user_has_org_access(p.organization_id)
    )
);

CREATE POLICY "org_members_view_calendar_events"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "editors_manage_calendar_events"
ON public.calendar_events
FOR ALL
TO authenticated
USING (
    public.user_has_org_access(organization_id) AND
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = calendar_events.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
)
WITH CHECK (
    public.user_has_org_access(organization_id) AND
    EXISTS (
        SELECT 1 FROM public.team_members tm
        WHERE tm.organization_id = calendar_events.organization_id
        AND tm.user_id = auth.uid()
        AND tm.role IN ('admin'::public.user_role, 'manager'::public.user_role, 'editor'::public.user_role)
        AND tm.status = 'active'::public.team_member_status
    )
);

-- Analytics policies
CREATE POLICY "org_members_view_analytics_data"
ON public.analytics_data
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "org_members_view_analytics_summary"
ON public.analytics_summary
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

-- Activity policies
CREATE POLICY "org_members_view_activities"
ON public.activities
FOR SELECT
TO authenticated
USING (public.user_has_org_access(organization_id));

CREATE POLICY "org_members_create_activities"
ON public.activities
FOR INSERT
TO authenticated
WITH CHECK (
    public.user_has_org_access(organization_id) AND 
    user_id = auth.uid()
);

-- Comments policies
CREATE POLICY "org_members_view_post_comments"
ON public.post_comments
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.posts p
        WHERE p.id = post_comments.post_id
        AND public.user_has_org_access(p.organization_id)
    )
);

CREATE POLICY "users_manage_own_post_comments"
ON public.post_comments
FOR ALL
TO authenticated
USING (author_id = auth.uid())
WITH CHECK (author_id = auth.uid());

-- Notifications policies (Pattern 2 - Simple User Ownership)
CREATE POLICY "users_manage_own_notifications"
ON public.notifications
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ===============================
-- STORAGE BUCKETS
-- ===============================

-- Create storage bucket for social media content
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'social-content',
    'social-content',
    true,
    52428800, -- 50MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime', 'video/mpeg']
);

-- Create storage bucket for user profiles
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'profile-images',
    'profile-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- Storage RLS policies
CREATE POLICY "org_members_view_social_content"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'social-content');

CREATE POLICY "authenticated_users_upload_social_content"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'social-content');

CREATE POLICY "users_manage_own_social_content"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'social-content' 
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'social-content' 
    AND owner = auth.uid()
);

CREATE POLICY "public_view_profile_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'profile-images');

CREATE POLICY "users_manage_own_profile_images"
ON storage.objects
FOR ALL
TO authenticated
USING (
    bucket_id = 'profile-images' 
    AND owner = auth.uid()
)
WITH CHECK (
    bucket_id = 'profile-images' 
    AND owner = auth.uid()
);

-- ===============================
-- MOCK DATA
-- ===============================

DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    editor_uuid UUID := gen_random_uuid();
    org1_uuid UUID := gen_random_uuid();
    org2_uuid UUID := gen_random_uuid();
    social_account1_uuid UUID := gen_random_uuid();
    social_account2_uuid UUID := gen_random_uuid();
    post1_uuid UUID := gen_random_uuid();
    post2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@socialsync.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Sarah Johnson", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@socialsync.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Michael Chen", "role": "manager"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (editor_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'editor@socialsync.com', crypt('editor123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Emily Rodriguez", "role": "editor"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create additional organizations (the default ones will be created by triggers)
    INSERT INTO public.organizations (id, name, owner_id, subscription_plan) VALUES
        (org2_uuid, 'Digital Marketing Agency', manager_uuid, 'pro');

    -- Create social media accounts
    INSERT INTO public.social_accounts (id, organization_id, platform, account_name, account_username, account_id, is_connected, follower_count) VALUES
        (social_account1_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'instagram'::public.social_platform, 'SocialSync Pro', '@socialsyncpro', 'inst_123456', true, 15400),
        (social_account2_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'facebook'::public.social_platform, 'SocialSync Pro Business', 'socialsyncpro', 'fb_789012', true, 8250);

    -- Create sample posts
    INSERT INTO public.posts (id, organization_id, author_id, title, content, content_type, status, scheduled_for, hashtags) VALUES
        (post1_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), admin_uuid, 
         'Holiday Season Campaign Launch', 
         '🎄 Get ready for the most wonderful time of the year! Our holiday collection is here with amazing deals and festive vibes. Shop now and spread the joy!', 
         'image'::public.content_type, 'scheduled'::public.post_status, NOW() + INTERVAL '2 days',
         ARRAY['#HolidayShopping', '#FestiveDeals', '#SocialSync']),
        (post2_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), manager_uuid, 
         'Behind the Scenes Content', 
         'Take a look behind the scenes at our content creation process. From brainstorming to publishing, see how we craft engaging social media content! 📸✨', 
         'video'::public.content_type, 'published'::public.post_status, NULL,
         ARRAY['#BehindTheScenes', '#ContentCreation', '#SocialMedia']);

    -- Create post platform assignments
    INSERT INTO public.post_platforms (post_id, social_account_id, engagement_metrics) VALUES
        (post1_uuid, social_account1_uuid, '{"likes": 0, "comments": 0, "shares": 0}'::jsonb),
        (post1_uuid, social_account2_uuid, '{"likes": 0, "comments": 0, "shares": 0}'::jsonb),
        (post2_uuid, social_account1_uuid, '{"likes": 245, "comments": 18, "shares": 12}'::jsonb);

    -- Create calendar events
    INSERT INTO public.calendar_events (organization_id, title, description, event_date, event_time, related_post_id, created_by) VALUES
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'Holiday Campaign Launch', 'Launch our holiday season social media campaign', CURRENT_DATE + INTERVAL '2 days', '10:00:00', post1_uuid, admin_uuid),
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'Weekly Team Meeting', 'Review content performance and plan next week', CURRENT_DATE + INTERVAL '3 days', '14:00:00', NULL, manager_uuid);

    -- Create analytics data
    INSERT INTO public.analytics_summary (organization_id, social_account_id, date, followers_count, engagement_rate, reach, impressions, likes, comments, shares) VALUES
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), social_account1_uuid, CURRENT_DATE - INTERVAL '1 day', 15400, 4.2, 28500, 45200, 1890, 156, 89),
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), social_account2_uuid, CURRENT_DATE - INTERVAL '1 day', 8250, 3.8, 18200, 32100, 1245, 98, 45);

    -- Create activities
    INSERT INTO public.activities (organization_id, user_id, activity_type, description, metadata) VALUES
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), admin_uuid, 'content_created'::public.activity_type, 'created a new Instagram post for the holiday campaign', '{"post_id": "' || post1_uuid || '", "platform": "Instagram"}'::jsonb),
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), manager_uuid, 'content_published'::public.activity_type, 'published the behind-the-scenes video post', '{"post_id": "' || post2_uuid || '", "platform": "Instagram"}'::jsonb),
        ((SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), admin_uuid, 'team_member_added'::public.activity_type, 'invited Emily Rodriguez to join the workspace', '{"role": "Editor"}'::jsonb);

    -- Create post comments
    INSERT INTO public.post_comments (post_id, author_id, content) VALUES
        (post1_uuid, manager_uuid, 'Great concept! I think we should also consider adding a carousel version for Instagram.'),
        (post1_uuid, editor_uuid, 'Love the festive tone! Should we schedule this for both Instagram and Facebook?'),
        (post2_uuid, admin_uuid, 'Excellent engagement on this post! The behind-the-scenes content really resonates with our audience.');

    -- Create notifications
    INSERT INTO public.notifications (user_id, organization_id, title, message, type, read) VALUES
        (admin_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'New Comment', 'Michael Chen commented on your holiday campaign post', 'comment', false),
        (manager_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'Content Scheduled', 'Your behind-the-scenes post has been scheduled for tomorrow', 'schedule', false),
        (editor_uuid, (SELECT id FROM public.organizations WHERE owner_id = admin_uuid LIMIT 1), 'Welcome to the team!', 'You have been added to SocialSync Pro workspace', 'team', true);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;