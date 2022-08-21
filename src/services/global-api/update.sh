# !/bin/bash

#给予shell文件执行权限：chmod a+x update.sh
#执行shell文件：./update.shell

#更新Components.ts接口文件
names=("admin" "captcha" "luckdraw")
for name in ${names[@]}; do
  filename="${name}Components.ts"
  tsurl="https://luck.catli.net/v1/api/${name}/static/${filename}"
  curl_code=$(curl -o new-${filename} --insecure -s -w %{http_code} $tsurl)
  if [ $curl_code != "200" ]; then
    echo "下载失败: $tsurl"
    rm -f "new-${filename}"
    exit
  fi
  echo "${filename} 下载完成"
  rm -f $filename
  mv "new-${filename}" $filename
done

#更新function方法文件
mkdir -p txt
for name in ${names[@]}; do
  filename="${name}.ts"
  tsurl="https://luck.catli.net/v1/api/${name}/static/${filename}"
  curl_code=$(curl -o txt/new-${name}.txt --insecure -s -w %{http_code} $tsurl)
  if [ $curl_code != "200" ]; then
    echo "下载失败: $tsurl"
    rm -f "txt/new-${filename}"
    exit
  fi
  echo "${filename} 下载完成"
  rm -f "txt/${name}.txt"
  mv "txt/new-${name}.txt" "txt/${name}.txt"
done

#创建*-custom.ts文件
for name in ${names[@]}; do
  filename="${name}-custom.ts"
  rm -f $filename
  echo 'import { webapi } from "./webapi"' >$filename
  cat "txt/${name}.txt" >>$filename
  echo "update ${filename} successfully"
done

# 修改admin-custom.ts文件内的 RESTful 方法: list info add put del
#逻辑：查找指定方法名，获取其位置行数，查找下一行 admin/:name/ 后面的名字name，更改方法名为：name方法名
FILENAME="admin-custom.ts"
FUNC_ARR=("list" "info" "add" "put" "del")
for FUNC_NAME in ${FUNC_ARR[@]}; do
  for line in $(grep -n "function ${FUNC_NAME}(" $FILENAME | cut -d ":" -f 1); do
    NEXT_LINE=$(($line + 1))
    NEXT_STR=$(sed -n $(expr ${NEXT_LINE}p) $FILENAME)
    NEXT_LEN=$(echo ${#NEXT_STR})
    START_INDEX=$(echo $(awk -v a="$NEXT_STR" -v b="admin/" 'BEGIN{print index(a,b)}'))
    let START_INDEX+=5
    last_str=${NEXT_STR:START_INDEX:NEXT_LEN}
    search1_index=$(echo $(awk -v a="$last_str" -v b="\"" 'BEGIN{print index(a,b)}'))
    search2_index=$(echo $(awk -v a="$last_str" -v b="/" 'BEGIN{print index(a,b)}'))
    if (($search2_index < $search1_index && $search2_index > 0)); then
      search_index=$search2_index
    else
      search_index=$search1_index
    fi
    let search_index--
    if (($search_index < 0)); then
      echo "panic：search_index < 0；search_index = ${search_index}"
      exit
    fi
    target_name=${last_str:0:search_index}
    # echo $target_name
    if [ -z $target_name ]; then
      continue
    fi
    # LAST=$(($NEXT_LEN - $START_INDEX))
    # END_INDEX=$(($LAST - $N))
    # NAME=${NEXT_STR:START_INDEX:END_INDEX}
    LINE_STR=$(sed -n $(expr ${line}p) $FILENAME)
    firstLetter=${FUNC_NAME:0:1}
    otherLetter=${FUNC_NAME:1}
    firstLetter=$(echo $firstLetter | tr '[:lower:]' '[:upper:]')
    UP_FUNC_NAME=$firstLetter$otherLetter
    NEW_NAME="${target_name}${UP_FUNC_NAME}"
    NEW_LINE_STR=$(echo ${LINE_STR/$FUNC_NAME/$NEW_NAME})
    LINE_STR=$(echo $LINE_STR | sed -e 's/[]\/$*.^[]/\\&/g')
    sed -i "" "${line}s/$LINE_STR/$NEW_LINE_STR/" $FILENAME
  done
done

echo "admin-custom.ts Function name changed successfully"

#给所有的请求方法，加上options入参
ALL_FILES=("admin-custom.ts" "captcha-custom.ts" "luckdraw-custom.ts")
for filename in "${ALL_FILES[@]}"; do
  STR1=") {"
  NEWSTR1=", options?: { [key: string]: any }) {"
  sed -i "" "s/$STR1/$NEWSTR1/" $filename

  STR2="(, options?:"
  STR2=$(echo $STR2 | sed -e 's/[]\/$*.^[]/\\&/g')
  NEWSTR2="(options?:"
  sed -i "" "s/$STR2/$NEWSTR2/" $filename

  STR3=")"
  NEWSTR3=", options)"
  for line in $(sed -n '/return webapi./=' $filename); do
    OLD_STR=$(sed -n $(expr ${line}p) $filename)
    OLD_STR=$(echo $OLD_STR | sed -e 's/[]\/$*.^[]/\\&/g')
    NEW_STR=$(echo ${OLD_STR/$STR3/$NEWSTR3})
    sed -i "" "${line}s/$OLD_STR/$NEW_STR/" $filename
  done
done
echo "admin-custom.ts Function parameter added successfully"

echo "------------------------【update successfully】------------------------"
