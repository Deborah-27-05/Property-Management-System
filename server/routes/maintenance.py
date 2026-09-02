from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import MaintenanceRequest, Unit, Tenant, Property

maintenance_bp = Blueprint("maintenance", __name__)
VALID_PRIORITIES = {"low", "medium", "high"}

def _owns_unit(unit_id, user_id):
    unit = Unit.query.get(unit_id)
    if not unit:
        return False, None
    prop = Property.query.get(unit.property_id)
    return (prop is not None and prop.user_id == user_id), unit

@maintenance_bp.route("/api/maintenance", methods=["GET"])
@jwt_required()
def get_requests():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = MaintenanceRequest.query.join(Unit).join(Property).filter(Property.user_id == user_id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "maintenance_requests": [m.to_dict() for m in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@maintenance_bp.route("/api/maintenance/<int:id>", methods=["GET"])
@jwt_required()
def get_request(id):
    user_id = int(get_jwt_identity())
    req = MaintenanceRequest.query.get(id)
    if not req:
        return jsonify({"error": "Maintenance request not found"}), 404
    owns, _ = _owns_unit(req.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403
    return jsonify(req.to_dict()), 200

@maintenance_bp.route("/api/maintenance", methods=["POST"])
@jwt_required()
def create_request():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get("unit_id") or not data.get("title"):
        return jsonify({"error": "unit_id and title are required"}), 400

    owns, unit = _owns_unit(data["unit_id"], user_id)
    if not unit:
        return jsonify({"error": "Invalid unit_id"}), 422
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    if data.get("tenant_id") and not Tenant.query.get(data["tenant_id"]):
        return jsonify({"error": "Invalid tenant_id"}), 422

    priority = data.get("priority", "medium")
    if priority not in VALID_PRIORITIES:
        return jsonify({"error": "priority must be one of low, medium, high"}), 422

    req = MaintenanceRequest(
        unit_id=data["unit_id"],
        tenant_id=data.get("tenant_id"),
        title=data["title"],
        description=data.get("description"),
        priority=priority,
        status=data.get("status", "open")
    )
    db.session.add(req)
    db.session.commit()
    return jsonify(req.to_dict()), 201

@maintenance_bp.route("/api/maintenance/<int:id>", methods=["PATCH"])
@jwt_required()
def update_request(id):
    user_id = int(get_jwt_identity())
    req = MaintenanceRequest.query.get(id)
    if not req:
        return jsonify({"error": "Maintenance request not found"}), 404
    owns, _ = _owns_unit(req.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    data = request.get_json()
    if "priority" in data and data["priority"] not in VALID_PRIORITIES:
        return jsonify({"error": "priority must be one of low, medium, high"}), 422

    for field in ["title", "description", "priority", "status"]:
        if field in data:
            setattr(req, field, data[field])

    db.session.commit()
    return jsonify(req.to_dict()), 200

@maintenance_bp.route("/api/maintenance/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_request(id):
    user_id = int(get_jwt_identity())
    req = MaintenanceRequest.query.get(id)
    if not req:
        return jsonify({"error": "Maintenance request not found"}), 404
    owns, _ = _owns_unit(req.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    db.session.delete(req)
    db.session.commit()
    return jsonify({"message": "Maintenance request deleted"}), 200