#!/bin/sh

if [ "$1" == "start" ]; then
	nohup python HttpServer.py &> /dev/null &
fi

if [ "$1" == "stop" ]; then
	for pid in `ps aux | grep python | awk '{print $2}'`; do
		echo $pid
		kill -9 $pid
	done

fi
