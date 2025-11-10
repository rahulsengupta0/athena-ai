from fastapi import FastAPI
import chromadb
from chromadb.utils import embedding_functions

app = FastAPI()

# ✅ Use Chroma's built-in embedding function
embedding_function = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="all-MiniLM-L6-v2"
)

# ✅ Connect to existing Chroma DB
client = chromadb.PersistentClient(path="./chroma_store")

# ✅ Load existing collection (trained earlier)
collection = client.get_collection(
    name="athena_help_docs",
    embedding_function=embedding_function
)

@app.get("/search")
def search(query: str):
    results = collection.query(query_texts=[query], n_results=3)
    return {
        "matches": results["documents"][0],
        "metadatas": results["metadatas"][0]
    }
