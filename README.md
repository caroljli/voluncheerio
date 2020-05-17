# Voluncheerio :fried_egg:

**Webapp Contributers:** Andrew Cui and Carol Li

### Description
Welcome to Voluncheerio, an all-inclusive mobile- and web-application for dynamic volunteer management of non-profits.
The web application is purposed for organization administrators to create, view, and delete organizations with public organization pages, as well as managing volunteer profiles.
The mobile application is for volunteer to manage and view shifts, organizations, and review organizations.

### Technology Stack
| Technology     | Stack              |
|----------------|--------------------|
| Front-End      | React, Redux, CSS  |
| Back-End       | Node, Express      |
| Design System  | Semantic UI        |
| Database       | Mongo DB, AWS S3   |

### Web Deployment Instructions

```javascript
// install dependencies for server & client
npm install && npm run client-install

// run client & server with concurrently
npm run dev

// server runs on http://localhost:5000 and client on http://localhost:3000
```

Troubleshooting (depends on computer):
```javascript
// if the above installation doesn't work
cat requirements.txt | xargs npm install -g

// if server doesn't run using the above, run the following (in order)
npm start dev
npm run dev
```
