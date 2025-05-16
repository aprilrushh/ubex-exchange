#!/bin/bash

# 잘못 변경된 파일들을 원래 이름으로 복구
mv "ufix-umissing-ufiles.sh" "fix-missing-files.sh"
mv "uorganize-ufiles.sh" "organize-files.sh"
mv "upackage-ulock.json" "package-lock.json"
mv "upackage.json" "package.json"
mv "urename_files.sh" "rename_files.sh"
mv "uusdb-uexchange-ufix-uscript.sh" "usdb-exchange-fix-script.sh"

echo "파일 복구 완료!"
