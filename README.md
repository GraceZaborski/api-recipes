# Campaigns API (WIP)

This is the new Campaigns API IFR

## API Docs

Available on any deployed instance of the api: https://frontier.aether.staging.beamery.engineer/api-campaigns/docs/swagger

## Local dev

### Dependencies:

- node 18
- docker
- docker-compose`
- [beamery-platform-tooling](https://beameryhq.atlassian.net/wiki/spaces/EN/pages/696058077/Beamery+Cluster+Toolbox#Setup)
- [gitleaks](https://github.com/zricethezav/gitleaks)

### To run the app:

To start dependencies (mongo):

```
yarn docker:dev:start
```

To forward Chimera for ACL/Auth service:

```
kube_cloudflare.sh beamery-staging kubectl port-forward -n aether svc/auth 50050
```

```
export CHIMERA_AUTH_SERVICE_LOADBALANCER=localhost &&\
export CHIMERA_AUTH_PORT=50050

```

```
yarn start

```

### Interacting with the API

You'll first need to get an authentication token with;

```
yarn get-token
```

This will output `x-token-payload` with needs to be supplied to the API as a header, like follows;

```
x-token-payload: <your token>
```

eg.

```
curl localhost:8080/my-end-point \
 --header 'x-token-payload:<your token>'
```
