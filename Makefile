c:
	-docker container rm `docker container ls -aq`
	-docker rmi `docker images -aq`
	-docker-compose down
	# rm -r myvol/*
	# mkdir myvol/pgdata myvol/workdir
	# docker-compose build
	# docker-compose run --service-ports nodejs