BEGIN;

-- Assumption: You have a role for your application, e.g., 'app_user' or 'authenticated'.
-- The owner of these functions should be a highly privileged user, e.g., 'postgres' or a dedicated 'service_role'.

-- Function to create an invoice securely.
CREATE OR REPLACE FUNCTION public.create_invoice(
    p_project_id BIGINT,
    p_client_id UUID,
    p_amount NUMERIC(10, 2),
    p_due_date DATE,
    p_milestone_id BIGINT DEFAULT NULL
)
RETURNS public.invoices
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    new_invoice public.invoices;
    org_id BIGINT;
BEGIN
    -- The function runs as the definer, but we still need to check the calling user's permissions.
    -- This uses the get_my_organization_id() function from your RLS policies.
    SELECT public.get_my_organization_id() INTO org_id;
    IF org_id IS NULL THEN
        RAISE EXCEPTION 'You do not have permission to create invoices.';
    END IF;

    INSERT INTO public.invoices(
        organization_id,
        project_id,
        client_id,
        amount,
        due_date,
        milestone_id,
        status
    )
    VALUES (
        org_id,
        p_project_id,
        p_client_id,
        p_amount,
        p_due_date,
        p_milestone_id,
        'draft'
    )
    RETURNING * INTO new_invoice;

    RETURN new_invoice;
END;
$$;


-- Function to finalize a time log securely.
CREATE OR REPLACE FUNCTION public.stop_time_log(
    p_time_log_id BIGINT
)
RETURNS public.time_logs
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    updated_log public.time_logs;
    log_owner_id UUID;
    org_id BIGINT;
BEGIN
    -- Verify the log exists and get its owner and organization.
    SELECT user_id, organization_id
    INTO log_owner_id, org_id
    FROM public.time_logs
    WHERE id = p_time_log_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Time log not found.';
    END IF;

    -- Ensure the user calling the function is the one who started the log.
    -- auth.uid() is the currently authenticated user.
    IF log_owner_id IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'You can only stop your own time logs.';
    END IF;

    UPDATE public.time_logs
    SET
        end_time = NOW(),
        duration_minutes = EXTRACT(EPOCH FROM (NOW() - start_time)) / 60
    WHERE id = p_time_log_id
    RETURNING * INTO updated_log;

    RETURN updated_log;
END;
$$;


COMMIT;