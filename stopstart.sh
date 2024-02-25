#!/bin/bash
#COUNTER=1
#LOOP=6
#while [  $COUNTER -lt $LOOP ]; do
#    echo The counter is $COUNTER
#    let COUNTER=COUNTER+1 
#done

count=0

while [ $count -lt 5 ]
do
    
    docker stop nest

    sleep 60

    docker start nest
    ((count++))
done