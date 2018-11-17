docker build -t danielpayet974/unknowgame .
docker push danielpayet974/unknowgame
ssh -i ~/.ssh/id_rsa root@46.101.25.149 'docker stop $(docker ps -q) && docker pull danielpayet974/unknowgame && docker run -p 80:3000 -dit --restart unless-stopped danielpayet974/unknowgame'