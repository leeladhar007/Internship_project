from transformers import pipeline

sentiment_pipeline = pipeline("sentiment-analysis")
result=sentiment_pipeline("i absolutely love this new feature!")

print(result)
