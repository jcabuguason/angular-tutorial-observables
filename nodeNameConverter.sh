#!/bin/bash

OLDIFS=$IFS
IFS=","

while read index name stuff things
do
	echo -e "\"$index\": \"$name\""
done < $1
IFS=$OLDIFS
