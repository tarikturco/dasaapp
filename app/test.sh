# Just assuring to not drop development db when running this accidentaly
export NODE_ENV=test

npm install

# Reseting the DB
sequelize db:drop
sequelize db:create
sequelize db:migrate

./node_modules/.bin/nyc ./node_modules/.bin/mocha --recursive -b test