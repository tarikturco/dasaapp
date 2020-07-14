# dasaapp #

This project uses Node.js 14.5 + PostgreSQL + Sequelize ORM, running in an
Express Server

## Docker Setup

It is recommended to use docker and docker-compose.

### Docker-compose

1. Start PostgreSQL with `docker-compose up db`. You can edit some db
    configurations like expose the port to connect directly in db or change the
    user name and password or the database name in docker-compose.yml
2. Build the app container `docker-compose build app`
3. Install the dependencies by running docker-compose run app npm install.
    Note: the dependencies are installed in the build, but the docker-compose
    configurations resets the workspace, using the same as your machine, so it
    is necessary to install again.
4. Run the DB migrations with `docker-compose run app npm run migrate`
5. Start the server with `docker-compose up app`. The server uses nodemon so
    it will restart the server every time you edit some file in the project
    
## Manuel Setup

You can setup the environment running npm install directly in your machine.
You will need to configure the database and change the config/config.json file
with the database credentials

## Testing

### Run unit tests:

```
docker-compose up test
```

This command will install the dependencies, setup a test database and run the
migrations. If you run this command again, the test database will be restored,
so there will be no left data in it.

### Code coverage info:

The test is ran by nyc mocha command, and the coverage is showed in the screen.
The files ignored by the coverage are configured in .nycrc file

## API Documentation

### GET /api

Function: Just return a message when the server is up

Response:

```Welcome to Dasa API```

### GET /api/laboratories

Function: return all active laboratories registered in database

Response:

Code: 200

```
[
  {
    "status": "ACTIVE",
    "id": 1,
    "name": "Salomão Zoppi Cerro Corá",
    "address": "Rua Cerro Corá, 1044, Vila Romana - Alto da Lapa, São Paulo - SP, 05061-200",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T15:42:21.678Z",
    "updatedAt": "2020-07-14T15:42:21.678Z",
    "Exams": []
  },
  {
    "status": "ACTIVE",
    "id": 2,
    "name": "Delboni Auriemo - Berrini",
    "address": "Av. Engenheiro Luís Carlos Berrini, 909 - Andar 1 - Itaim Bibi, São Paulo - SP, 04571-010",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:27:42.489Z",
    "updatedAt": "2020-07-14T17:27:42.489Z",
    "Exams": []
  }
]
```

### POST /api/laboratories

Function: create a new laboratories entry

HEADERS: Content-type: application/json

Request:

```
{
  "name": "Delboni Auriemo - Berrini",
  "address": "Av. Engenheiro Luís Carlos Berrini, 909 - Andar 1 - Itaim Bibi, São Paulo - SP, 04571-010"
}
```

Response:

Code: 201

```
{
    "status": "ACTIVE",
    "id": 2,
    "name": "Delboni Auriemo - Berrini",
    "address": "Av. Engenheiro Luís Carlos Berrini, 909 - Andar 1 - Itaim Bibi, São Paulo - SP, 04571-010",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:27:42.489Z",
    "updatedAt": "2020-07-14T17:27:42.489Z",
    "Exams": []
}
```

It is possible to make a bulk create, passing a laboratories param in the post body

Request:

```
{
	"laboratories": [
		{
			"name": "Delboni Auriemo - Paulista",
			"address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000"
		},
		{
			"name": "Salomão Zoppi - Moema",
			"address": "R. Araguari, 552 - Moema, São Paulo - SP, 04514-041"
		}
	]
}
```

Response:

```
[
    {
        "status": "ACTIVE",
        "id": 3,
        "name": "Delboni Auriemo - Paulista",
        "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
        "createdAt": "2020-07-14T17:32:35.323Z",
        "updatedAt": "2020-07-14T17:32:35.323Z",
        "inactivatedAt": null
    },
    {
        "status": "ACTIVE",
        "id": 4,
        "name": "Salomão Zoppi - Moema",
        "address": "R. Araguari, 552 - Moema, São Paulo - SP, 04514-041",
        "createdAt": "2020-07-14T17:32:35.323Z",
        "updatedAt": "2020-07-14T17:32:35.323Z",
        "inactivatedAt": null
    }
]
```

