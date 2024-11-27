import boto3
import json
from decimal import Decimal
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodbTableName = "product-inventory"
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(dynamodbTableName)

getMethod = "GET"
postMethod = "POST"
patchMethod = "PATCH"
deleteMethod = "DELETE"
statusPath = "/status"
productPath = "/product"
productsPath = "/products"

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)  # Convertir Decimal a float
        return json.JSONEncoder.default(self, obj)

def convert_to_decimal(data):
    """Convierte valores float a Decimal antes de guardar en DynamoDB."""
    for key, value in data.items():
        if isinstance(value, float):
            data[key] = Decimal(str(value))
        elif isinstance(value, dict):
            convert_to_decimal(value)  # Recursivo para anidaciones
    return data

def convert_from_decimal(data):
    """Convierte valores Decimal a float para ser serializables en JSON."""
    if isinstance(data, list):
        return [convert_from_decimal(item) for item in data]
    elif isinstance(data, dict):
        return {key: convert_from_decimal(value) for key, value in data.items()}
    elif isinstance(data, Decimal):
        return float(data)
    return data

def lambda_handler(event, context):
    logger.info(f"Evento recibido: {json.dumps(event)}")
    httpMethod = event["httpMethod"]
    path = event["path"]
    
    try:
        if httpMethod == postMethod and path == productPath:
            requestBody = json.loads(event["body"])
            requestBody = convert_to_decimal(requestBody)  # Convertir float a Decimal
            response = saveProduct(requestBody)
        elif httpMethod == patchMethod and path == productPath:
            requestBody = json.loads(event["body"])
            product_id = requestBody["product_id"]
            updates = requestBody["updates"]  # Este campo contiene el objeto con las actualizaciones
            response = modifyProduct(product_id, updates)
        elif httpMethod == deleteMethod and path == productPath:
            requestBody = json.loads(event["body"])
            response = deleteProduct(requestBody["product_id"])
        elif httpMethod == getMethod and path == productPath:
            product_id = event["queryStringParameters"]["product_id"]
            response = getProduct(product_id)
        elif httpMethod == getMethod and path == productsPath:
            response = getProducts()
        elif httpMethod == getMethod and path == statusPath:
            response = buildResponse(200, {"status": "Healthy"})
        else:
            response = buildResponse(404, {"error": "Not Found"})
    except Exception as e:
        logger.error(f"Error en el procesamiento: {str(e)}")
        response = buildResponse(500, {"error": str(e)})

    return response

def saveProduct(requestBody):
    try:
        # Verificar si el producto con el mismo ID ya existe
        product_id = requestBody["product_id"]
        response = table.get_item(Key={"product_id": product_id})
        
        if "Item" in response:
            # Si el producto ya existe, devolver un mensaje indicando que no se puede crear
            return buildResponse(400, {"Message": f"El producto con el id: {product_id} ya existe"})
        
        # Si el producto no existe, continuar con el guardado
        logger.info(f"Guardando producto: {requestBody}")
        table.put_item(Item=requestBody)
        body = {
            "Operation": "SAVE",
            "Message": "SUCCESS",
            "Item": convert_from_decimal(requestBody)
        }
        return buildResponse(200, body)
    except Exception as e:
        logger.error(f"Error al guardar producto: {str(e)}")
        return buildResponse(500, {"error": str(e)})

def getProduct(product_id):
    try:
        logger.info(f"Obteniendo producto: {product_id}")
        response = table.get_item(Key={"product_id": product_id})
        if "Item" in response:
            item = convert_from_decimal(response["Item"])
            return buildResponse(200, item)
        else:
            return buildResponse(404, {"Message": f"Product_id: {product_id} not found"})
    except Exception as e:
        logger.error(f"Error al obtener producto: {str(e)}")
        return buildResponse(500, {"error": str(e)})

def getProducts():
    try:
        logger.info("Obteniendo todos los productos")
        response = table.scan()
        items = convert_from_decimal(response.get("Items", []))
        return buildResponse(200, {"products": items})
    except Exception as e:
        logger.error(f"Error al obtener productos: {str(e)}")
        return buildResponse(500, {"error": str(e)})

def modifyProduct(product_id, updates):
    try:
        logger.info(f"Verificando existencia del producto: {product_id}")
        # Verificar si el producto existe
        existingProduct = table.get_item(Key={"product_id": product_id})
        if "Item" not in existingProduct:
            return buildResponse(404, {"Message": f"El producto con id: {product_id} no existe"})
        
        logger.info(f"Modificando producto: {product_id}, actualizando: {updates}")
        # Construir expresiones dinámicas para múltiples actualizaciones
        updateExpression = "set " + ", ".join([f"{key} = :{key}" for key in updates.keys()])
        expressionAttributeValues = {f":{key}": Decimal(str(value)) if isinstance(value, float) else value for key, value in updates.items()}
        
        # Ejecutar actualización
        response = table.update_item(
            Key={"product_id": product_id},
            UpdateExpression=updateExpression,
            ExpressionAttributeValues=expressionAttributeValues,
            ReturnValues="UPDATED_NEW"
        )
        
        updatedAttributes = convert_from_decimal(response.get("Attributes", {}))
        body = {
            "Operation": "UPDATE",
            "Message": "SUCCESS",
            "UpdatedAttributes": updatedAttributes
        }
        return buildResponse(200, body)
    except Exception as e:
        logger.error(f"Error al modificar producto: {str(e)}")
        return buildResponse(500, {"error": str(e)})

def deleteProduct(product_id):
    try:
        logger.info(f"Verificando existencia del producto: {product_id}")
        # Verificar si el producto existe
        existingProduct = table.get_item(Key={"product_id": product_id})
        if "Item" not in existingProduct:
            return buildResponse(404, {"Message": f"El producto con id: {product_id} no existe"})
        
        logger.info(f"Eliminando producto: {product_id}")
        response = table.delete_item(Key={"product_id": product_id}, ReturnValues="ALL_OLD")
        
        deletedItem = convert_from_decimal(response.get("Attributes", {}))
        body = {
            "Operation": "DELETE",
            "Message": "SUCCESS",
            "DeletedItem": deletedItem
        }
        return buildResponse(200, body)
    except Exception as e:
        logger.error(f"Error al eliminar producto: {str(e)}")
        return buildResponse(500, {"error": str(e)})

def buildResponse(statusCode, body=None):
    response = {
        "statusCode": statusCode,
        "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}
    }
    if body is not None:
        response["body"] = json.dumps(body, cls=CustomEncoder)
    return response
