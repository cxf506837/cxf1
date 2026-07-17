from __future__ import annotations

from fastapi import Header, HTTPException

from .config import settings


def require_demo_access(
    x_demo_password: str | None = Header(default=None, alias="X-Demo-Password"),
) -> None:
    """Protect live recruiter demo endpoints when a password is configured."""
    expected = settings.demo_access_password
    if not expected:
        return None
    if x_demo_password == expected:
        return None
    raise HTTPException(status_code=401, detail="访问密码不正确")
