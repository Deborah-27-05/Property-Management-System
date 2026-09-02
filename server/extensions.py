from flask import jsonify
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

@jwt.unauthorized_loader
def missing_token_callback(reason):
    return jsonify({"error": "Please log in to continue."}), 401


@jwt.invalid_token_loader
def invalid_token_callback(reason):
    return jsonify({"error": "Your session is invalid. Please log in again."}), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": "Your session has expired. Please log in again."}), 401


def init_extensions(app):
    """Attach database services to an application instance."""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)