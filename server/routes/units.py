from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Unit, Property

units_bp = Blueprint("units", __name__)

def _owns_property(property_id, user_id):
    prop = Property.query.get(property_id)
    return prop is not None and prop.user_id == user_id

@units_bp.route("/api/units", methods=["GET"])
@jwt_required()
def get_units():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Unit.query.join(Property).filter(Property.user_id == user_id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "units": [u.to_dict() for u in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@units_bp.route("/api/units/<int:id>", methods=["GET"])
@jwt_required()
def get_unit(id):
    user_id = int(get_jwt_identity())
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404
    if not _owns_property(unit.property_id, user_id):
        return jsonify({"error": "You do not have permission to access this resource."}), 403
    return jsonify(unit.to_dict()), 200

@units_bp.route("/api/units", methods=["POST"])
@jwt_required()
def create_unit():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get("property_id") or not data.get("unit_number") or data.get("monthly_rent") is None:
        return jsonify({"error": "property_id, unit_number and monthly_rent are required"}), 400

    if not _owns_property(data["property_id"], user_id):
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    if data["monthly_rent"] <= 0:
        return jsonify({"error": "monthly_rent must be positive"}), 422

    unit = Unit(
        property_id=data["property_id"],
        unit_number=data["unit_number"],
        monthly_rent=data["monthly_rent"],
        status=data.get("status", "vacant")
    )
    db.session.add(unit)
    db.session.commit()
    return jsonify(unit.to_dict()), 201

@units_bp.route("/api/units/<int:id>", methods=["PATCH"])
@jwt_required()
def update_unit(id):
    user_id = int(get_jwt_identity())
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404
    if not _owns_property(unit.property_id, user_id):
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    data = request.get_json()
    for field in ["unit_number", "monthly_rent", "status"]:
        if field in data:
            setattr(unit, field, data[field])

    db.session.commit()
    return jsonify(unit.to_dict()), 200

@units_bp.route("/api/units/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_unit(id):
    user_id = int(get_jwt_identity())
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404
    if not _owns_property(unit.property_id, user_id):
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    db.session.delete(unit)
    db.session.commit()
    return jsonify({"message": "Unit deleted"}), 200