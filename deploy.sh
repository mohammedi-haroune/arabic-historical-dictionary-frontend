#!/usr/bin/env bash
docker build -t gcr.io/arabic-historical-dictionary/tal-frontend .
docker push gcr.io/arabic-historical-dictionary/tal-frontend
kubectl delete -f tal-frontend.yaml
kubectl create -f tal-frontend.yaml