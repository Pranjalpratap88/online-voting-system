import csv
import random
import string
from faker import Faker
from datetime import datetime, timedelta

# Initialize Faker for Indian data
fake = Faker('en_IN')

NUM_RECORDS = 1200  # Change as needed

genders = ["Male", "Female", "Other"]

# Sets to ensure uniqueness
used_emails = set()
used_aadhaar = set()
used_voter_ids = set()

# Helper functions

def generate_unique_email(name, index):
    domains = ["gmail.com", "yahoo.com", "outlook.com"]
    while True:
        clean_name = name.replace(" ", "").lower()
        email = f"{clean_name}{index}{random.randint(1,999)}@{random.choice(domains)}"
        if email not in used_emails:
            used_emails.add(email)
            return email

def generate_unique_aadhaar():
    while True:
        aadhaar = "".join(random.choices(string.digits, k=12))
        if aadhaar not in used_aadhaar:
            used_aadhaar.add(aadhaar)
            return aadhaar

def generate_unique_voter_id(index):
    while True:
        voter_id = f"INDVOTER{100000 + index + random.randint(1,999)}"
        if voter_id not in used_voter_ids:
            used_voter_ids.add(voter_id)
            return voter_id

def generate_date():
    start_date = datetime(2015, 1, 1)
    end_date = datetime(2024, 1, 1)
    return start_date + timedelta(days=random.randint(0, (end_date - start_date).days))

def generate_phone():
    return "9" + "".join(random.choices(string.digits, k=9))

def generate_pincode():
    return "".join(random.choices(string.digits, k=6))

# Output file
file_name = "indian_citizens_clean.csv"

with open(file_name, mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    # Header
    writer.writerow([
        "voterId",
        "name",
        "age",
        "gender",
        "phone",
        "email",
        "address",
        "state",
        "pincode",
        "aadhaarId",
        "registrationDate"
    ])

    # Generate data
    for i in range(NUM_RECORDS):
        name = fake.name()
        address_full = fake.address().replace("\n", ", ")
        state = fake.state()
        pincode = generate_pincode()

        writer.writerow([
            generate_unique_voter_id(i),
            name,
            random.randint(18, 90),
            random.choice(genders),
            generate_phone(),
            generate_unique_email(name, i),
            address_full,
            state,
            pincode,
            generate_unique_aadhaar(),
            generate_date().strftime("%Y-%m-%d")
        ])

print(f"✅ CSV '{file_name}' generated successfully with {NUM_RECORDS} unique records.")