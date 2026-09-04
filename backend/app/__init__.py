import os
from flask import Flask, jsonify
from flask_cors import CORS

def create_app(config_name="development"):
    app = Flask(__name__)
    
    # Load configuration
    from app.config import config_by_name
    app.config.from_object(config_by_name.get(config_name, "development"))
    
    # Setup CORS for Web Portals (React) and Mobile App (Flutter)
    origins = app.config.get("CORS_ORIGINS", "*").split(",")
    CORS(app, resources={r"/api/*": {"origins": origins}}, supports_credentials=True)
    
    # Register Error Handlers
    from app.middleware.error_handler import register_error_handlers
    register_error_handlers(app)
    
    # Register API Blueprints
    from app.routes.auth import auth_bp
    from app.routes.problems import problems_bp
    from app.routes.government import government_bp
    from app.routes.universities import universities_bp
    from app.routes.industry import industry_bp
    from app.routes.projects import projects_bp
    from app.routes.teams import teams_bp
    from app.routes.funding import funding_bp
    from app.routes.notifications import notifications_bp
    from app.routes.analytics import analytics_bp
    from app.routes.voice_agent import voice_agent_bp
    from app.routes.version import version_bp
    
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(problems_bp, url_prefix="/api/v1/problems")
    app.register_blueprint(government_bp, url_prefix="/api/v1/government")
    app.register_blueprint(universities_bp, url_prefix="/api/v1/universities")
    app.register_blueprint(industry_bp, url_prefix="/api/v1/industry")
    app.register_blueprint(projects_bp, url_prefix="/api/v1/projects")
    app.register_blueprint(teams_bp, url_prefix="/api/v1/teams")
    app.register_blueprint(funding_bp, url_prefix="/api/v1/funding")
    app.register_blueprint(notifications_bp, url_prefix="/api/v1/notifications")
    app.register_blueprint(analytics_bp, url_prefix="/api/v1/analytics")
    app.register_blueprint(voice_agent_bp, url_prefix="/api/v1/voice")
    app.register_blueprint(version_bp, url_prefix="/api/v1/app")
    
    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "SIH26043 Backend API",
            "version": "1.0.0"
        }), 200

    return app
