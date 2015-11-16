#!/bin/sh -ex

#PATH=/s/gcc-4.9.2/bin:/usr/bin:/bin


########################################################################
#
#  download, unpack, and reorganize sources
#


sudo apt-get update
sudo apt-get install nodejs-legacy
sudo apt-get install npm
npm set registry http://registry.npmjs.org/
sudo npm install -g cordova
sudo npm install -g ionic
sudo apt-get install git git-core

rm -rf src
rm -rf build
mkdir build
{
cd build
git clone git://github.com/wszamotula/WisCARES-Ionic.git
cd WisCARES-Ionic
ionic serve
}

########################################################################
#
#  configure and build
#



########################################################################
#
#  install
#