Errors:

* 400, Invalid params
* 400, Laboratory with name already registered

Note - In bulk request it is not possible to set the examIds

### GET /api/laboratories/ID

Function: Retrieve a specific laboratory.

Response:

Code: 200

```
{
  "status": "ACTIVE",
  "id": 3,
  "name": "Delboni Auriemo - Paulista",
  "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
  "inactivatedAt": null,
  "createdAt": "2020-07-14T17:32:35.323Z",
  "updatedAt": "2020-07-14T17:32:35.323Z",
  "Exams": []
}
```

Errors:

* 404, Laboratory not found
* 412, Laboratory was deactivated

### PUT /api/laboratories/ID

Function: Updates the laboratory entry

HEADERS: Content-type: application/json

Request:

```
{
	"name": "Delboni Auriemo - Augusta",
	"examIds": [1,2]
}
```

Response:

Code: 200

```
{
    "status": "ACTIVE",
    "id": 3,
    "name": "Delboni Auriemo - Augusta",
    "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:32:35.323Z",
    "updatedAt": "2020-07-14T17:39:28.373Z",
    "Exams": [
        {
            "status": "ACTIVE",
            "id": 1,
            "name": "Eletrocardiograma",
            "type": "IMAGE",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:38:17.009Z",
            "updatedAt": "2020-07-14T17:38:17.009Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:38:42.618Z",
                "updatedAt": "2020-07-14T17:38:42.618Z",
                "examId": 1,
                "laboratoryId": 3
            }
        },
        {
            "status": "ACTIVE",
            "id": 2,
            "name": "Exame de plaquetas",
            "type": "CLINICAL_ANALYSIS",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:38:17.009Z",
            "updatedAt": "2020-07-14T17:38:17.009Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:38:42.618Z",
                "updatedAt": "2020-07-14T17:38:42.618Z",
                "examId": 2,
                "laboratoryId": 3
            }
        }
    ]
}
```

Errors:

* 400, Invalid params
* 400, Laboratory with name already registered
* 404, Laboratory not found
* 412, Laboratory was deactivated

### DELETE /api/laboratories/ID

Function: Deactivate a specific laboratory

Response

Code: 204

Errors:

* 404, Laboratory not found
* 412, Laboratory was deactivated

### DELETE /api/laboratories

Function: Makes a bulk deletion

Headers: Content-type: application/json

Request:

```
{
    "ids": [7, 38, 47]
}
```

Response:

Code: 204

### GET /api/exams

Function: return all active exams registered in database. It is possible to 
search an exam by name passing the param "search" in querystring
(/api/exams?search=cardiograma)

Response:

Code: 200

```
[
  {
    "status": "ACTIVE",
    "id": 1,
    "name": "Eletrocardiograma",
    "type": "IMAGE",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:38:17.009Z",
    "updatedAt": "2020-07-14T17:38:17.009Z",
    "Laboratories": [
      {
        "status": "ACTIVE",
        "id": 3,
        "name": "Delboni Auriemo - Augusta",
        "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
        "inactivatedAt": null,
        "createdAt": "2020-07-14T17:32:35.323Z",
        "updatedAt": "2020-07-14T17:39:28.373Z",
        "LabExams": {
          "createdAt": "2020-07-14T17:38:42.618Z",
          "updatedAt": "2020-07-14T17:38:42.618Z",
          "examId": 1,
          "laboratoryId": 3
        }
      }
    ]
  },
  {
    "status": "ACTIVE",
    "id": 2,
    "name": "Exame de plaquetas",
    "type": "CLINICAL_ANALYSIS",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:38:17.009Z",
    "updatedAt": "2020-07-14T17:38:17.009Z",
    "Laboratories": [
      {
        "status": "ACTIVE",
        "id": 3,
        "name": "Delboni Auriemo - Augusta",
        "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
        "inactivatedAt": null,
        "createdAt": "2020-07-14T17:32:35.323Z",
        "updatedAt": "2020-07-14T17:39:28.373Z",
        "LabExams": {
          "createdAt": "2020-07-14T17:38:42.618Z",
          "updatedAt": "2020-07-14T17:38:42.618Z",
          "examId": 2,
          "laboratoryId": 3
        }
      }
    ]
  }
]
```

