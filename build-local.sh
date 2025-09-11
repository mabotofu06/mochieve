docker-compose -p mochieve down

cd ./mochieve-ui
sh build.sh
cd -

cd ./mochieve-bl
sh build.sh
cd -

docker-compose -p mochieve up -d --build