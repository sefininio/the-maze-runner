# MongoDB access information

## Dev/Staging environment

* Mongo Connection string: `ds129462.mlab.com:29462/maze-prod`
* Database user: `maze` 
* Database password: will be sent separately 

To connect using the mongo shell:

```
mongo ds129462.mlab.com:29462/maze-prod -u maze -p <dbpassword>
```

To connect using a driver via the standard MongoDB URI:

```
mongodb://maze:<dbpassword>@ds129462.mlab.com:29462/maze-prod
```

## Production environment

* Mongo Connection string: `ds129733.mlab.com:29733/maze-dev`
* Database user: `maze` 
* Database password: will be sent separately

To connect using the mongo shell:

```
mongo ds129733.mlab.com:29733/maze-dev -u maze -p <dbpassword>
```

To connect using a driver via the standard MongoDB URI:

```
mongodb://maze:<dbpassword>@ds129733.mlab.com:29733/maze-dev
```