#!/usr/bin/env bash
echo -e "\e[36mPULLING FRONTEND REPO\e[0m"
git pull
echo -e "\e[36mBUILDING FRONTEND IMAGE\e[0m"
docker build -t gcr.io/arabic-historical-dictionary/tal-frontend-us .
echo -e "\e[36mPUSHING FRONTEND IMAGE\e[0m"
docker push gcr.io/arabic-historical-dictionary/tal-frontend-us
echo -e "\e[36mDELETING DEPLOYMEMENT tal.yaml\e[0m"
kubectl delete -f tal.yaml
echo -e "\e[36mCREATING DEPLOYMENET tal.yaml\e[0m"
kubectl create -f tal.yaml