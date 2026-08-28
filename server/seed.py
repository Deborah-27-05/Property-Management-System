from datetime import date
from app import create_app
from extensions import db
from models import Property, Unit, Tenant, Payment, MaintenanceRequest

app = create_app()

with app.app_context():
    db.drop_all()
    db.create_all()

    p1 = Property(name="Greenview Apartments", location="Nairobi", description="Modern apartments", number_of_units=2)
    p2 = Property(name="Riverside Court", location="Mombasa", description="Cozy courtyard units", number_of_units=1)
    db.session.add_all([p1, p2])
    db.session.commit()

    u1 = Unit(property_id=p1.id, unit_number="A1", monthly_rent=15000, status="occupied")
    u2 = Unit(property_id=p1.id, unit_number="A2", monthly_rent=14000, status="vacant")
    u3 = Unit(property_id=p2.id, unit_number="B1", monthly_rent=12000, status="occupied")
    db.session.add_all([u1, u2, u3])
    db.session.commit()

    t1 = Tenant(unit_id=u1.id, full_name="Alice Wanjiru", phone="0700000001", email="alice@example.com",
                lease_start=date(2025, 1, 1), lease_end=date(2025, 12, 31))
    t2 = Tenant(unit_id=u3.id, full_name="Brian Otieno", phone="0700000002", email="brian@example.com",
                lease_start=date(2025, 3, 1), lease_end=date(2026, 2, 28))
    db.session.add_all([t1, t2])
    db.session.commit()

    pay1 = Payment(tenant_id=t1.id, amount=15000, payment_date=date(2025, 6, 1), payment_method="M-Pesa", status="paid")
    pay2 = Payment(tenant_id=t2.id, amount=12000, payment_date=date(2025, 6, 3), payment_method="Bank Transfer", status="paid")
    db.session.add_all([pay1, pay2])
    db.session.commit()

    m1 = MaintenanceRequest(unit_id=u1.id, tenant_id=t1.id, title="Leaking tap", description="Kitchen tap leaking", priority="medium", status="open")
    db.session.add(m1)
    db.session.commit()

    print("Seed data created successfully.")
