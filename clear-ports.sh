#!/bin/bash

echo "=== 포트 정리 시작 ==="

# 3031 포트 사용 중인 프로세스 확인 및 종료
echo "3031 포트 사용 중인 프로세스 확인 중..."
PORT_PIDS=$(lsof -ti:3031)

if [ ! -z "$PORT_PIDS" ]; then
    echo "3031 포트 사용 중인 프로세스 종료 중..."
    kill -9 $PORT_PIDS
    echo "3031 포트 프로세스 종료 완료"
else
    echo "3031 포트 사용 중인 프로세스 없음"
fi

# Node.js 관련 프로세스 확인 및 종료
echo "Node.js 프로세스 확인 중..."
NODE_PIDS=$(ps aux | grep "node" | grep -v "grep" | awk '{print $2}')

if [ ! -z "$NODE_PIDS" ]; then
    echo "Node.js 프로세스 종료 중..."
    kill -9 $NODE_PIDS
    echo "Node.js 프로세스 종료 완료"
else
    echo "실행 중인 Node.js 프로세스 없음"
fi

echo "=== 포트 정리 완료 ===" 