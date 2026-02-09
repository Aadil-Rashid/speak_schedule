import os
import requests
from datetime import datetime
from typing import Optional

import pytz


IST = pytz.timezone("Asia/Kolkata")


class DucklingDateTimeParser:
    def __init__(self):
        self.url = os.getenv(
            "DUCKLING_URL",
            "http://duckling:8000/parse"
        )
        print("Duckling URL:", self.url)

    def parse(self, text: str) -> Optional[datetime]:
        try:
            response = requests.post(
                self.url,
                data={
                    "text": text,
                    "locale": "en_IN",
                    "tz": "Asia/Kolkata"   # IST at Duckling level
                },
                timeout=3
            )
            response.raise_for_status()
        except requests.RequestException as e:
            print("Duckling connection failed:", e)
            return None

        entities = response.json()

        for entity in entities:
            if entity.get("dim") == "time":
                value = entity.get("value", {})
                if value.get("type") == "value":
                    # Duckling returns ISO with timezone
                    dt = datetime.fromisoformat(value["value"])

                    # Convert to IST explicitly
                    dt_ist = dt.astimezone(IST)

                    print("Parsed IST datetime:", dt_ist)
                    return dt_ist

        return None
