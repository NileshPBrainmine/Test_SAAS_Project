-- Location: supabase/migrations/20250103070000_advertising_analytics.sql
-- Schema Analysis: Existing schema has analytics_data, analytics_summary, social_accounts, organizations
-- Integration Type: Addition - Adding advertising platforms and campaign tracking
-- Dependencies: organizations, user_profiles

-- 1. Types and Enums
CREATE TYPE public.ad_platform AS ENUM ('facebook_ads', 'google_ads', 'linkedin_ads', 'twitter_ads', 'tiktok_ads', 'snapchat_ads');
CREATE TYPE public.campaign_status AS ENUM ('active', 'paused', 'completed', 'archived');
CREATE TYPE public.ad_objective AS ENUM ('awareness', 'traffic', 'engagement', 'leads', 'conversions', 'sales', 'app_installs', 'video_views');
CREATE TYPE public.bid_strategy AS ENUM ('cpc', 'cpm', 'cpa', 'roas', 'auto');

-- 2. Core Advertising Tables
CREATE TABLE public.ad_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    platform public.ad_platform NOT NULL,
    account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    access_token TEXT,
    is_active BOOLEAN DEFAULT true,
    daily_budget DECIMAL(10,2),
    monthly_budget DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ad_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_account_id UUID REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
    campaign_id TEXT NOT NULL,
    campaign_name TEXT NOT NULL,
    objective public.ad_objective,
    status public.campaign_status DEFAULT 'active'::public.campaign_status,
    bid_strategy public.bid_strategy DEFAULT 'auto'::public.bid_strategy,
    daily_budget DECIMAL(10,2),
    lifetime_budget DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    target_audience JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ad_sets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
    ad_set_id TEXT NOT NULL,
    ad_set_name TEXT NOT NULL,
    status public.campaign_status DEFAULT 'active'::public.campaign_status,
    bid_amount DECIMAL(10,4),
    daily_budget DECIMAL(10,2),
    targeting JSONB,
    placement JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ad_creatives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_set_id UUID REFERENCES public.ad_sets(id) ON DELETE CASCADE,
    creative_id TEXT NOT NULL,
    creative_name TEXT NOT NULL,
    creative_type TEXT,
    headline TEXT,
    description TEXT,
    call_to_action TEXT,
    image_url TEXT,
    video_url TEXT,
    thumbnail_url TEXT,
    status public.campaign_status DEFAULT 'active'::public.campaign_status,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Performance Data Tables
