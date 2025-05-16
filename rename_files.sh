#!/bin/bash

# 현재 디렉토리에서 작업 (usdb-exchange1)
# 파일이 있는 위치를 지정합니다. 필요한 경우 수정하세요
SOURCE_DIR="."  # 현재 디렉토리

# 파일이 source 하위 디렉토리에 있는 경우, 아래 줄의 주석을 해제하고 위 줄을 주석 처리하세요
# SOURCE_DIR="./source"

echo "작업 디렉토리: $SOURCE_DIR"

# 지정된 디렉토리로 이동
cd "$SOURCE_DIR" || { echo "디렉토리를 찾을 수 없습니다: $SOURCE_DIR"; exit 1; }

# 현재 디렉토리의 파일 리스트 출력
echo "현재 디렉토리의 파일들:"
ls -la

# 각 파일 처리
count=0
for file in *; do
  if [ -f "$file" ]; then
    # 파일 확장자 가져오기
    ext="${file##*.}"
    # 확장자 없는 파일명 가져오기
    base="${file%.*}"
    
    # JS 중복 처리 (crypto-list-js.js → Crypto-List.js)
    if [[ "$base" == *-js ]] && [[ "$ext" == "js" ]]; then
      base="${base%-js}"
    fi
    
    # 하이픈으로 구분된 각 단어의 첫 글자를 대문자로 변경
    newbase=$(echo "$base" | sed -E 's/(^|-)([a-z])/\1\u\2/g')
    
    # 새 파일명 생성
    newname="${newbase}.${ext}"
    
    # 파일명이 변경된 경우에만 이름 바꾸기
    if [ "$file" != "$newname" ]; then
      echo "이름 변경: $file → $newname"
      mv "$file" "$newname" && ((count++))
    fi
  fi
done

echo "파일 이름 변경 완료! $count 개의 파일 이름을 변경했습니다."
echo "현재 디렉토리의 파일 목록:"
ls -la
