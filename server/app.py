from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from extensions import init_extensions

def create_app(test_config=None):
    """Create and configure the Nyumba API application."""
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    init_extensions(app)

    from routes.properties import properties_bp
    from routes.units import units_bp
    from routes.tenants import tenants_bp
    from routes.payments import payments_bp
    from routes.maintenance import maintenance_bp

    app.register_blueprint(properties_bp)
    app.register_blueprint(units_bp)
    app.register_blueprint(tenants_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(maintenance_bp)

    @app.get("/api/health")
    def health_check():
        return jsonify({"message": "Nyumba API is running", "status": "ok"})

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)