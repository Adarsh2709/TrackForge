# AWS Deployment Guide for TrackForge (Amazon ECS)

This guide will walk you through deploying your Dockerized Next.js and Spring Boot application to AWS using **Amazon ECR** (for storing images) and **Amazon ECS with AWS Fargate** (for hosting the containers).

## Prerequisites
Before starting, ensure you have the following:
*   An AWS Account.
*   The AWS CLI installed on your computer.
*   You have run `aws configure` in your terminal and provided your AWS Access Key, Secret Key, and default region (e.g., `ap-south-1`).

---

## Phase 1: Amazon ECR (Storing Your Images)
We need to create two secure registries in AWS to hold your Docker images.

### 1. Create the Repositories
1. Log in to the AWS Management Console.
2. Search for **ECR (Elastic Container Registry)** and open it.
3. Click **Create repository**.
4. Name it `trackforge-backend` (leave all other settings default) and click **Create**.
5. Repeat the process to create another repository named `trackforge-frontend`.

### 2. Push the Backend Image
1. In the ECR console, click on your new `trackforge-backend` repository.
2. Click the **View push commands** button in the top right. AWS will give you a list of 4 exact commands to copy and paste into your terminal.
3. Open your terminal in the `d:\TrackForge\backend` directory.
4. Copy and paste the 4 commands one by one.
    *   **Command 1**: Logs Docker into AWS.
    *   **Command 2**: Builds the image (`docker build --platform linux/amd64 -t trackforge-backend .`). **CRITICAL**: The `--platform linux/amd64` flag is required if you are building on a Mac or ARM Windows machine, otherwise the container will crash silently on AWS.
    *   **Command 3**: Tags the image for AWS.
    *   **Command 4**: Pushes the image to AWS (`docker push ...`).

> [!TIP]
> Wait for the push to complete! The Java image might take a few minutes to upload depending on your internet speed.

---

## Phase 2: Deploying the Backend (Amazon ECS)
Unlike App Runner, ECS requires us to create a Cluster (the environment), a Task Definition (the blueprint), and a Service (the running application). We must deploy the backend first so the frontend knows what URL to talk to.

### 1. Create an ECS Cluster
1. In the AWS Console, search for **ECS (Elastic Container Service)**.
2. Click **Clusters** on the left menu, then click **Create cluster**.
3. Cluster name: `trackforge-cluster`.
4. Infrastructure: AWS Fargate (Serverless) should be selected by default.
5. Click **Create**.

### 2. Create the Backend Task Definition
1. On the left menu, click **Task definitions**, then **Create new task definition**.
2. Task definition family: `trackforge-backend-task`.
3. Infrastructure requirements: Select **AWS Fargate**. Operating system: Linux.
4. Under **Container - 1**:
    *   Name: `backend-container`
    *   Image URI: *Paste the URI of your backend image from ECR (e.g., `123456789.dkr.ecr.ap-south-1.amazonaws.com/trackforge-backend:latest`)*
    *   Container port: **8080** (Crucial: This must match our Dockerfile!)
5. Under **Environment variables**, click Add environment variable:
    *   Key: `SPRING_DATA_MONGODB_URI` | Value: `your_mongodb_connection_string`
    *   Key: `GEMINI_API_KEY` | Value: `your_gemini_key`
6. Click **Create** at the bottom.

### 3. Create the Backend Service & Load Balancer
1. Go back to **Clusters** and click on your `trackforge-cluster`.
2. Under the **Services** tab, click **Create**.
3. Environment: Select **Capacity provider strategy** (Fargate).
4. Deployment configuration:
    *   Family: `trackforge-backend-task`
    *   Service name: `trackforge-backend-service`
5. **Networking**: 
    *   Create a new security group. Name it `backend-sg`.
    *   In Inbound rules, ensure Type is Custom TCP, Port is **8080**, and Source is Anywhere.
6. **Load balancing**:
    *   Load balancer type: **Application Load Balancer**
    *   Create a new load balancer. Name it `backend-alb`.
    *   Listener port: **80** HTTP.
    *   Target group name: `backend-tg`.
7. Click **Create** at the bottom. 

> [!NOTE]
> AWS will take about 3-5 minutes to provision the service and the Load Balancer. 
> To find your Backend URL: Search for **EC2** in the AWS console -> Scroll down the left menu to **Load Balancers** -> Click `backend-alb` -> Copy the **DNS name** (e.g., `backend-alb-12345.ap-south-1.elb.amazonaws.com`). You will need this for the frontend!

---

## Phase 3: Push and Deploy the Frontend
Now that the backend is live on the internet behind a Load Balancer, we need to build the frontend and tell it where the backend is.

### 1. Update the Frontend Environment
We cannot use localhost anymore. We need to bake the real AWS ALB DNS name into the frontend image.

Open your `d:\TrackForge\frontend\Dockerfile` and temporarily add this line right above the `RUN npm run build` step (Stage 2):

```dockerfile
ENV NEXT_PUBLIC_API_URL=http://your-backend-alb-dns-name.com
```

### 2. Push the Frontend Image
1. Go back to **ECR** in the AWS Console.
2. Click on the `trackforge-frontend` repository.
3. Click **View push commands**.
4. Open your terminal in `d:\TrackForge\frontend`.
5. Copy and paste the 4 commands to build, tag, and push the frontend image. **IMPORTANT:** When running the `docker build` command, be sure to add `--platform linux/amd64` to it if you are on a Mac or ARM Windows machine.

### 3. Create the Frontend Task Definition
1. Go to **ECS -> Task definitions**, then **Create new task definition**.
2. Task definition family: `trackforge-frontend-task`.
3. Infrastructure: AWS Fargate.
4. Container details:
    *   Name: `frontend-container`
    *   Image URI: *Paste your frontend image URI from ECR*.
    *   Container port: **3000**
5. Click **Create**.

### 4. Create the Frontend Service & Load Balancer
1. Go back to your `trackforge-cluster` and click **Create** under the Services tab.
2. Deployment configuration:
    *   Family: `trackforge-frontend-task`
    *   Service name: `trackforge-frontend-service`
3. **Networking**: 
    *   Create a new security group. Name it `frontend-sg`.
    *   In Inbound rules, ensure Type is Custom TCP, Port is **3000**, and Source is Anywhere.
4. **Load balancing**:
    *   Load balancer type: **Application Load Balancer**
    *   Create a new load balancer. Name it `frontend-alb`.
    *   Listener port: **80** HTTP.
    *   Target group name: `frontend-tg`.
5. Click **Create**.

> [!SUCCESS] 
> Once the frontend deployment finishes, go to **EC2 -> Load Balancers**, find `frontend-alb`, and copy its **DNS name**. Paste this DNS name into your browser. You should see your live, production-ready TrackForge application!
