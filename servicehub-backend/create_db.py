from app import create_app
from app.models import db, Booking, Review, Subservice

app = create_app()

with app.app_context():
    db.create_all()
   
    print("All tables created successfully.")
