from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Tenant, Unit, Property
import re

tenants_bp = Blueprint("tenants", __name__)
EMAIL_RE = re.compile(r"^[^@]+@[^@]+\.[^@]+$")

def _owns_unit(unit_id, user_id):
    unit = Unit.query.get(unit_id)
    if not unit:
        return False, None
    prop = Property.query.get(unit.property_id)
    return (prop is not None and prop.user_id == user_id), unit

@tenants_bp.route("/api/tenants", methods=["GET"])
@jwt_required()
def get_tenants():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Tenant.query.join(Unit).join(Property).filter(Property.user_id == user_id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "tenants": [t.to_dict() for t in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@tenants_bp.route("/api/tenants/<int:id>", methods=["GET"])
@jwt_required()
def get_tenant(id):
    user_id = int(get_jwt_identity())
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    owns, _ = _owns_unit(tenant.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403
    return jsonify(tenant.to_dict()), 200

@tenants_bp.route("/api/tenants", methods=["POST"])
@jwt_required()
def create_tenant():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get("unit_id") or not data.get("full_name"):
        return jsonify({"error": "unit_id and full_name are required"}), 400

    owns, unit = _owns_unit(data["unit_id"], user_id)
    if not unit:
        return jsonify({"error": "Invalid unit_id"}), 422
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    if data.get("email") and not EMAIL_RE.match(data["email"]):
        return jsonify({"error": "Invalid email format"}), 422

    tenant = Tenant(
        unit_id=data["unit_id"],
        full_name=data["full_name"],
        phone=data.get("phone"),
        email=data.get("email"),
        lease_start=data.get("lease_start"),
        lease_end=data.get("lease_end")
    )
    db.session.add(tenant)
    db.session.commit()
    return jsonify(tenant.to_dict()), 201

@tenants_bp.route("/api/tenants/<int:id>", methods=["PATCH"])
@jwt_required()
def update_tenant(id):
    user_id = int(get_jwt_identity())
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    owns, _ = _owns_unit(tenant.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    data = request.get_json()
    if "email" in data and data["email"] and not EMAIL_RE.match(data["email"]):
        return jsonify({"error": "Invalid email format"}), 422

    for field in ["full_name", "phone", "email", "lease_start", "lease_end"]:
        if field in data:
            setattr(tenant, field, data[field])

    db.session.commit()
    return jsonify(tenant.to_dict()), 200

@tenants_bp.route("/api/tenants/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_tenant(id):
    user_id = int(get_jwt_identity())
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    owns, _ = _owns_unit(tenant.unit_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    db.session.delete(tenant)
    db.session.commit()
    return jsonify({"message": "Tenant deleted"}), 200