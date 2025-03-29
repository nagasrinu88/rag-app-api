# RAG App API

The RAG App API is a backend service designed to provide responses to user queries by leveraging Pinecone for vector search and other APIs for context generation. It includes rate-limiting, secure API key authentication, and environment-specific configurations.

---

## Features

- **API Key Authentication**: Secure access using `APP_API_KEY`.
- **Rate Limiting**: Prevent abuse with configurable rate limits.
- **Pinecone Integration**: Perform vector searches for context retrieval.
- **Environment-Specific Configurations**: Use `.env` files for different environments.
- **Gemini API Integration**: Leverage external APIs for additional functionality.

---

## Prerequisites

- **Node.js**: Ensure you have Node.js installed (v16 or later recommended).
- **Pinecone Account**: Set up a Pinecone account and create an index.
- **Environment Variables**: Configure the `.env` file for your environment.

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/rag-app-api.git
   cd rag-app-api

2. Configure the environment variables:

    Create a `.env` file in the root directory and define the following variables:
    | Variable Name                  | Description                                              | Example Value              |
    |--------------------------------|----------------------------------------------------------|----------------------------|
    | `APP_API_KEY`                  | API key for authenticating requests                      | `your-api-key`             |
    | `PINECONE_API_KEY`             | API key for accessing Pinecone services                  | `your-pinecone-key`        |
    | `PINECONE_ENVIRONMENT`                 | Pinecone environment (e.g., sandbox or production)       | `us-west1-gcp`             |
    | `PINECONE_INDEX`               | Name of the Pinecone index to use                        | `my-index`                 |
    | `PORT`                         | Port number for the API server                           | `3000`                     |
    | `APP_SECRET_KEY`               | Secret key for application-level encryption or signing   | `your-secret-key`          |
    | `MAX_SEARCH_RESULTS_FOR_CONTEXT` | Maximum number of search results to return for context  | `5`                        |
    | `API_RATE_LIMIT_WINDOW_MS`     | Time window for rate limiting in milliseconds            | `60000`                    |
    | `API_RATE_LIMIT_MAX_REQUESTS`  | Maximum number of requests allowed within the time window | `100`                     |
    | `GEMINI_API_URL`               | Base URL for the Gemini API                              | `https://api.gemini.com`   |
    | `GEMINI_API_KEY`               | API key for accessing the Gemini API                     | `your-gemini-key`          |


    Ensure all required variables are set before running the application.

    ## Security and Rate Limiting

    ### Security

    The RAG App API employs the following security measures to ensure safe and reliable operation:

    - **API Key Authentication**: All requests must include a valid `APP_API_KEY` in the headers. Unauthorized requests are rejected with a `401 Unauthorized` response.
    - **Environment Variables**: Sensitive information, such as API keys and configuration details, are stored in environment variables to prevent accidental exposure.
    - **HTTPS Enforcement**: It is recommended to deploy the API behind an HTTPS-enabled server to encrypt data in transit.

    ### Rate Limiting

    To prevent abuse and ensure fair usage, the API includes a configurable rate-limiting mechanism:

    - **Request Limits**: The maximum number of requests allowed per minute is defined by the `RATE_LIMIT` environment variable.
    - **Response Codes**: When the rate limit is exceeded, the API responds with a `429 Too Many Requests` status code.
    - **Customizable**: The rate limit can be adjusted based on the application's requirements by modifying the `RATE_LIMIT` value in the `.env` file.
    - **Per-User Enforcement**: Rate limits are applied on a per-user basis, identified by their API key.

    These measures help maintain the API's performance and reliability while protecting it from malicious or excessive usage.