# HowTo Build

Run: yarn dev  
or npm run debug

Deploy Database:  
docker-compose up -d  
prisma deploy  
(if post-step not worky: graphql get-schema --project database)