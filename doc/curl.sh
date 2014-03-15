#!/bin/bash

echo "Adding a new host"
curl -X POST -H 'Content-Type: application/json' -d @host.json http://localhost:8080/api/host
echo "Adding a host profile"
curl -X POST -H 'Content-Type: application/json' -d @profile/host.json http://localhost:8080/api/profile/host
echo "Adding a network profile"
curl -X POST -H 'Content-Type: application/json' -d @profile/network.json http://localhost:8080/api/profile/network
