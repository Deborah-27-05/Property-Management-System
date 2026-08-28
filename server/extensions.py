from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
migrate = Migrate()


def init_extensions(app):
    """Attach database services to an application instance."""
    db.init_app(app)
    migrate.init_app(app, db)