CREATE TABLE public.ad_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    ad_account_id UUID REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE SET NULL,
    ad_set_id UUID REFERENCES public.ad_sets(id) ON DELETE SET NULL,
    creative_id UUID REFERENCES public.ad_creatives(id) ON DELETE SET NULL,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    spend DECIMAL(10,2) DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    cpc DECIMAL(10,4) DEFAULT 0,
    cpm DECIMAL(10,4) DEFAULT 0,
    cpa DECIMAL(10,2) DEFAULT 0,
    roas DECIMAL(10,4) DEFAULT 0,
    ctr DECIMAL(5,4) DEFAULT 0,
    conversion_rate DECIMAL(5,4) DEFAULT 0,
    frequency DECIMAL(5,2) DEFAULT 0,
    reach INTEGER DEFAULT 0,
    video_views INTEGER DEFAULT 0,
    video_view_rate DECIMAL(5,4) DEFAULT 0,
    cost_per_video_view DECIMAL(10,4) DEFAULT 0,
    link_clicks INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.ad_attribution (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
    conversion_type TEXT NOT NULL,
    attribution_window TEXT DEFAULT '28d_click_1d_view',
    conversions INTEGER DEFAULT 0,
    conversion_value DECIMAL(10,2) DEFAULT 0,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.audience_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_account_id UUID REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE CASCADE,
    audience_type TEXT, -- 'demographics', 'interests', 'behaviors', 'lookalike'
    audience_data JSONB NOT NULL,
    performance_score DECIMAL(3,2), -- 0.00 to 1.00
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Budget and Bidding Tables
CREATE TABLE public.budget_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    ad_account_id UUID REFERENCES public.ad_accounts(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.ad_campaigns(id) ON DELETE SET NULL,
    alert_type TEXT NOT NULL, -- 'budget_exceeded', 'low_performance', 'high_frequency'
    threshold_value DECIMAL(10,2),
    current_value DECIMAL(10,2),
    message TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Essential Indexes
CREATE INDEX idx_ad_accounts_organization_id ON public.ad_accounts(organization_id);
CREATE INDEX idx_ad_accounts_platform ON public.ad_accounts(platform);
CREATE INDEX idx_ad_campaigns_ad_account_id ON public.ad_campaigns(ad_account_id);
CREATE INDEX idx_ad_campaigns_status ON public.ad_campaigns(status);
CREATE INDEX idx_ad_sets_campaign_id ON public.ad_sets(campaign_id);
CREATE INDEX idx_ad_creatives_ad_set_id ON public.ad_creatives(ad_set_id);
CREATE INDEX idx_ad_performance_organization_id ON public.ad_performance(organization_id);
CREATE INDEX idx_ad_performance_date ON public.ad_performance(date);
CREATE INDEX idx_ad_performance_campaign_id ON public.ad_performance(campaign_id);
CREATE INDEX idx_ad_attribution_campaign_id ON public.ad_attribution(campaign_id);
CREATE INDEX idx_ad_attribution_date ON public.ad_attribution(date);
CREATE INDEX idx_audience_insights_campaign_id ON public.audience_insights(campaign_id);
CREATE INDEX idx_budget_alerts_organization_id ON public.budget_alerts(organization_id);

-- 6. Unique Constraints (Fixed: Separate constraints to avoid type comparison issues)
ALTER TABLE public.ad_accounts ADD CONSTRAINT uq_ad_accounts_org_platform_account UNIQUE (organization_id, platform, account_id);
ALTER TABLE public.ad_performance ADD CONSTRAINT uq_ad_performance_daily UNIQUE (ad_account_id, campaign_id, ad_set_id, creative_id, date);
ALTER TABLE public.ad_attribution ADD CONSTRAINT uq_ad_attribution_daily UNIQUE (campaign_id, conversion_type, attribution_window, date);

-- 7. Helper Functions (Use existing parameter name to avoid conflict)
CREATE OR REPLACE FUNCTION public.calculate_roas(revenue_val DECIMAL, spend_val DECIMAL)
RETURNS DECIMAL
LANGUAGE sql
IMMUTABLE
AS $$
SELECT CASE 
    WHEN spend_val > 0 THEN revenue_val / spend_val
    ELSE 0
END
$$;

-- 8. Enable RLS
ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_attribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audience_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_alerts ENABLE ROW LEVEL SECURITY;

-- 9. RLS Policies using existing user_has_org_access function with correct parameter name
CREATE POLICY "org_members_view_ad_accounts"
ON public.ad_accounts
FOR ALL
TO authenticated
USING (public.user_has_org_access(organization_id))
WITH CHECK (public.user_has_org_access(organization_id));

CREATE POLICY "org_members_view_ad_campaigns"
ON public.ad_campaigns
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.ad_accounts aa
    WHERE aa.id = ad_account_id AND public.user_has_org_access(aa.organization_id)
));

CREATE POLICY "org_members_view_ad_sets"
ON public.ad_sets
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.ad_campaigns ac
    JOIN public.ad_accounts aa ON ac.ad_account_id = aa.id
    WHERE ac.id = campaign_id AND public.user_has_org_access(aa.organization_id)
));

CREATE POLICY "org_members_view_ad_creatives"
ON public.ad_creatives
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.ad_sets ads
    JOIN public.ad_campaigns ac ON ads.campaign_id = ac.id
    JOIN public.ad_accounts aa ON ac.ad_account_id = aa.id
    WHERE ads.id = ad_set_id AND public.user_has_org_access(aa.organization_id)
));

