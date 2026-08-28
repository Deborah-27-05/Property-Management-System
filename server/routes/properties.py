from flask import Blueprint, request, jsonify
from extensions import db
from models import Property

properties_bp = Blueprint("properties", __name__)

@properties_bp.route("/api/properties", methods=["GET"])
def get_properties():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Property.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "properties": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@properties_bp.route("/api/properties/<int:id>", methods=["GET"])
def get_property(id):
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    return jsonify(prop.to_dict(include_units=True)), 200

@properties_bp.route("/api/properties", methods=["POST"])
def create_property():
    data = request.get_json()
    if not data or not data.get("name") or not data.get("location"):
        return jsonify({"error": "name and location are required"}), 400

    prop = Property(
        name=data["name"],
        location=data["location"],
        description=data.get("description"),
        number_of_units=data.get("number_of_units", 0)
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201

@properties_bp.route("/api/properties/<int:id>", methods=["PATCH"])
def update_property(id):
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404

    data = request.get_json()
    for field in ["name", "location", "description", "number_of_units"]:
        if field in data:
            setattr(prop, field, data[field])

    db.session.commit()
    return jsonify(prop.to_dict()), 200

@properties_bp.route("/api/properties/<int:id>", methods=["DELETE"])
def delete_property(id):
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404

    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"}), 200
