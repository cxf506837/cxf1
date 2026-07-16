from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class Settings:
    app_name: str = "AI OrderOps Workbench"
    storage_root: Path = Path(os.getenv("ORDEROPS_STORAGE_ROOT", "storage"))
    openai_enabled: bool = bool(os.getenv("OPENAI_API_KEY"))
    mock_model_enabled: bool = os.getenv("MOCK_MODEL_ENABLED", "true").lower() == "true"


settings = Settings()

