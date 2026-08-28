from flask import Blueprint, request, jsonify
from extensions import db
from models import Tenant, Unit
import re

tenants_bp = Blueprint("tenants", __name__)
EMAIL_RE = re.compile(r"^[^@]+@[^@]+\.[^@]+$")

@tenants_bp.route("/api/tenants", methods=["GET"])
def get_tenants():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Tenant.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "tenants": [t.to_dict() for t in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@tenants_bp.route("/api/tenants/<int:id>", methods=["GET"])
def get_tenant(id):
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404
    return jsonify(tenant.to_dict()), 200

@tenants_bp.route("/api/tenants", methods=["POST"])
def create_tenant():
    data = request.get_json()
    if not data or not data.get("unit_id") or not data.get("full_name"):
        return jsonify({"error": "unit_id and full_name are required"}), 400

    if not Unit.query.get(data["unit_id"]):
        return jsonify({"error": "Invalid unit_id"}), 422

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
def update_tenant(id):
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    data = request.get_json()
    if "email" in data and data["email"] and not EMAIL_RE.match(data["email"]):
        return jsonify({"error": "Invalid email format"}), 422

    for field in ["full_name", "phone", "email", "lease_start", "lease_end"]:
        if field in data:
            setattr(tenant, field, data[field])

    db.session.commit()
    return jsonify(tenant.to_dict()), 200

@tenants_bp.route("/api/tenants/<int:id>", methods=["DELETE"])
def delete_tenant(id):
    tenant = Tenant.query.get(id)
    if not tenant:
        return jsonify({"error": "Tenant not found"}), 404

    db.session.delete(tenant)
    db.session.commit()
    return jsonify({"message": "Tenant deleted"}), 200
