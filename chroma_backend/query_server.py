from fastapi import FastAPI
import chromadb
from chromadb.utils import embedding_functions
import os

from dotenv import load_dotenv
load_dotenv(dotenv_path="../backend/.env")

app = FastAPI()
openai_key = os.getenv("OPENAI_API_KEY")

os.environ["CHROMA_OPENAI_API_KEY"] = openai_key

# ✅ Use Chroma's built-in embedding function
embedding_function = embedding_functions.OpenAIEmbeddingFunction(
    api_key=openai_key,
    model_name="text-embedding-3-small"
)

# Connect to existing Chroma DB
client = chromadb.PersistentClient(path="./chroma_store")

# Load existing collection (trained earlier)
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
