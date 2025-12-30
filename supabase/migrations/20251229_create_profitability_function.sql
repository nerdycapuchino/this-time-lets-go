BEGIN;

CREATE OR REPLACE FUNCTION get_profitability_data()
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'projects', (
            SELECT jsonb_agg(p_agg) FROM (
                SELECT
                    p.id,
                    p.name,
                    p.currency,
                    (SELECT COALESCE(jsonb_agg(jsonb_build_object('amount', i.amount, 'status', i.status, 'currency', i.currency)), '[]'::jsonb) FROM invoices i WHERE i.project_id = p.id) as invoices,
                    (SELECT COALESCE(jsonb_agg(jsonb_build_object('id', kc.id, 'title', kc.title, 'budgeted_hours', kc.budgeted_hours, 'time_logs', (
                        SELECT COALESCE(jsonb_agg(jsonb_build_object('duration_minutes', tl.duration_minutes, 'cost', tl.cost, 'currency', tl.currency)), '[]'::jsonb)
                        FROM time_logs tl
                        WHERE tl.kanban_card_id = kc.id
                    ))), '[]'::jsonb) FROM kanban_cards kc WHERE kc.project_id = p.id) as kanban_cards
                FROM projects p
            ) p_agg
        ),
        'monthly', (
             WITH revenue_by_month AS (
                SELECT
                    to_char(date_trunc('month', i.created_at), 'YYYY-MM') as month,
                    SUM(i.amount * COALESCE(er.rate, 1.0)) as total_revenue
                FROM invoices i
                LEFT JOIN exchange_rates er ON i.currency = er.from_currency AND er.to_currency = 'USD'
                WHERE i.status IN ('paid', 'sent')
                GROUP BY 1
            ),
            cost_by_month AS (
                SELECT
                    to_char(date_trunc('month', tl.end_time), 'YYYY-MM') as month,
                    SUM(tl.cost * COALESCE(er.rate, 1.0)) as total_cost
                FROM time_logs tl
                LEFT JOIN exchange_rates er ON tl.currency = er.from_currency AND er.to_currency = 'USD'
                WHERE tl.end_time IS NOT NULL AND tl.cost IS NOT NULL
                GROUP BY 1
            )
            SELECT jsonb_agg(m_agg) FROM (
                SELECT
                    COALESCE(r.month, c.month) as month,
                    r.total_revenue,
                    c.total_cost
                FROM revenue_by_month r
                FULL OUTER JOIN cost_by_month c ON r.month = c.month
                WHERE r.month IS NOT NULL OR c.month IS NOT NULL
                ORDER BY 1
            ) m_agg
        ),
        'exchange_rates', (
            SELECT jsonb_agg(er) FROM exchange_rates er
        )
    ) INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

COMMIT;
