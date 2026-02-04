
from datetime import datetime

# Creates a standard message structure for database storage
def message_schema(role, text, translated):
    return {
        "role": role,                     # Sender role (doctor / patient)
        "text": text,                     # Original message text
        "translatedText": translated,     # Translated version of the message
        "timestamp": datetime.utcnow()    # Time when the message was created
    }
