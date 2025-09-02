docker rmi mochieve-ui

npm install
npm run build

docker build -t mochieve-ui .