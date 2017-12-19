$prepare_nodejs_script = <<SCRIPT
echo 'dns-nameservers 8.8.8.8 192.168.1.83' | sudo tee -a /etc/network/interfaces;
sudo /etc/init.d/networking restart;
service docker stop;
rm -rf /etc/docker/key.json
echo 'DOCKER_OPTS="-H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock --dns 172.17.0.1 --dns 10.0.2.3 --dns 8.8.8.8 --dns-search service.consul"' | tee -a /etc/default/docker;
service docker start;
docker stop $(docker ps -a -q);
docker rm -v $(docker ps -a -q);
docker rmi lsv
docker build -t lsv
docker run  -it -d -p 8080:8080 -p 9990:9990 --name locallsv lsv /opt/jboss/wildfly/bin/standalone.sh -b 0.0.0.0 -bmanagement 0.0.0.0;
SCRIPT

$prepare_mongodb_script = <<SCRIPT
docker stop $(docker ps -a -q);
docker rm -v $(docker ps -a -q);
docker run  -v /mysql:/var/lib/mysql -p 3306:3306 --name localmariadb -e MYSQL_ROOT_PASSWORD=westwest -d mariadb;
#docker run -p 3306:3306 --name localmariadb -e MYSQL_ROOT_PASSWORD=westwest -d mariadb;
SCRIPT

$prepare_wp_script = <<SCRIPT
docker stop $(docker ps -a -q);
docker rm -v $(docker ps -a -q);
docker run  -v /mysql:/var/lib/mysql -p 3306:3306 --name localmariadb -e MYSQL_ROOT_PASSWORD=westwest -d mariadb;
#docker run -p 3306:3306 --name localmariadb -e MYSQL_ROOT_PASSWORD=westwest -d mariadb;
SCRIPT



Vagrant.configure(2) do |config|
  config.vm.define "lsv" do |config|
    config.vm.box = "kwilczynski/ubuntu-16.04-docker"
    config.vm.hostname = "wildfly-docker"
    config.vm.network "private_network", ip: "66.55.44.10"
    config.vm.provision "shell", inline: $prepare_nodejs_script, run: "always"
    config.vm.synced_folder ".", "/vagrant", disabled: false
  end

  config.vm.define "mongodb" do |config|
    config.vm.box = "kwilczynski/ubuntu-16.04-docker"
    config.vm.hostname = "mariadb-docker"
    config.vm.network "private_network", ip: "66.55.44.11"
    config.vm.provision "shell", inline: $prepare_mariadb_docker_script, run: "always"
    config.vm.synced_folder ".", "/vagrant", disabled: false
  end

  config.vm.define "wp" do |config|
    config.vm.box = "kwilczynski/ubuntu-16.04-docker"
    config.vm.hostname = "mariadb-docker"
    config.vm.network "private_network", ip: "66.55.44.12"
    config.vm.provision "shell", inline: $prepare_mariadb_docker_script, run: "always"
    config.vm.synced_folder ".", "/vagrant", disabled: false
  end
end
