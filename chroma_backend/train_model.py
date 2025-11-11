import os
import chromadb
from chromadb.utils import embedding_functions


# ✅ Use Chroma's built-in SentenceTransformer embedding wrapper
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# ✅ Initialize Chroma client (persistent local storage)
client = chromadb.PersistentClient(path="./chroma_store")

# ✅ Create (or get existing) collection
collection = client.get_or_create_collection(
    name="athena_help_docs",
    embedding_function=embedding_function
)

# ✅ Path to your website data
DATA_PATH = r"C:\Users\HP\Desktop\athena-ai\chroma_backend\data\athena_info.txt"

with open(DATA_PATH, "r", encoding="utf-8") as f:
    data = f.read()

# ✅ Split data into chunks
chunk_size = 500
chunks = [data[i:i + chunk_size] for i in range(0, len(data), chunk_size)]

# ✅ Add chunks to Chroma
for i, chunk in enumerate(chunks):
    collection.add(
        ids=[f"chunk_{i}"],
        documents=[chunk],
        metadatas=[{"source": "website"}]
    )

print(f"✅ Successfully trained Chroma with {len(chunks)} chunks!")
