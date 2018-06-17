
TudingBus Client Portal
=============================

### [ Project Installation ]

```
cd path/to/project

npm install
```

### [ Run tests ] (Comming soon)

```
npm test
```

### [ Start development environment ]

**Start development with webpack-dev-server:**
```
npm run dev
```

### [ Build front for production ]
Build without package.json version change. ex: 3.6.11 -> 3.6.11
```
npm run build
```
Build with main version +1. ex: 3.6.11 -> 4.6.11
```
npm run build-major
```
Build with minor version +1. ex: 3.6.11 -> 3.7.11
```
npm run build-minor
```
Build with patch version +1. ex: 3.6.11 -> 3.6.12
```
npm run build-patch
```

### [ Run node server for production ]

```
npm run start
```

### [ Generate documentations ]

```
npm run doc

// then open the index.html in your browser
google-chrome ./docs/index.html
```

### [ ESLint ]

**Disable the default js inspector in your IDE and active the eslint code quality tool.**

**For running ESLint check on JS files manually:**

```
./node_modules/.bin/eslint path/to/your/file.js

./node_modules/.bin/eslint ./src/**/*.js
```
([Learn more about ESLint command line interface](https://eslint.org/docs/user-guide/command-line-interface))

For more details of current ESLint configurations, check the file ".eslintrc.json".

### [ node server ]
port: 8888
### [ webpack-dev-server ]
port: 9000
### [ webpack BundleAnalyzerPlugin ]
port: 8999
