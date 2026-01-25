"""Content analysis service"""
from openai import AsyncOpenAI
from app.config import settings
import httpx
import re
import base64

client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)

class ContentAnalysisService:
    """Análisis de contenido con IA"""
    
    @staticmethod
    async def analyze_content(
        content_url: str,
        requirements: dict,
        platform: str
    ) -> dict:
        """
        Analizar contenido con OpenAI Vision
        
        Valida:
        - Hashtags requeridos presentes
        - Menciones de marca
        - Calidad de imagen
        - Relevancia con categoría
        - Engagement potencial
        """
        try:
            # Descargar imagen
            async with httpx.AsyncClient() as client_http:
                response = await client_http.get(content_url)
                image_data = response.content
            
            # Codificar en base64 para OpenAI Vision
            image_base64 = base64.b64encode(image_data).decode('utf-8')
            
            # Prompt para análisis
            prompt = f"""
            Analiza este contenido para una colaboración de influencer.
            
            Requisitos a validar:
            - Hashtags requeridos: {requirements.get('hashtags', [])}
            - Menciones requeridas: {requirements.get('mentions', [])}
            - Plataforma: {platform}
            
            Por favor evalúa:
            1. Hashtags encontrados (lista)
            2. Menciones encontradas (lista)
            3. Calidad visual (1-10)
            4. Relevancia con producto (1-10)
            5. Cumplimiento de requisitos (porcentaje)
            6. Hashtags adicionales efectivos encontrados
            7. Engagement potencial (bajo/medio/alto)
            8. Recomendaciones de mejora
            
            Responde en JSON.
            """
            
            response = await client.messages.create(
                model="gpt-4-vision-preview",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": image_base64,
                                },
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ],
                    }
                ],
            )
            
            # Parsear respuesta
            analysis_text = response.content[0].text
            
            # Extraer JSON
            import json
            try:
                analysis = json.loads(analysis_text)
            except:
                analysis = {"raw_analysis": analysis_text}
            
            # Calcular score final
            compliance = analysis.get("cumplimiento_requisitos", 0)
            quality = analysis.get("calidad_visual", 5)
            relevance = analysis.get("relevancia_producto", 5)
            
            final_score = (compliance * 0.5 + quality * 0.25 + relevance * 0.25)
            
            return {
                "ai_score": final_score,
                "analysis": analysis,
                "passed_requirements": compliance >= 80,
                "quality_rating": quality,
                "relevance_rating": relevance
            }
        
        except Exception as e:
            return {
                "ai_score": 0,
                "analysis": {"error": str(e)},
                "passed_requirements": False,
                "quality_rating": 0,
                "relevance_rating": 0
            }
    
    @staticmethod
    async def validate_hashtags(
        captions: str,
        required_hashtags: list
    ) -> dict:
        """Validar hashtags en captions"""
        found_hashtags = re.findall(r'#\w+', captions)
        found_set = {h.lower() for h in found_hashtags}
        required_set = {h.lower() for h in required_hashtags}
        
        missing = required_set - found_set
        
        return {
            "found": found_hashtags,
            "required": required_hashtags,
            "missing": list(missing),
            "compliance": (len(required_set - found_set) == 0)
        }
    
    @staticmethod
    async def validate_mentions(
        captions: str,
        required_mentions: list
    ) -> dict:
        """Validar menciones en captions"""
        found_mentions = re.findall(r'@\w+', captions)
        found_set = {m.lower() for m in found_mentions}
        required_set = {m.lower() for m in required_mentions}
        
        missing = required_set - found_set
        
        return {
            "found": found_mentions,
            "required": required_mentions,
            "missing": list(missing),
            "compliance": (len(required_set - found_set) == 0)
        }
