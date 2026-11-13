# Backend

## How to Run

### Prerequisites
1. Install Python 3.13.3+ [here](https://www.python.org/downloads/).
    * It may work with other versions of Python, but it was only tested with 3.13.3. 
2. Run `<python> setup.py`, where `<python>` is usually `python` or `python3`. 
    * This will install the dependencies using pip and requirements.txt.

### Running the backend app

To run the backend app execute the following command from the Backend directory: 

    flask run
    flask run --reload      # autoreloads the app upon code changes

This will create the flask application and bring the server up.

## How to Interact with the REST API

### There are two options

### 1. Interacting with the Frontend

Navigate to the [Frontend's documentation](../Frontend/README.md) for more information.

### 2. Driving the REST API using Swagger UI

1. Navigate to /docs under the running server's url on a browser.
    * Example: http://127.0.0.1:5000/docs
2. Scroll to 'Endpoints'.
3. Click on the desired endpoint.
4. Click on 'Try out'.
5. If driving a put endpoint, edit the value.
6. Click 'Execute'.
7. Observe the output (under 'server response').

Scrolling down on Swagger UI you can find the schemas, and exploring the individual endpoints you can see an example, documented HTTP codes, and more!

## How to Generate the OpenAPI Description

Run `flask spec --output ../External/Artifacts/openapi.json`
