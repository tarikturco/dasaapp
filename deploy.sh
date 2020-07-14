docker-compose build dasaapp

source .env

DOCKER_IMAGE_ID=$( docker images --filter=reference=dasaapp --format "{{.ID}}")

aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker tag $DOCKER_IMAGE_ID $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/$REPO_NAME

docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO_NAME

aws ecs run-task --cluster $CLUSTER_NAME --task-definition $MIGRATION_TASK

aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment