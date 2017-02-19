FROM mhart/alpine-node

ENV RUNDIR=/usr/src/app

# Create app directory
RUN mkdir -p $RUNDIR
WORKDIR $RUNDIR

# Install app dependencies
COPY package.json $RUNDIR
RUN npm install

COPY . $RUNDIR

EXPOSE 3000

CMD [ "npm", "start" ]
