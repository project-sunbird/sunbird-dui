# install
 - `npm install -g purescript@0.10.7` 
 - `npm i -g pulp@10.0.1`
 - `npm i`
 - `npm i bower -g`
 - `bower i`
 - `mkdir dist`
 - `cp -a __dist/. dist/`

  use sudo if ACCESS ERROR

# ip changes if not running locally (port forwarding)
- MainActivity.java 
```
private static final String BASE_URL = "http://IP_ADDRESS:8080"
 
```
- package.json
 
```
 
"start": "pulp --watch build & webpack-dev-server --inline --watch --hot --content-base dist/ --host  IP_ADDRESS"
 
```
- node_modules/sockjs-client/lib/main.js
  line no. 33

  ```
   
  if(url=="http:/sockjs-node"){
    url="http://IP_ADDRESS:8080/sockjs-node"             
  }
  
  ```

 # run
 - `npm start`