CREATE POLICY "org_members_view_ad_performance"
ON public.ad_performance
FOR ALL
TO authenticated
USING (public.user_has_org_access(organization_id))
WITH CHECK (public.user_has_org_access(organization_id));

CREATE POLICY "org_members_view_ad_attribution"
ON public.ad_attribution
FOR ALL
TO authenticated
USING (public.user_has_org_access(organization_id))
WITH CHECK (public.user_has_org_access(organization_id));

CREATE POLICY "org_members_view_audience_insights"
ON public.audience_insights
FOR ALL
TO authenticated
USING (EXISTS (
    SELECT 1 FROM public.ad_accounts aa
    WHERE aa.id = ad_account_id AND public.user_has_org_access(aa.organization_id)
));

CREATE POLICY "org_members_view_budget_alerts"
ON public.budget_alerts
FOR ALL
TO authenticated
USING (public.user_has_org_access(organization_id))
WITH CHECK (public.user_has_org_access(organization_id));

-- 10. Triggers for updated_at (handle_updated_at function already exists)
CREATE TRIGGER handle_ad_accounts_updated_at
    BEFORE UPDATE ON public.ad_accounts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ad_campaigns_updated_at
    BEFORE UPDATE ON public.ad_campaigns
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ad_sets_updated_at
    BEFORE UPDATE ON public.ad_sets
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_ad_creatives_updated_at
    BEFORE UPDATE ON public.ad_creatives
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 11. Mock Data for Testing
DO $$
DECLARE
    org_id UUID;
    facebook_account_id UUID := gen_random_uuid();
    google_account_id UUID := gen_random_uuid();
    facebook_campaign_id UUID := gen_random_uuid();
    google_campaign_id UUID := gen_random_uuid();
    facebook_ad_set_id UUID := gen_random_uuid();
    google_ad_set_id UUID := gen_random_uuid();
    facebook_creative_id UUID := gen_random_uuid();
    google_creative_id UUID := gen_random_uuid();
