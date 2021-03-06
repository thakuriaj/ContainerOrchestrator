#!/usr/bin/python
# James Houston
# Container Orchestrator
# list_containers.py

import docker
import requests
import sys
from docker.errors import APIError
from requests import ConnectionError
from requests import ConnectTimeout

def env_check():
    # Create the docker client
    client = docker.from_env()
    # Try to ping to ensure it is working
    try:
        retVal = client.ping()
        return client,retVal
    except ConnectionError as e:
        # Docker service is down....
        # Try to bring back up?
        print "ConnectionError exception thrown! Exception details:"
        print '\t', e
        return client,False

def list_containers(client, listAll):
    # Get the list of containers just running or all
    # Throws docker.errors.APIError if server returns an error
    # Throws requests.ConnectTimeout if the http request to docker times out
    # Throws requests.ConnectionError if the docker daemon is unreachable
    try:
        if listAll:
            containerList = client.containers.list(True)
        else:
            containerList = client.containers.list()
    except APIError as e:
        print "APIError exception thrown! Exception details:"
        print '\t', e
    except ConnectTimeout as e:
        print "ConnectTimeout exception thrown! Exception details:"
        print '\t', e
    except ConnectionError as e:
        print "ConnectionError exception thrown! Exception details:"
        print '\t', e

    return containerList

def main(client):
    # get arguments
    argLen = len(sys.argv)
    allBool = False
    #print argLen
    #print sys.argv
    if argLen > 2:
        print "Error: Invalid number of arguments. ./list_containers.py bool(listAll)"
        sys.exit(0)
    if argLen == 2:    # List all
        allBool = sys.argv[1]
        #print allBool
        if allBool not in ['true','True','false','False']:
            print "Error: Invalid argument passed. Second argument is of type \'bool\'"
            sys.exit(0)
        else:
            allBool = bool(allBool)

    containerList = list_containers(client,allBool)

    # Print contianer information
    if containerList:
        print containerList
        idList,nameList,statusList = [],[],[]
        for container in containerList:
            shortId = container.short_id
            idList.append(shortId)
            name = container.name
            nameList.append(name)
            status = container.status
            statusList.append(status)
            print "Name:", name, "Short ID:", shortId, "Status:", status
        print idList
        print nameList
        print statusList
    else:
        if allBool:
            print "No containers on the system!"
        else:
            print "No running containers on the system!"


if __name__ == '__main__':
    check = env_check()
    if check[1]:
        main(check[0])
