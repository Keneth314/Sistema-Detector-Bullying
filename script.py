import json
import re
import google.generativeai as genai
from time import sleep

# Configura tu API key
genai.configure(api_key="AIzaSyDIdAaXl6KzS4IL1cpWSA22Jdh6XAsQ134")

# Cargar modelo
model = genai.GenerativeModel("gemini-1.5-flash")


# ----------------- AÑADIR AL JSON EL NIVEL DEL RIESGO ---------------------------

# Leer el archivo JSON
with open("messages.json", "r", encoding="utf-8") as f:
    mensajes = json.load(f)

def generar_prompt_lote(mensajes_lote):
    prompt = (
        "Analiza cada mensaje textual para evaluar el nivel de bullying presente, "
        "basándote en criterios validados en la literatura científica sobre acoso verbal y ciberbullying, "
        "incluyendo los trabajos de Kowalski et al. (2014), Smith et al. (2008) y Olweus (1993). "
        "Considera bullying como cualquier comportamiento verbal agresivo e intencional que busque causar daño emocional o psicológico. "
        "Clasifica el nivel de bullying en tres categorías: Bajo, Medio y Alto. "
        "Devuelve SOLO un arreglo JSON con un objeto por mensaje con los campos userName, message y bullyingLevel "
        "(valores posibles: \"Bajo\", \"Medio\" o \"Alto\"). "
        "No incluyas texto adicional, ni explicaciones, ni comillas fuera del JSON.\n\n"
        "Mensajes a analizar:\n"
        + json.dumps([{"userName": m["userName"], "message": m["message"]} for m in mensajes_lote], ensure_ascii=False)
    )
    return prompt

def extraer_json(texto):
    match = re.search(r'(\[.*\])', texto, re.DOTALL)
    if match:
        return match.group(1)
    return None

def analizar_lote(mensajes_lote):
    prompt = generar_prompt_lote(mensajes_lote)

    print("Prompt enviado:\n", prompt)
    try:
        response = model.generate_content(prompt)
        print("Respuesta cruda:\n", response.text)

        # Intentar parsear directamente
        try:
            parsed = json.loads(response.text)
            return parsed
        except json.JSONDecodeError:
            # Intentar extraer JSON del texto si no es JSON puro
            posible_json = extraer_json(response.text)
            if posible_json:
                parsed = json.loads(posible_json)
                return parsed
            else:
                print("No se encontró JSON válido en la respuesta.")
                return []
    except Exception as e:
        print("Error al analizar lote:", e)
        return []

# Procesar en lotes
resultados = []
batch_size = 25
for i in range(0, len(mensajes), batch_size):
    lote = mensajes[i:i+batch_size]
    resultados_lote = analizar_lote(lote)
    
    for res in resultados_lote:
        original = next((m for m in lote if m["userName"] == res["userName"] and m["message"] == res["message"]), None)
        if original:
            original["bullyingLevel"] = res.get("bullyingLevel", "Desconocido")
            resultados.append(original)
    
    sleep(1)

# Guardar resultados
with open("bullying_analysis.json", "w", encoding="utf-8") as f:
    json.dump(resultados, f, indent=2, ensure_ascii=False)
print("✅ Archivo 'bullying_analysis.json' creado exitosamente.")
# ---------------------------------



# ----------------- CONVERTIR JSON EN TS ---------------------------

# Leer el archivo JSON
with open("bullying_analysis.json", "r", encoding="utf-8") as f:
    json_data = json.load(f)
    
# Función para generar arrays en TypeScript
def to_ts_array(name, values):
    ts = f"export const _{name} = (index: number) =>\n  [\n"
    for val in values:
        escaped = val.replace('"', '\\"')  # escapa comillas dobles
        ts += f'    "{escaped}",\n'
    ts += f"  ][index];\n\n"
    return ts

# Extraer los campos
full_names = [item["fullName"] for item in json_data]
usernames = [item["userName"] for item in json_data]
messages = [item["message"] for item in json_data]
dates = [item["date"] for item in json_data]
levels = [item["bullyingLevel"] for item in json_data]

# Construir el contenido
ts_output = ''
ts_output += 'export const _id = (index: number) => `e99f09a7-dd88-49d5-b1c8-1daf80c2d7b${index}`;\n\n'
ts_output += to_ts_array("fullNameU", full_names)
ts_output += to_ts_array("userNameU", usernames)
ts_output += to_ts_array("messageU", messages)
ts_output += to_ts_array("dateU", dates)
ts_output += to_ts_array("riskLevelU", levels)

# Guardar en un archivo TypeScript
with open("data.ts", "w", encoding="utf-8") as f:
    f.write(ts_output)

print("✅ Archivo 'comments.ts' creado exitosamente.")
# ---------------------------------



# ----------------- CONVERTIR JSON EN TS ---------------------------