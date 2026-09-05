import logging

logger = logging.getLogger("speech_to_text")

def transcribe(audio_bytes: bytes, content_type: str = "audio/wav") -> str:
    """
    Clean interface seam for Speech-to-Text transcription.
    
    This interface abstracts audio transcription so voice interviews can be plugged in
    (e.g., via OpenAI Whisper API, Deepgram, or Web Speech API) without modifying the downstream
    evaluation pipeline.
    
    Currently returns a placeholder string if raw audio bytes are passed.
    """
    if not audio_bytes:
        return ""
    
    logger.info(f"Received {len(audio_bytes)} bytes of audio ({content_type}). Transcribing via STT seam...")
    # Follow-up feature seam: return transcribed audio text
    return "Transcribed audio answer placeholder from SpeechToText interface seam."
