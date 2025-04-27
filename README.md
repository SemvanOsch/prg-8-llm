# Installatie

1. Clone deze repository:

```bash
git clone https://github.com/SemvanOsch/prg-8-llm.git
cd prg-8-llm
```

2. Maak een .env file aan en zet hier de benodigde API keys in:
- AZURE_OPENAI_API_VERSION
- AZURE_OPENAI_API_INSTANCE_NAME
- AZURE_OPENAI_API_KEY
- AZURE_OPENAI_API_DEPLOYMENT_NAME
- AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME

3. Start de client:

```bash
cd client
npm install
npm run dev
```

4. Start de server:

```bash
cd server
npm install
npm run dev
```
