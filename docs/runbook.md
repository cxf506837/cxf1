# Runbook

## Demo Flow

1. Start Docker Compose.
2. Open the frontend.
3. Click "生成脱敏演示任务".
4. Review metrics on the home page.
5. Open the task detail page and download the generated Excel.
6. Open the rules page to show candidate rules.

## Review Story

The demo has one intentionally risky field: a delivery name containing `?`. The system does not guess this value. It routes the field to manual review and keeps the rest of the order traceable.

## Upgrade Path

- Replace synthetic parser with production PDF parsing adapters.
- Add Redis/Celery if long-running jobs are needed.
- Add authenticated users and role-based access for a real SaaS deployment.
- Keep customer data out of portfolio repositories.

