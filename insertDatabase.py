import json
import firebase_admin
from firebase_admin import credentials, db

# Inicializar Firebase si aún no se ha hecho
if not firebase_admin._apps:
    cred = credentials.Certificate('deteccion-bulling-firebase-adminsdk-fbsvc-cf6fa0eb0a.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://deteccion-bulling-default-rtdb.firebaseio.com/'
    })

# Leer el archivo JSON
with open("bullying_analysis.json", "r", encoding="utf-8") as f:
    data = json.load(f)

print("Datos leídos:", data)

# Referencia en la base de datos
ref = db.reference('comentarios')

# Subir cada ítem
for item in data:
    ref.push(item)

print("Datos subidos correctamente.")
