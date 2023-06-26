# Hello Node Example

This is a very simple Node.js example used to demonstrate how to...

 - Consume configuration with `dotenv` from a specific location in the filesystem
 - Package a Node.js app in a container image
 - Deploy the image in Kubernetes

The following instructions assume that you have all of the prerequisite
components (e.g., a Kubernetes cluster, Docker, Skaffold, Node, etc) installed
and ready.

## Run the application

To run the application (as a non-image), simply use `node`:

```
$ node index.js
```

Then using `curl` in a separate window make a request to the application:

```
$ curl localhost:8080/hello
Hello world
```

## Create an image

The provided Dockerfile enables you to create an image with `docker build`:

```
$ docker build -t hellonode:v1 .
```

Then you can run the image with `docker run`:

```
$ docker run hellonode:v1
```

## Deploy to Kubernetes

The provided deployment/service manifest (in `k8s/deploy.yaml`) and Skaffold
manifest (`skaffold.yaml`) make it easy to build and deploy to Kubernetes using
the `skaffold` command line:

```
$ skaffold dev
```

This builds the image and puts Skaffold into "dev" mode (which means it will
watch for changes and rebuild/redeploy if any are detected).

The service that is created exposes the application's port through port 31234.
Therefore, you can create a port-forward through to application with the following
`kubectl` command:

```
$ kubectl port-forward kubectl port-forward service/hello-node-svc 8080:31234
```

Then, in a separate terminal window you can send a request to the app using
`curl`:

```
$ curl localhost:8080/hello
Hello world
```

## Configuring with a ConfigMap or Secret

To configure the greeting message with a `ConfigMap` or `Secret`, first create
the `ConfigMap` or `Secret` containing the `.env` file. For example:

```
$ kubectl create secret generic greetingconfig --from-file .env
```

Then uncomment the lines in `k8s/deploy.yaml` that mount that secret:

```
    spec:
      containers:
      - name: hello-node-container
        image: hellonode:0.0.1-SNAPSHOT
        volumeMounts:
        - name: greeting-config
          mountPath: /etc/config
      volumes:
      - name: greeting-config
        secret:
          secretName: greetingconfig
```

If Skaffold is still running in "dev" mode, this change should trigger a
rebuild/redeploy. If not, then run Skaffold in "dev" mode again to deploy
the application with these new changes. You'll also need to reestablish
the port forward because it won't survive a pod restart.

