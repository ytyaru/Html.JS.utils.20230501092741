#!/usr/bin/env bash
# 本スクリプトを実行すると、index.htmlで表示するリンク集を作成するためのテキストファイルを作成する。
cd "$(dirname $0)/test"
ls -1 > ../test-file-names.txt
