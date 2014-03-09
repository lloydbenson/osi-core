#!/bin/bash

curl -X POST -H 'Content-Type: application/json' -d @host.json http://localhost:8080/api/host
curl -X POST -H 'Content-Type: application/json' -d @profile/host.json http://localhost:8080/api/profile/host