BEGIN
    -- Get existing organization
    SELECT id INTO org_id FROM public.organizations LIMIT 1;
    
    IF org_id IS NOT NULL THEN
        -- Insert ad accounts
        INSERT INTO public.ad_accounts (id, organization_id, platform, account_id, account_name, currency, daily_budget, monthly_budget) VALUES
            (facebook_account_id, org_id, 'facebook_ads'::public.ad_platform, 'act_123456789', 'Main Facebook Ad Account', 'USD', 100.00, 3000.00),
            (google_account_id, org_id, 'google_ads'::public.ad_platform, '987654321', 'Primary Google Ads Account', 'USD', 150.00, 4500.00);

        -- Insert campaigns
        INSERT INTO public.ad_campaigns (id, ad_account_id, campaign_id, campaign_name, objective, daily_budget, start_date) VALUES
            (facebook_campaign_id, facebook_account_id, 'fb_camp_001', 'Brand Awareness Campaign', 'awareness'::public.ad_objective, 50.00, CURRENT_DATE),
            (google_campaign_id, google_account_id, 'google_camp_001', 'Lead Generation Campaign', 'leads'::public.ad_objective, 75.00, CURRENT_DATE);

        -- Insert ad sets
        INSERT INTO public.ad_sets (id, campaign_id, ad_set_id, ad_set_name, daily_budget, targeting) VALUES
            (facebook_ad_set_id, facebook_campaign_id, 'fb_set_001', 'Young Adults 25-35', 25.00, '{"age_min": 25, "age_max": 35, "interests": ["technology", "fitness"]}'::jsonb),
            (google_ad_set_id, google_campaign_id, 'google_set_001', 'Business Owners', 40.00, '{"keywords": ["business software", "productivity tools"], "locations": ["US", "CA", "UK"]}'::jsonb);

        -- Insert creatives
        INSERT INTO public.ad_creatives (id, ad_set_id, creative_id, creative_name, creative_type, headline, description, call_to_action) VALUES
            (facebook_creative_id, facebook_ad_set_id, 'fb_creative_001', 'Fitness App Promotion', 'single_image', 'Get Fit in 30 Days', 'Transform your body with our revolutionary fitness app', 'Learn More'),
            (google_creative_id, google_ad_set_id, 'google_creative_001', 'Productivity Tool Ad', 'responsive_search_ad', 'Boost Your Productivity', 'Streamline your workflow with our all-in-one business solution', 'Sign Up');

        -- Insert performance data for the last 7 days
        INSERT INTO public.ad_performance (
            organization_id, ad_account_id, campaign_id, ad_set_id, creative_id, date,
            impressions, clicks, conversions, spend, revenue, cpc, cpm, ctr, conversion_rate, roas
        ) 
        SELECT 
            org_id,
            facebook_account_id,
            facebook_campaign_id,
            facebook_ad_set_id,
            facebook_creative_id,
            CURRENT_DATE - generate_series(0, 6),
            floor(random() * 10000 + 1000)::integer,
            floor(random() * 500 + 50)::integer,
            floor(random() * 20 + 1)::integer,
            round((random() * 100 + 10)::numeric, 2),
            round((random() * 200 + 20)::numeric, 2),
            round((random() * 2 + 0.5)::numeric, 4),
            round((random() * 10 + 2)::numeric, 4),
            round((random() * 0.1 + 0.01)::numeric, 4),
            round((random() * 0.05 + 0.005)::numeric, 4),
            round((random() * 3 + 1)::numeric, 4);

        -- Insert Google Ads performance data
        INSERT INTO public.ad_performance (
            organization_id, ad_account_id, campaign_id, ad_set_id, creative_id, date,
            impressions, clicks, conversions, spend, revenue, cpc, cpm, ctr, conversion_rate, roas
        ) 
        SELECT 
            org_id,
            google_account_id,
            google_campaign_id,
            google_ad_set_id,
            google_creative_id,
            CURRENT_DATE - generate_series(0, 6),
            floor(random() * 8000 + 2000)::integer,
            floor(random() * 400 + 80)::integer,
            floor(random() * 25 + 5)::integer,
            round((random() * 150 + 20)::numeric, 2),
            round((random() * 400 + 50)::numeric, 2),
            round((random() * 3 + 1)::numeric, 4),
            round((random() * 15 + 5)::numeric, 4),
            round((random() * 0.08 + 0.02)::numeric, 4),
            round((random() * 0.08 + 0.01)::numeric, 4),
            round((random() * 4 + 1.5)::numeric, 4);

        -- Insert attribution data
        INSERT INTO public.ad_attribution (organization_id, campaign_id, conversion_type, conversions, conversion_value, date) VALUES
            (org_id, facebook_campaign_id, 'purchase', 15, 1500.00, CURRENT_DATE),
            (org_id, facebook_campaign_id, 'lead', 25, 250.00, CURRENT_DATE),
            (org_id, google_campaign_id, 'purchase', 20, 2000.00, CURRENT_DATE),
            (org_id, google_campaign_id, 'lead', 35, 350.00, CURRENT_DATE);

        -- Insert audience insights
        INSERT INTO public.audience_insights (ad_account_id, campaign_id, audience_type, audience_data, performance_score, date) VALUES
            (facebook_account_id, facebook_campaign_id, 'demographics', '{"age_group": "25-34", "gender": "male", "performance": "high"}'::jsonb, 0.85, CURRENT_DATE),
            (google_account_id, google_campaign_id, 'interests', '{"category": "business_software", "affinity": "high", "reach": 50000}'::jsonb, 0.78, CURRENT_DATE);

        -- Insert budget alerts
        INSERT INTO public.budget_alerts (organization_id, ad_account_id, campaign_id, alert_type, threshold_value, current_value, message) VALUES
            (org_id, facebook_account_id, facebook_campaign_id, 'budget_exceeded', 50.00, 55.00, 'Daily budget exceeded for Brand Awareness Campaign'),
            (org_id, google_account_id, google_campaign_id, 'low_performance', 2.00, 3.50, 'CPA is higher than target for Lead Generation Campaign');
    
    ELSE
        RAISE NOTICE 'No organization found. Create an organization first.';
    END IF;
END $$;