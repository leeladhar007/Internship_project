from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis",
    model = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    )

LABEL_MAP = {
    "LABEL_0" : "NEGATIVE",
    "LABEL_1" : "NEUTRAL",
    "LABEL_2" : "POSITIVE"
}

def analyze_sentiment(text:str)->dict:
    result = sentiment_pipeline(text)[0]
    return{
        "label" :LABEL_MAP.get(result["label"],result["label"]),
        "score" : round(result["score"],4)
    }