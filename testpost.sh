#!/bin/bash
CHANNEL="#hogehoge"
MESSAGE="テストです"
redis-cli publish $CHANNEL $MESSAGE
