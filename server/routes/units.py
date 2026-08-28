from flask import Blueprint, request, jsonify
from extensions import db
from models import Unit, Property

units_bp = Blueprint("units", __name__)

@units_bp.route("/api/units", methods=["GET"])
def get_units():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Unit.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "units": [u.to_dict() for u in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@units_bp.route("/api/units/<int:id>", methods=["GET"])
def get_unit(id):
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404
    return jsonify(unit.to_dict()), 200

@units_bp.route("/api/units", methods=["POST"])
def create_unit():
    data = request.get_json()
    if not data or not data.get("property_id") or not data.get("unit_number") or data.get("monthly_rent") is None:
        return jsonify({"error": "property_id, unit_number and monthly_rent are required"}), 400

    if not Property.query.get(data["property_id"]):
        return jsonify({"error": "Invalid property_id"}), 422

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
def update_unit(id):
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404

    data = request.get_json()
    for field in ["unit_number", "monthly_rent", "status"]:
        if field in data:
            setattr(unit, field, data[field])

    db.session.commit()
    return jsonify(unit.to_dict()), 200

@units_bp.route("/api/units/<int:id>", methods=["DELETE"])
def delete_unit(id):
    unit = Unit.query.get(id)
    if not unit:
        return jsonify({"error": "Unit not found"}), 404

    db.session.delete(unit)
    db.session.commit()
    return jsonify({"message": "Unit deleted"}), 200
