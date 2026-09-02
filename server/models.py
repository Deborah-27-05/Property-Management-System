
from datetime import datetime
from extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class Property(db.Model):
    __tablename__ = "properties"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    name = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    number_of_units = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    owner = db.relationship("User", back_populates="properties")
    units = db.relationship("Unit", back_populates="property", cascade="all, delete-orphan")

    def to_dict(self, include_units=False):
        data = {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "description": self.description,
            "number_of_units": self.number_of_units,
            "created_at": self.created_at.isoformat(),
        }
        if include_units:
            data["units"] = [u.to_dict() for u in self.units]
        return data
    
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    password_hash = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    properties = db.relationship("Property", back_populates="owner")

    def set_password(self, raw_password):
        self.password_hash = generate_password_hash(raw_password)

    def check_password(self, raw_password):
        return check_password_hash(self.password_hash, raw_password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "created_at": self.created_at.isoformat(),
        }

class Unit(db.Model):
    __tablename__ = "units"

    id = db.Column(db.Integer, primary_key=True)
    property_id = db.Column(db.Integer, db.ForeignKey("properties.id"), nullable=False)
    unit_number = db.Column(db.String, nullable=False)
    monthly_rent = db.Column(db.Float, nullable=False)
    status = db.Column(db.String, default="vacant")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    property = db.relationship("Property", back_populates="units")
    tenants = db.relationship("Tenant", back_populates="unit", cascade="all, delete-orphan")
    maintenance_requests = db.relationship("MaintenanceRequest", back_populates="unit", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "property_id": self.property_id,
            "unit_number": self.unit_number,
            "monthly_rent": self.monthly_rent,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class Tenant(db.Model):
    __tablename__ = "tenants"

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id"), nullable=False)
    full_name = db.Column(db.String, nullable=False)
    phone = db.Column(db.String)
    email = db.Column(db.String)
    lease_start = db.Column(db.Date)
    lease_end = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    unit = db.relationship("Unit", back_populates="tenants")
    payments = db.relationship("Payment", back_populates="tenant", cascade="all, delete-orphan")
    maintenance_requests = db.relationship("MaintenanceRequest", back_populates="tenant")

    def to_dict(self):
        return {
            "id": self.id,
            "unit_id": self.unit_id,
            "full_name": self.full_name,
            "phone": self.phone,
            "email": self.email,
            "lease_start": self.lease_start.isoformat() if self.lease_start else None,
            "lease_end": self.lease_end.isoformat() if self.lease_end else None,
            "created_at": self.created_at.isoformat(),
        }


class Payment(db.Model):
    __tablename__ = "payments"

    id = db.Column(db.Integer, primary_key=True)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    payment_date = db.Column(db.Date, default=datetime.utcnow)
    payment_method = db.Column(db.String)
    status = db.Column(db.String, default="pending")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    tenant = db.relationship("Tenant", back_populates="payments")

    def to_dict(self):
        return {
            "id": self.id,
            "tenant_id": self.tenant_id,
            "amount": self.amount,
            "payment_date": self.payment_date.isoformat() if self.payment_date else None,
            "payment_method": self.payment_method,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }


class MaintenanceRequest(db.Model):
    __tablename__ = "maintenance_requests"

    id = db.Column(db.Integer, primary_key=True)
    unit_id = db.Column(db.Integer, db.ForeignKey("units.id"), nullable=False)
    tenant_id = db.Column(db.Integer, db.ForeignKey("tenants.id"), nullable=True)
    title = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    priority = db.Column(db.String, default="medium")
    status = db.Column(db.String, default="open")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    unit = db.relationship("Unit", back_populates="maintenance_requests")
    tenant = db.relationship("Tenant", back_populates="maintenance_requests")

    def to_dict(self):
        return {
            "id": self.id,
            "unit_id": self.unit_id,
            "tenant_id": self.tenant_id,
            "title": self.title,
            "description": self.description,
            "priority": self.priority,
            "status": self.status,
            "created_at": self.created_at.isoformat(),
        }
