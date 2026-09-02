from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import db
from models import Payment, Tenant, Unit, Property

payments_bp = Blueprint("payments", __name__)

def _owns_tenant(tenant_id, user_id):
    tenant = Tenant.query.get(tenant_id)
    if not tenant:
        return False, None
    unit = Unit.query.get(tenant.unit_id)
    if not unit:
        return False, None
    prop = Property.query.get(unit.property_id)
    return (prop is not None and prop.user_id == user_id), tenant

@payments_bp.route("/api/payments", methods=["GET"])
@jwt_required()
def get_payments():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Payment.query.join(Tenant).join(Unit).join(Property).filter(Property.user_id == user_id).paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "payments": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@payments_bp.route("/api/payments/<int:id>", methods=["GET"])
@jwt_required()
def get_payment(id):
    user_id = int(get_jwt_identity())
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    owns, _ = _owns_tenant(payment.tenant_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403
    return jsonify(payment.to_dict()), 200

@payments_bp.route("/api/payments", methods=["POST"])
@jwt_required()
def create_payment():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    if not data or not data.get("tenant_id") or data.get("amount") is None:
        return jsonify({"error": "tenant_id and amount are required"}), 400

    owns, tenant = _owns_tenant(data["tenant_id"], user_id)
    if not tenant:
        return jsonify({"error": "Invalid tenant_id"}), 422
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    if data["amount"] <= 0:
        return jsonify({"error": "amount must be positive"}), 422

    payment = Payment(
        tenant_id=data["tenant_id"],
        amount=data["amount"],
        payment_date=data.get("payment_date"),
        payment_method=data.get("payment_method"),
        status=data.get("status", "pending")
    )
    db.session.add(payment)
    db.session.commit()
    return jsonify(payment.to_dict()), 201

@payments_bp.route("/api/payments/<int:id>", methods=["PATCH"])
@jwt_required()
def update_payment(id):
    user_id = int(get_jwt_identity())
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    owns, _ = _owns_tenant(payment.tenant_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    data = request.get_json()
    for field in ["amount", "payment_date", "payment_method", "status"]:
        if field in data:
            setattr(payment, field, data[field])

    db.session.commit()
    return jsonify(payment.to_dict()), 200

@payments_bp.route("/api/payments/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_payment(id):
    user_id = int(get_jwt_identity())
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    owns, _ = _owns_tenant(payment.tenant_id, user_id)
    if not owns:
        return jsonify({"error": "You do not have permission to access this resource."}), 403

    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": "Payment deleted"}), 200