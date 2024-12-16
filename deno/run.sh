#!/bin/sh

# 获取当前路径
CURRENT_DIR=$(pwd)

# clear log
true > run.log

# npm install
# npm i

# dir
if [ ! -d $CURRENT_DIR/public ]; then
  mkdir -p $CURRENT_DIR/public
fi

# ------------------------------------------------------------------------------------------------
# test
# if [ ! -e ./req.mjs ]; then
# cat > ./req.mjs <<- EOF
# EOF
# fi

if [ -e "/run/secrets/dev_mode" ] && [ 1 -eq $(cat "/run/secrets/dev_mode") ]; then
  echo 'run in dev mode. console.log out to run.log.'
  NO_COLOR=true deno task dev > run.log 2>&1
else
  echo 'run in serve mode. console.log out to run.log.'
  NO_COLOR=true deno task dev > run.log 2>&1
fi