### POST /api/exams

Function: create a new exam entry

HEADERS: Content-type: application/json

Request:

```
{
  "name": "Tomografia computadorizada",
  "type": "IMAGE",
  "labIds": [1,2,4]
}
```

Response:

Code: 201

```
{
    "status": "ACTIVE",
    "id": 3,
    "name": "Tomografia computadorizada",
    "type": "IMAGE",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:47:53.391Z",
    "updatedAt": "2020-07-14T17:47:53.391Z",
    "Laboratories": [
        {
            "status": "ACTIVE",
            "id": 1,
            "name": "Salomão Zoppi Cerro Corá",
            "address": "Rua Cerro Corá, 1044, Vila Romana - Alto da Lapa, São Paulo - SP, 05061-200",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T15:42:21.678Z",
            "updatedAt": "2020-07-14T15:42:21.678Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:47:53.421Z",
                "updatedAt": "2020-07-14T17:47:53.421Z",
                "examId": 3,
                "laboratoryId": 1
            }
        },
        {
            "status": "ACTIVE",
            "id": 2,
            "name": "Delboni Auriemo - Berrini",
            "address": "Av. Engenheiro Luís Carlos Berrini, 909 - Andar 1 - Itaim Bibi, São Paulo - SP, 04571-010",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:27:42.489Z",
            "updatedAt": "2020-07-14T17:27:42.489Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:47:53.421Z",
                "updatedAt": "2020-07-14T17:47:53.421Z",
                "examId": 3,
                "laboratoryId": 2
            }
        },
        {
            "status": "ACTIVE",
            "id": 4,
            "name": "Salomão Zoppi - Moema",
            "address": "R. Araguari, 552 - Moema, São Paulo - SP, 04514-041",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:32:35.323Z",
            "updatedAt": "2020-07-14T17:32:35.323Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:47:53.421Z",
                "updatedAt": "2020-07-14T17:47:53.421Z",
                "examId": 3,
                "laboratoryId": 4
            }
        }
    ]
}
```

It is possible to make a bulk create, passing an exams param in the post body

Request:

```
{
	"exams": [
		{
			"name": "Estudo do colesterol",
			"type": "CLINICAL_ANALYSIS"
		},
		{
			"name": "Exame de glicemia",
			"type": "CLINICAL_ANALYSIS"
		}
	]
}
```

Response:

```
[
    {
        "status": "ACTIVE",
        "id": 4,
        "name": "Estudo do colesterol",
        "type": "CLINICAL_ANALYSIS",
        "createdAt": "2020-07-14T17:49:44.032Z",
        "updatedAt": "2020-07-14T17:49:44.032Z",
        "inactivatedAt": null
    },
    {
        "status": "ACTIVE",
        "id": 5,
        "name": "Exame de glicemia",
        "type": "CLINICAL_ANALYSIS",
        "createdAt": "2020-07-14T17:49:44.032Z",
        "updatedAt": "2020-07-14T17:49:44.032Z",
        "inactivatedAt": null
    }
]
```

Errors:

* 400, Invalid params
* 400, Exam with name already registered

Note - In bulk request it is not possible to set the examIds

### GET /api/exams/ID

Function: Retrieve a specific exam.

Response:

Code: 200

