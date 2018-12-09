import os
from kubernetes import client, config

config.load_incluster_config()
v1=client.CoreV1Api()

service = v1.read_namespaced_service('tal-backend', 'default')
ip = service.status.load_balancer.ingress[0].ip
port = service.spec.ports[0].port
print('VUE_APP_API_URL=' + ip + ':' + str(port) + '/api/')
