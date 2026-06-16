from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import sys


BACKEND_DIR = Path(__file__).resolve().parent / "backend"
BACKEND_APP_PATH = BACKEND_DIR / "app.py"

if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

spec = spec_from_file_location("agrimind_backend_app", BACKEND_APP_PATH)

if spec is None or spec.loader is None:
    raise RuntimeError(f"Could not load backend app from {BACKEND_APP_PATH}")

backend_app = module_from_spec(spec)
spec.loader.exec_module(backend_app)

app = backend_app.app
