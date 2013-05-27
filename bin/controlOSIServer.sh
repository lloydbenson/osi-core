#!/bin/bash

OSI_HOME=~/app/osi-server
OSI_NODE_MODULES_HOME=${OSI_HOME}/node_modules
OSI_CFG=${OSI_HOME}/cfg/osi-server.json
OSI_LOG=${OSI_HOME}/log/osi-server.log
TIMEOUT=30

start(){
        if [ $($0 status | grep "OSI is running" | wc -l) -eq 1 ];
        then
echo "OSI is already running"
                exit 2
        else
before="$(date +%s)"
                ## hack because hapi doesnt support absolute paths
                cd ${OSI_HOME}
                ${OSI_NODE_MODULES_HOME}/hapi/bin/hapi -c ${OSI_CFG} -p ${OSI_NODE_MODULES_HOME} > ${OSI_LOG} 2>&1 &
                ## wait at least 5 secs before checking
                echo -n "Checking Log file ${OSI_LOG} for status..."
                sleep 5
                while true;
                do
echo -n "."
                        ## now check to see if it actually started
                        ## change this to sleep for 10s and make sure node is still running since no more logging is done
                        sleep 10
                        if [ $(ps -ef | grep node | grep hapi | wc -l) -gt 0 ];
                        then
after="$(date +%s)"
                                elapsed_seconds="$(expr $after - $before)"
                                echo "Started: Total Time is ($elapsed_seconds seconds)"
                                ## let's show the status too
                                $0 status
                                exit 0
                        fi
sleep 3
                        TOTAL_TIME=$((${TOTAL_TIME}+3))
                        ## check to see if we have waited too long
                        if [ ${TOTAL_TIME} -ge ${TIMEOUT} ]
                        then
echo "Failed. We have exceeded the ${TIMEOUT} Time interval"
                                exit 1
                        fi
done
fi

}

stop(){
        if [ $($0 status | grep "OSI is running" | wc -l) -eq 1 ];
        then
before="$(date +%s)"
                kill
echo -n "Checking for PID of OSI..."
                sleep 5
                while true;
                do
echo -n "."
                        if [ $($0 status | grep NOT | wc -l) -eq 1 ];
                        then
after="$(date +%s)"
                                elapsed_seconds="$(expr $after - $before)"
                                echo "Stopped: Total Time is ($elapsed_seconds seconds)"
                                $0 status
                                exit 0
                        fi
sleep 3
                        TOTAL_TIME=$((${TOTAL_TIME}+3))
                        ## check to see if we have waited too long
                        if [ ${TOTAL_TIME} -ge ${TIMEOUT} ]
                        then
echo "Failed. We have exceeded the ${TIMEOUT} Time interval"
                                exit 1
                        fi
done
fi
        $0 status
}

kill(){
        if [ $($0 status | grep NOT | wc -l) -eq 0 ];
        then
                /bin/kill -9 `ps -ef | grep node | grep hapi | grep -v grep | awk '{ print $2 }'`
        else
echo "Looks like its already killed"
        fi
        $0 status
}

status(){
        THE_PID=`ps -ef | grep node | grep -v grep | grep hapi | awk '{ print $2 }'`
        if [ "${THE_PID}" ];
        then
echo "OSI is running with PID (${THE_PID})"
        else
echo "OSI is NOT running."
        fi
}

# See how we were called.
case "$1" in
start)
 start
 ;;
stop)
 kill
 ;;
kill)
 kill
 ;;
status)
 status
 ;;
restart)
 $0 stop
 sleep 5
 $0 start
 ;;
*)
 echo $"Usage: $0 {start|stop|status|kill|restart}"
 exit 1
esac

exit 0
