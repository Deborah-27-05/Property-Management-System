from flask import Blueprint, request, jsonify
from extensions import db
from models import Payment, Tenant

payments_bp = Blueprint("payments", __name__)

@payments_bp.route("/api/payments", methods=["GET"])
def get_payments():
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    pagination = Payment.query.paginate(page=page, per_page=per_page, error_out=False)
    return jsonify({
        "payments": [p.to_dict() for p in pagination.items],
        "page": pagination.page,
        "total_pages": pagination.pages,
        "total_records": pagination.total
    }), 200

@payments_bp.route("/api/payments/<int:id>", methods=["GET"])
def get_payment(id):
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    return jsonify(payment.to_dict()), 200

@payments_bp.route("/api/payments", methods=["POST"])
def create_payment():
    data = request.get_json()
    if not data or not data.get("tenant_id") or data.get("amount") is None:
        return jsonify({"error": "tenant_id and amount are required"}), 400

    if not Tenant.query.get(data["tenant_id"]):
        return jsonify({"error": "Invalid tenant_id"}), 422

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
def update_payment(id):
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    data = request.get_json()
    for field in ["amount", "payment_date", "payment_method", "status"]:
        if field in data:
            setattr(payment, field, data[field])

    db.session.commit()
    return jsonify(payment.to_dict()), 200

@payments_bp.route("/api/payments/<int:id>", methods=["DELETE"])
def delete_payment(id):
    payment = Payment.query.get(id)
    if not payment:
        return jsonify({"error": "Payment not found"}), 404

    db.session.delete(payment)
    db.session.commit()
    return jsonify({"message": "Payment deleted"}), 200
