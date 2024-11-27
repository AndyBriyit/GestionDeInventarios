from decimal import Decimal
import json

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)  # Convertir Decimal a float
        return json.JSONEncoder.default(self, obj)
