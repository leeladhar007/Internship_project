# debug_chroma.py — run from your backend folder
# from chroma_db import collection

# print("Total documents in collection:", collection.count())

# results = collection.query(
#     query_texts=["customer facing issues with MS365"],
#     n_results=5
# )

# for doc, meta, dist in zip(results["documents"][0], results["metadatas"][0], results["distances"][0]):
#     print(f"\n--- distance: {dist} | source: {meta} ---")
    # print(doc[:300])