```
{
    "status": "ACTIVE",
    "id": 2,
    "name": "Exame de plaquetas",
    "type": "CLINICAL_ANALYSIS",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:38:17.009Z",
    "updatedAt": "2020-07-14T17:38:17.009Z",
    "Laboratories": [
        {
            "status": "ACTIVE",
            "id": 3,
            "name": "Delboni Auriemo - Augusta",
            "address": "R. Augusta, 1828 - Cerqueira César, São Paulo - SP, 01412-000",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:32:35.323Z",
            "updatedAt": "2020-07-14T17:39:28.373Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:38:42.618Z",
                "updatedAt": "2020-07-14T17:38:42.618Z",
                "examId": 2,
                "laboratoryId": 3
            }
        }
    ]
}
```

Errors:

* 404, Exam not found
* 412, Exam was deactivated

### PUT /api/exams/ID

Function: Updates an exam entry

HEADERS: Content-type: application/json

Request:

```
{
	"type": "IMAGE",
	"labIds": [1,2,5]
}
```

Response:

Code: 200

```
{
    "status": "ACTIVE",
    "id": 4,
    "name": "Estudo do colesterol",
    "type": "IMAGE",
    "inactivatedAt": null,
    "createdAt": "2020-07-14T17:49:44.032Z",
    "updatedAt": "2020-07-14T17:53:29.345Z",
    "Laboratories": [
        {
            "status": "ACTIVE",
            "id": 1,
            "name": "Salomão Zoppi Cerro Corá",
            "address": "Rua Cerro Corá, 1044, Vila Romana - Alto da Lapa, São Paulo - SP, 05061-200",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T15:42:21.678Z",
            "updatedAt": "2020-07-14T15:42:21.678Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:53:29.349Z",
                "updatedAt": "2020-07-14T17:53:29.349Z",
                "examId": 4,
                "laboratoryId": 1
            }
        },
        {
            "status": "ACTIVE",
            "id": 2,
            "name": "Delboni Auriemo - Berrini",
            "address": "Av. Engenheiro Luís Carlos Berrini, 909 - Andar 1 - Itaim Bibi, São Paulo - SP, 04571-010",
            "inactivatedAt": null,
            "createdAt": "2020-07-14T17:27:42.489Z",
            "updatedAt": "2020-07-14T17:27:42.489Z",
            "LabExams": {
                "createdAt": "2020-07-14T17:53:29.349Z",
                "updatedAt": "2020-07-14T17:53:29.349Z",
                "examId": 4,
                "laboratoryId": 2
            }
        }
    ]
}
```

Errors:

* 400, Invalid params
* 400, Exam with name already registered
* 404, Exam not found
* 412, Exam was deactivated

### DELETE /api/exams/ID

Function: Deactivate a specific exam

Response

Code: 204

Errors:

* 404, Exam not found
* 412, Exam was deactivated

### DELETE /api/exams

Function: Makes a bulk deletion

Headers: Content-type: application/json

Request:

```
{
    "ids": [7, 38, 47]
}
```

Response:

Code: 204


## Deploy

There is a small script to deploy the project in AWS ECS. It is needed to
create a .env file with the following format:

```
REGION=AWS_REGION
AWS_ACCOUNT_ID=AWS_ACCOUNT_ID
REPO_NAME=REPOSITORY_NAME
CLUSTER_NAME=CLUSTER_NAME
MIGRATION_TASK=MIGRATION_TASK
SERVICE_NAME=SERVICE_NAME
```

Where AWS_REGION is the AWS region used in the production environment,
AWS_ACCOUNT_ID is the main account, REPOSITORY_NAME is the repository name
configured in AWS ECR, the CLUSTER_NAME is the name of the Cluster created in
AWS ECS, the MIGRATION_TASK is the name of the AWS ECS Task definition created
to run the database migrations and SERVICE_NAME is the AWS ECS TASK DEFINITION
name created to run the server. Both of Task definitions need the database
configuration (And permission) to work properly.