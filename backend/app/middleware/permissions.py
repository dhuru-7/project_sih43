from functools import wraps
from flask import jsonify

def roles_required(*allowed_roles):
    def decorator(f):
        @wraps(f)
        def decorated_function(current_user, *args, **kwargs):
            user_role = current_user.get("role")
            if user_role not in allowed_roles and "ADMIN" not in allowed_roles:
                return jsonify({
                    "error": "Forbidden: You do not have permission to access this resource",
                    "required_roles": list(allowed_roles),
                    "user_role": user_role
                }), 403
            return f(current_user, *args, **kwargs)
        return decorated_function
    return decorator
