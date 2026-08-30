from flask import Blueprint, jsonify
from app.services.notification_service import NotificationService

notifications_bp = Blueprint("notifications", __name__)

@notifications_bp.route("", methods=["GET"])
def get_notifications():
    notifs = NotificationService.get_user_notifications("user-demo")
    return jsonify({"data": notifs}), 200
