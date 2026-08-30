from datetime import datetime

NOTIFICATIONS_DB = [
    {
        "id": "notif-1",
        "userId": "user-gov-01",
        "title": "New High Priority Grievance",
        "message": "A high-severity water pipeline overflow was reported in Sector 4.",
        "read": False,
        "createdAt": datetime.utcnow().isoformat() + "Z"
    }
]

class NotificationService:
    @staticmethod
    def get_user_notifications(user_id):
        return NOTIFICATIONS_DB

    @staticmethod
    def send_notification(user_id, title, message):
        notif = {
            "id": f"notif-{len(NOTIFICATIONS_DB) + 1}",
            "userId": user_id,
            "title": title,
            "message": message,
            "read": False,
            "createdAt": datetime.utcnow().isoformat() + "Z"
        }
        NOTIFICATIONS_DB.append(notif)
        return notif
