#!/bin/bash

curl -X POST -H 'Content-Type: application/json' -d @host.json http://localhost:8080/api/host
