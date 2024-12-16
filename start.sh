#!/bin/sh

# 工程启动脚本

# 获取当前路径
CURRENT_DIR=$(pwd)

# ------------------------------------------------------------------------------------------------
# 检查 Docker 是否安装
# Check if Docker is installed
if command -v docker >/dev/null 2>&1; then
  # Docker 已安装，输出版本信息
  # Docker is installed and version information is output.
  docker_version=$(docker --version)
  echo "$docker_version"
else
  # Docker 未安装
  curl -o get-docker.sh https://get.docker.com
  chmod +x get-docker.sh
  sh get-docker.sh
  rm get-docker.sh

  if command -v docker >/dev/null 2>&1; then
    exit 1
  fi
fi

# 如果要使用vscode-deno 需要先在服务器上安装deno
# https://docs.deno.com/runtime/getting_started/installation/
# ------------------------------------------------------------------------------------------------
# 检查 deno 是否安装
# Check if deno is installed
if command -v deno >/dev/null 2>&1; then
  # deno 已安装，输出版本信息
  # deno is installed and version information is output.
  deno_version=$(deno --version)
  echo "$deno_version"
else
  # deno 未安装
  curl -fsSL https://deno.land/install.sh | sh

  if command -v deno >/dev/null 2>&1; then
    exit 1
  fi
fi

# 停止容器组
docker compose down

# ------------------------------------------------------------------------------------------------
# 初始化目录

if [ ! -d $CURRENT_DIR/docker/secrets ]; then
  mkdir -p $CURRENT_DIR/docker/secrets
fi

if [ ! -d $CURRENT_DIR/docker/redis ]; then
  mkdir -p $CURRENT_DIR/docker/redis
fi

if [ ! -d $CURRENT_DIR/docker/db ]; then
  mkdir -p $CURRENT_DIR/docker/db
fi

if [ ! -d $CURRENT_DIR/docker/db/psql ]; then
  mkdir -p $CURRENT_DIR/docker/db/psql
fi

# ------------------------------------------------------------------------------------------------
# 初始化 secrets

if [ ! -e $CURRENT_DIR/docker/secrets/dev_mode ]; then
  echo 0 > $CURRENT_DIR/docker/secrets/dev_mode
fi

# ------------------------------------------------------------------------------------------------
# 初始化 run.sh

if [ ! -d $CURRENT_DIR/deno ]; then
  mkdir -p $CURRENT_DIR/deno
fi

if [ ! -e $CURRENT_DIR/deno/run.sh ]; then
  echo true > $CURRENT_DIR/deno/run.sh
fi

# 设置目录权限，否则psql会创建失败
chmod 777 -Rf .

# ------------------------------------------------------------------------------------------------
# docker compose 文件
cat > $CURRENT_DIR/docker-compose.yml <<- EOF
# 密钥
secrets:
  dev_mode:
    file: $CURRENT_DIR/docker/secrets/dev_mode

# 服务
services:
  redis: &redis
    image: redis:7.4.1-alpine3.20
    restart: unless-stopped
    tty: true
    volumes:
      - $CURRENT_DIR:$CURRENT_DIR
      - $CURRENT_DIR/docker/redis/data:/data:delegated
    secrets:
      - dev_mode

# https://hub.docker.com/r/bitnami/postgresql
# postgresql创建后会默认创建数据库'postgres'，超级用户'postgres'

  psql:
    image: bitnami/postgresql:17.0.0
    restart: unless-stopped
    tty: true
    volumes_from:
      - redis
    volumes:
      - $CURRENT_DIR/docker/db/psql:/bitnami/postgresql:delegated
    environment:
      ALLOW_EMPTY_PASSWORD: true

  app:
    image: node:20.18.0-alpine3.20
    # restart: unless-stopped
    tty: true
    depends_on:
      - redis
      - psql
    volumes_from:
      - redis
    secrets:
      - dev_mode
    working_dir: $CURRENT_DIR/node
    entrypoint: $CURRENT_DIR/node/run.sh

  deno:
    image: denoland/deno:ubuntu
    # restart: unless-stopped
    tty: true
    depends_on:
      - redis
      - psql
    volumes_from:
      - redis
    volumes:
      - /root/.cache/deno:/root/.cache/deno:delegated
    secrets:
      - dev_mode
    working_dir: $CURRENT_DIR/deno
    entrypoint: $CURRENT_DIR/deno/run.sh
EOF

# ------------------------------------------------------------------------------------------------
# docker compose 环境配置文件 初始化
if [ ! -e $CURRENT_DIR/docker-compose.env.yml ]; then
cat > $CURRENT_DIR/docker-compose.env.yml <<- EOF
# 服务
services:
  app:
    ports:
      - 18001:3000
  redis:
    ports:
      - 127.0.0.1:18002:6379
  psql:
    ports:
      - 127.0.0.1:18003:5432
EOF
fi

# 启动容器组
docker compose -f docker-compose.yml -f docker-compose.env.yml up -d
