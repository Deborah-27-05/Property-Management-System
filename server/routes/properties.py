from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Property

properties_bp = Blueprint("properties", __name__)

@properties_bp.route("/api/properties", methods=["GET"])
@jwt_required()
def get_properties():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Property.query.filter_by(user_id=user_id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "properties": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@properties_bp.route("/api/properties/<int:id>", methods=["GET"])
@jwt_required()
def get_property(id):
    user_id = int(get_jwt_identity())
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    if prop.user_id != user_id:
        return jsonify({"error": "You do not have permission to access this resource."}), 403
    return jsonify(prop.to_dict(include_units=True)), 200

@properties_bp.route("/api/properties", methods=["POST"])
@jwt_required()
def create_property():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get("name") or not data.get("location"):
        return jsonify({"error": "name and location are required"}), 400

    prop = Property(
        user_id=user_id,
        name=data["name"],
        location=data["location"],
        description=data.get("description"),
        number_of_units=data.get("number_of_units", 0)
    )
    db.session.add(prop)
    db.session.commit()
    return jsonify(prop.to_dict()), 201

@properties_bp.route("/api/properties/<int:id>", methods=["PATCH"])
@jwt_required()
def update_property(id):
    user_id = int(get_jwt_identity())
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    if prop.user_id != user_id:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    data = request.get_json()
    for field in ["name", "location", "description", "number_of_units"]:
        if field in data:
            setattr(prop, field, data[field])

    db.session.commit()
    return jsonify(prop.to_dict()), 200

@properties_bp.route("/api/properties/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_property(id):
    user_id = int(get_jwt_identity())
    prop = Property.query.get(id)
    if not prop:
        return jsonify({"error": "Property not found"}), 404
    if prop.user_id != user_id:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    db.session.delete(prop)
    db.session.commit()
    return jsonify({"message": "Property deleted"}), 200