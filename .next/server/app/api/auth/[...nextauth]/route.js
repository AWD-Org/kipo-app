/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...nextauth]/route";
exports.ids = ["app/api/auth/[...nextauth]/route"];
exports.modules = {

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongoose");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   headerHooks: () => (/* binding */ headerHooks),\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage),\n/* harmony export */   staticGenerationBailout: () => (/* binding */ staticGenerationBailout)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_salomon_Documents_Projects_kipo_app_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/[...nextauth]/route.ts */ \"(rsc)/./src/app/api/auth/[...nextauth]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...nextauth]/route\",\n        pathname: \"/api/auth/[...nextauth]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...nextauth]/route\"\n    },\n    resolvedPagePath: \"/Users/salomon/Documents/Projects/kipo-app/src/app/api/auth/[...nextauth]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_salomon_Documents_Projects_kipo_app_src_app_api_auth_nextauth_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks, headerHooks, staticGenerationBailout } = routeModule;\nconst originalPathname = \"/api/auth/[...nextauth]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ubmV4dGF1dGglNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmF1dGglMkYlNUIuLi5uZXh0YXV0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRnNhbG9tb24lMkZEb2N1bWVudHMlMkZQcm9qZWN0cyUyRmtpcG8tYXBwJTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZVc2VycyUyRnNhbG9tb24lMkZEb2N1bWVudHMlMkZQcm9qZWN0cyUyRmtpcG8tYXBwJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFzRztBQUN2QztBQUNjO0FBQ2tDO0FBQy9HO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixnSEFBbUI7QUFDM0M7QUFDQSxjQUFjLHlFQUFTO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxZQUFZO0FBQ1osQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdUdBQXVHO0FBQy9HO0FBQ0E7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDNko7O0FBRTdKIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8va2lwby1hcHAvPzZkOTciXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1tb2R1bGVzL2FwcC1yb3V0ZS9tb2R1bGUuY29tcGlsZWRcIjtcbmltcG9ydCB7IFJvdXRlS2luZCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2Z1dHVyZS9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiL1VzZXJzL3NhbG9tb24vRG9jdW1lbnRzL1Byb2plY3RzL2tpcG8tYXBwL3NyYy9hcHAvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvc2Fsb21vbi9Eb2N1bWVudHMvUHJvamVjdHMva2lwby1hcHAvc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MsIGhlYWRlckhvb2tzLCBzdGF0aWNHZW5lcmF0aW9uQmFpbG91dCB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvWy4uLm5leHRhdXRoXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBoZWFkZXJIb29rcywgc3RhdGljR2VuZXJhdGlvbkJhaWxvdXQsIG9yaWdpbmFsUGF0aG5hbWUsIHBhdGNoRmV0Y2gsICB9O1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHAtcm91dGUuanMubWFwIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./models/User.js":
/*!************************!*\
  !*** ./models/User.js ***!
  \************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\nconst bcrypt = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\nconst UserSchema = new mongoose.Schema({\n    name: {\n        type: String,\n        required: [\n            true,\n            \"Por favor proporciona un nombre\"\n        ],\n        trim: true\n    },\n    email: {\n        type: String,\n        required: [\n            true,\n            \"Por favor proporciona un email\"\n        ],\n        unique: true,\n        lowercase: true,\n        match: [\n            /^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$/,\n            \"Por favor proporciona un email v\\xe1lido\"\n        ]\n    },\n    password: {\n        type: String,\n        required: [\n            true,\n            \"Por favor proporciona una contrase\\xf1a\"\n        ],\n        minlength: 6,\n        select: false\n    },\n    monthlyIncome: {\n        type: Number,\n        default: 0\n    },\n    monthlyExpenses: {\n        type: Number,\n        default: 0\n    },\n    mainExpenseCategories: {\n        type: [\n            String\n        ],\n        default: []\n    },\n    savingsGoal: {\n        type: Number,\n        default: 0\n    },\n    referralSource: {\n        type: String,\n        default: \"\"\n    },\n    createdAt: {\n        type: Date,\n        default: Date.now\n    },\n    isOnboarded: {\n        type: Boolean,\n        default: false\n    }\n});\n// Encriptar contraseña usando bcrypt\nUserSchema.pre(\"save\", async function(next) {\n    if (!this.isModified(\"password\")) {\n        next();\n    }\n    const salt = await bcrypt.genSalt(10);\n    this.password = await bcrypt.hash(this.password, salt);\n});\n// Método para verificar contraseña\nUserSchema.methods.matchPassword = async function(enteredPassword) {\n    return await bcrypt.compare(enteredPassword, this.password);\n};\nmodule.exports = mongoose.models.User || mongoose.model(\"User\", UserSchema);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9tb2RlbHMvVXNlci5qcyIsIm1hcHBpbmdzIjoiQUFBQSxNQUFNQSxXQUFXQyxtQkFBT0EsQ0FBQztBQUN6QixNQUFNQyxTQUFTRCxtQkFBT0EsQ0FBQztBQUV2QixNQUFNRSxhQUFhLElBQUlILFNBQVNJLE1BQU0sQ0FBQztJQUNyQ0MsTUFBTTtRQUNKQyxNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUFrQztRQUNuREMsTUFBTTtJQUNSO0lBQ0FDLE9BQU87UUFDTEosTUFBTUM7UUFDTkMsVUFBVTtZQUFDO1lBQU07U0FBaUM7UUFDbERHLFFBQVE7UUFDUkMsV0FBVztRQUNYQyxPQUFPO1lBQ0w7WUFDQTtTQUNEO0lBQ0g7SUFDQUMsVUFBVTtRQUNSUixNQUFNQztRQUNOQyxVQUFVO1lBQUM7WUFBTTtTQUF1QztRQUN4RE8sV0FBVztRQUNYQyxRQUFRO0lBQ1Y7SUFDQUMsZUFBZTtRQUNiWCxNQUFNWTtRQUNOQyxTQUFTO0lBQ1g7SUFDQUMsaUJBQWlCO1FBQ2ZkLE1BQU1ZO1FBQ05DLFNBQVM7SUFDWDtJQUNBRSx1QkFBdUI7UUFDckJmLE1BQU07WUFBQ0M7U0FBTztRQUNkWSxTQUFTLEVBQUU7SUFDYjtJQUNBRyxhQUFhO1FBQ1hoQixNQUFNWTtRQUNOQyxTQUFTO0lBQ1g7SUFDQUksZ0JBQWdCO1FBQ2RqQixNQUFNQztRQUNOWSxTQUFTO0lBQ1g7SUFDQUssV0FBVztRQUNUbEIsTUFBTW1CO1FBQ05OLFNBQVNNLEtBQUtDLEdBQUc7SUFDbkI7SUFDQUMsYUFBYTtRQUNYckIsTUFBTXNCO1FBQ05ULFNBQVM7SUFDWDtBQUNGO0FBRUEscUNBQXFDO0FBQ3JDaEIsV0FBVzBCLEdBQUcsQ0FBQyxRQUFRLGVBQWdCQyxJQUFJO0lBQ3pDLElBQUksQ0FBQyxJQUFJLENBQUNDLFVBQVUsQ0FBQyxhQUFhO1FBQ2hDRDtJQUNGO0lBRUEsTUFBTUUsT0FBTyxNQUFNOUIsT0FBTytCLE9BQU8sQ0FBQztJQUNsQyxJQUFJLENBQUNuQixRQUFRLEdBQUcsTUFBTVosT0FBT2dDLElBQUksQ0FBQyxJQUFJLENBQUNwQixRQUFRLEVBQUVrQjtBQUNuRDtBQUVBLG1DQUFtQztBQUNuQzdCLFdBQVdnQyxPQUFPLENBQUNDLGFBQWEsR0FBRyxlQUFnQkMsZUFBZTtJQUNoRSxPQUFPLE1BQU1uQyxPQUFPb0MsT0FBTyxDQUFDRCxpQkFBaUIsSUFBSSxDQUFDdkIsUUFBUTtBQUM1RDtBQUVBeUIsT0FBT0MsT0FBTyxHQUFHeEMsU0FBU3lDLE1BQU0sQ0FBQ0MsSUFBSSxJQUFJMUMsU0FBUzJDLEtBQUssQ0FBQyxRQUFReEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raXBvLWFwcC8uL21vZGVscy9Vc2VyLmpzPzczNjciXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbW9uZ29vc2UgPSByZXF1aXJlKCdtb25nb29zZScpO1xuY29uc3QgYmNyeXB0ID0gcmVxdWlyZSgnYmNyeXB0anMnKTtcblxuY29uc3QgVXNlclNjaGVtYSA9IG5ldyBtb25nb29zZS5TY2hlbWEoe1xuICBuYW1lOiB7XG4gICAgdHlwZTogU3RyaW5nLFxuICAgIHJlcXVpcmVkOiBbdHJ1ZSwgJ1BvciBmYXZvciBwcm9wb3JjaW9uYSB1biBub21icmUnXSxcbiAgICB0cmltOiB0cnVlLFxuICB9LFxuICBlbWFpbDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogW3RydWUsICdQb3IgZmF2b3IgcHJvcG9yY2lvbmEgdW4gZW1haWwnXSxcbiAgICB1bmlxdWU6IHRydWUsXG4gICAgbG93ZXJjYXNlOiB0cnVlLFxuICAgIG1hdGNoOiBbXG4gICAgICAvXlxcdysoW1xcLi1dP1xcdyspKkBcXHcrKFtcXC4tXT9cXHcrKSooXFwuXFx3ezIsM30pKyQvLFxuICAgICAgJ1BvciBmYXZvciBwcm9wb3JjaW9uYSB1biBlbWFpbCB2w6FsaWRvJyxcbiAgICBdLFxuICB9LFxuICBwYXNzd29yZDoge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICByZXF1aXJlZDogW3RydWUsICdQb3IgZmF2b3IgcHJvcG9yY2lvbmEgdW5hIGNvbnRyYXNlw7FhJ10sXG4gICAgbWlubGVuZ3RoOiA2LFxuICAgIHNlbGVjdDogZmFsc2UsXG4gIH0sXG4gIG1vbnRobHlJbmNvbWU6IHtcbiAgICB0eXBlOiBOdW1iZXIsXG4gICAgZGVmYXVsdDogMCxcbiAgfSxcbiAgbW9udGhseUV4cGVuc2VzOiB7XG4gICAgdHlwZTogTnVtYmVyLFxuICAgIGRlZmF1bHQ6IDAsXG4gIH0sXG4gIG1haW5FeHBlbnNlQ2F0ZWdvcmllczoge1xuICAgIHR5cGU6IFtTdHJpbmddLFxuICAgIGRlZmF1bHQ6IFtdLFxuICB9LFxuICBzYXZpbmdzR29hbDoge1xuICAgIHR5cGU6IE51bWJlcixcbiAgICBkZWZhdWx0OiAwLFxuICB9LFxuICByZWZlcnJhbFNvdXJjZToge1xuICAgIHR5cGU6IFN0cmluZyxcbiAgICBkZWZhdWx0OiAnJyxcbiAgfSxcbiAgY3JlYXRlZEF0OiB7XG4gICAgdHlwZTogRGF0ZSxcbiAgICBkZWZhdWx0OiBEYXRlLm5vdyxcbiAgfSxcbiAgaXNPbmJvYXJkZWQ6IHtcbiAgICB0eXBlOiBCb29sZWFuLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICB9LFxufSk7XG5cbi8vIEVuY3JpcHRhciBjb250cmFzZcOxYSB1c2FuZG8gYmNyeXB0XG5Vc2VyU2NoZW1hLnByZSgnc2F2ZScsIGFzeW5jIGZ1bmN0aW9uIChuZXh0KSB7XG4gIGlmICghdGhpcy5pc01vZGlmaWVkKCdwYXNzd29yZCcpKSB7XG4gICAgbmV4dCgpO1xuICB9XG4gIFxuICBjb25zdCBzYWx0ID0gYXdhaXQgYmNyeXB0LmdlblNhbHQoMTApO1xuICB0aGlzLnBhc3N3b3JkID0gYXdhaXQgYmNyeXB0Lmhhc2godGhpcy5wYXNzd29yZCwgc2FsdCk7XG59KTtcblxuLy8gTcOpdG9kbyBwYXJhIHZlcmlmaWNhciBjb250cmFzZcOxYVxuVXNlclNjaGVtYS5tZXRob2RzLm1hdGNoUGFzc3dvcmQgPSBhc3luYyBmdW5jdGlvbiAoZW50ZXJlZFBhc3N3b3JkKSB7XG4gIHJldHVybiBhd2FpdCBiY3J5cHQuY29tcGFyZShlbnRlcmVkUGFzc3dvcmQsIHRoaXMucGFzc3dvcmQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBtb25nb29zZS5tb2RlbHMuVXNlciB8fCBtb25nb29zZS5tb2RlbCgnVXNlcicsIFVzZXJTY2hlbWEpO1xuIl0sIm5hbWVzIjpbIm1vbmdvb3NlIiwicmVxdWlyZSIsImJjcnlwdCIsIlVzZXJTY2hlbWEiLCJTY2hlbWEiLCJuYW1lIiwidHlwZSIsIlN0cmluZyIsInJlcXVpcmVkIiwidHJpbSIsImVtYWlsIiwidW5pcXVlIiwibG93ZXJjYXNlIiwibWF0Y2giLCJwYXNzd29yZCIsIm1pbmxlbmd0aCIsInNlbGVjdCIsIm1vbnRobHlJbmNvbWUiLCJOdW1iZXIiLCJkZWZhdWx0IiwibW9udGhseUV4cGVuc2VzIiwibWFpbkV4cGVuc2VDYXRlZ29yaWVzIiwic2F2aW5nc0dvYWwiLCJyZWZlcnJhbFNvdXJjZSIsImNyZWF0ZWRBdCIsIkRhdGUiLCJub3ciLCJpc09uYm9hcmRlZCIsIkJvb2xlYW4iLCJwcmUiLCJuZXh0IiwiaXNNb2RpZmllZCIsInNhbHQiLCJnZW5TYWx0IiwiaGFzaCIsIm1ldGhvZHMiLCJtYXRjaFBhc3N3b3JkIiwiZW50ZXJlZFBhc3N3b3JkIiwiY29tcGFyZSIsIm1vZHVsZSIsImV4cG9ydHMiLCJtb2RlbHMiLCJVc2VyIiwibW9kZWwiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./models/User.js\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/[...nextauth]/route.ts":
/*!*************************************************!*\
  !*** ./src/app/api/auth/[...nextauth]/route.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ handler),\n/* harmony export */   POST: () => (/* binding */ handler)\n/* harmony export */ });\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./src/lib/auth.ts\");\n// src/app/api/auth/[...nextauth]/route.ts\n\n\nconst handler = next_auth__WEBPACK_IMPORTED_MODULE_0___default()(_lib_auth__WEBPACK_IMPORTED_MODULE_1__.authOptions);\n\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL1suLi5uZXh0YXV0aF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSwwQ0FBMEM7QUFDVDtBQUNRO0FBRXpDLE1BQU1FLFVBQVVGLGdEQUFRQSxDQUFDQyxrREFBV0E7QUFFTyIsInNvdXJjZXMiOlsid2VicGFjazovL2tpcG8tYXBwLy4vc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzPzAwOTgiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2FwcC9hcGkvYXV0aC9bLi4ubmV4dGF1dGhdL3JvdXRlLnRzXG5pbXBvcnQgTmV4dEF1dGggZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IHsgYXV0aE9wdGlvbnMgfSBmcm9tIFwiQC9saWIvYXV0aFwiO1xuXG5jb25zdCBoYW5kbGVyID0gTmV4dEF1dGgoYXV0aE9wdGlvbnMpO1xuXG5leHBvcnQgeyBoYW5kbGVyIGFzIEdFVCwgaGFuZGxlciBhcyBQT1NUIH07XG4iXSwibmFtZXMiOlsiTmV4dEF1dGgiLCJhdXRoT3B0aW9ucyIsImhhbmRsZXIiLCJHRVQiLCJQT1NUIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/[...nextauth]/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/auth.ts":
/*!*************************!*\
  !*** ./src/lib/auth.ts ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n/* harmony import */ var _lib_mongodb__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/mongodb */ \"(rsc)/./src/lib/mongodb.js\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../models/User */ \"(rsc)/./models/User.js\");\n/* harmony import */ var _models_User__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_models_User__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! bcryptjs */ \"(rsc)/./node_modules/bcryptjs/index.js\");\n/* harmony import */ var bcryptjs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(bcryptjs__WEBPACK_IMPORTED_MODULE_3__);\n// src/lib/auth.ts\n\n\n\n\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            id: \"credentials\",\n            name: \"Credenciales\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Contrase\\xf1a\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                if (!credentials?.email || !credentials?.password) {\n                    throw new Error(\"Email y contrase\\xf1a son requeridos\");\n                }\n                await (0,_lib_mongodb__WEBPACK_IMPORTED_MODULE_1__.connectToDatabase)();\n                const user = await _models_User__WEBPACK_IMPORTED_MODULE_2___default().findOne({\n                    email: credentials.email\n                }).select(\"+password\");\n                if (!user) throw new Error(\"Usuario no encontrado\");\n                const isValid = await bcryptjs__WEBPACK_IMPORTED_MODULE_3___default().compare(credentials.password, user.password);\n                if (!isValid) throw new Error(\"Contrase\\xf1a incorrecta\");\n                return {\n                    id: user._id.toString(),\n                    name: user.name,\n                    email: user.email,\n                    isOnboarded: user.isOnboarded\n                };\n            }\n        })\n    ],\n    pages: {\n        signIn: \"/login\",\n        error: \"/login\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            if (user) {\n                token.id = user.id;\n                token.isOnboarded = user.isOnboarded;\n            }\n            return token;\n        },\n        async session ({ session, token }) {\n            if (token) {\n                session.user = {\n                    ...session.user,\n                    id: token.id,\n                    isOnboarded: token.isOnboarded\n                };\n            }\n            return session;\n        }\n    },\n    session: {\n        strategy: \"jwt\",\n        maxAge: 30 * 24 * 60 * 60\n    },\n    secret: process.env.NEXTAUTH_SECRET,\n    debug: \"development\" === \"development\"\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2F1dGgudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLGtCQUFrQjtBQUVnRDtBQUNoQjtBQUNiO0FBQ1A7QUFFdkIsTUFBTUksY0FBK0I7SUFDeENDLFdBQVc7UUFDUEwsMkVBQW1CQSxDQUFDO1lBQ2hCTSxJQUFJO1lBQ0pDLE1BQU07WUFDTkMsYUFBYTtnQkFDVEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQWNDLE1BQU07Z0JBQVc7WUFDdEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN2QixJQUFJLENBQUNBLGFBQWFDLFNBQVMsQ0FBQ0QsYUFBYUksVUFBVTtvQkFDL0MsTUFBTSxJQUFJRSxNQUFNO2dCQUNwQjtnQkFDQSxNQUFNYiwrREFBaUJBO2dCQUN2QixNQUFNYyxPQUFPLE1BQU1iLDJEQUFZLENBQUM7b0JBQzVCTyxPQUFPRCxZQUFZQyxLQUFLO2dCQUM1QixHQUFHUSxNQUFNLENBQUM7Z0JBQ1YsSUFBSSxDQUFDRixNQUFNLE1BQU0sSUFBSUQsTUFBTTtnQkFDM0IsTUFBTUksVUFBVSxNQUFNZix1REFBYyxDQUNoQ0ssWUFBWUksUUFBUSxFQUNwQkcsS0FBS0gsUUFBUTtnQkFFakIsSUFBSSxDQUFDTSxTQUFTLE1BQU0sSUFBSUosTUFBTTtnQkFFOUIsT0FBTztvQkFDSFIsSUFBSVMsS0FBS0ssR0FBRyxDQUFDQyxRQUFRO29CQUNyQmQsTUFBTVEsS0FBS1IsSUFBSTtvQkFDZkUsT0FBT00sS0FBS04sS0FBSztvQkFDakJhLGFBQWFQLEtBQUtPLFdBQVc7Z0JBQ2pDO1lBQ0o7UUFDSjtLQUNIO0lBQ0RDLE9BQU87UUFDSEMsUUFBUTtRQUNSQyxPQUFPO0lBQ1g7SUFDQUMsV0FBVztRQUNQLE1BQU1DLEtBQUksRUFBRUMsS0FBSyxFQUFFYixJQUFJLEVBQUU7WUFDckIsSUFBSUEsTUFBTTtnQkFDTmEsTUFBTXRCLEVBQUUsR0FBR1MsS0FBS1QsRUFBRTtnQkFDbEJzQixNQUFNTixXQUFXLEdBQUcsS0FBY0EsV0FBVztZQUNqRDtZQUNBLE9BQU9NO1FBQ1g7UUFDQSxNQUFNQyxTQUFRLEVBQUVBLE9BQU8sRUFBRUQsS0FBSyxFQUFFO1lBQzVCLElBQUlBLE9BQU87Z0JBQ1BDLFFBQVFkLElBQUksR0FBRztvQkFDWCxHQUFHYyxRQUFRZCxJQUFJO29CQUNmVCxJQUFJc0IsTUFBTXRCLEVBQUU7b0JBQ1pnQixhQUFhTSxNQUFNTixXQUFXO2dCQUNsQztZQUNKO1lBQ0EsT0FBT087UUFDWDtJQUNKO0lBQ0FBLFNBQVM7UUFDTEMsVUFBVTtRQUNWQyxRQUFRLEtBQUssS0FBSyxLQUFLO0lBQzNCO0lBQ0FDLFFBQVFDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtJQUNuQ0MsT0FBT0gsa0JBQXlCO0FBQ3BDLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raXBvLWFwcC8uL3NyYy9saWIvYXV0aC50cz82NjkyIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHNyYy9saWIvYXV0aC50c1xuaW1wb3J0IHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSBcIm5leHQtYXV0aFwiO1xuaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSBcIm5leHQtYXV0aC9wcm92aWRlcnMvY3JlZGVudGlhbHNcIjtcbmltcG9ydCB7IGNvbm5lY3RUb0RhdGFiYXNlIH0gZnJvbSBcIkAvbGliL21vbmdvZGJcIjtcbmltcG9ydCBVc2VyIGZyb20gXCIuLi8uLi9tb2RlbHMvVXNlclwiO1xuaW1wb3J0IGJjcnlwdCBmcm9tIFwiYmNyeXB0anNcIjtcblxuZXhwb3J0IGNvbnN0IGF1dGhPcHRpb25zOiBOZXh0QXV0aE9wdGlvbnMgPSB7XG4gICAgcHJvdmlkZXJzOiBbXG4gICAgICAgIENyZWRlbnRpYWxzUHJvdmlkZXIoe1xuICAgICAgICAgICAgaWQ6IFwiY3JlZGVudGlhbHNcIixcbiAgICAgICAgICAgIG5hbWU6IFwiQ3JlZGVuY2lhbGVzXCIsXG4gICAgICAgICAgICBjcmVkZW50aWFsczoge1xuICAgICAgICAgICAgICAgIGVtYWlsOiB7IGxhYmVsOiBcIkVtYWlsXCIsIHR5cGU6IFwiZW1haWxcIiB9LFxuICAgICAgICAgICAgICAgIHBhc3N3b3JkOiB7IGxhYmVsOiBcIkNvbnRyYXNlw7FhXCIsIHR5cGU6IFwicGFzc3dvcmRcIiB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFzeW5jIGF1dGhvcml6ZShjcmVkZW50aWFscykge1xuICAgICAgICAgICAgICAgIGlmICghY3JlZGVudGlhbHM/LmVtYWlsIHx8ICFjcmVkZW50aWFscz8ucGFzc3dvcmQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRW1haWwgeSBjb250cmFzZcOxYSBzb24gcmVxdWVyaWRvc1wiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYXdhaXQgY29ubmVjdFRvRGF0YWJhc2UoKTtcbiAgICAgICAgICAgICAgICBjb25zdCB1c2VyID0gYXdhaXQgVXNlci5maW5kT25lKHtcbiAgICAgICAgICAgICAgICAgICAgZW1haWw6IGNyZWRlbnRpYWxzLmVtYWlsLFxuICAgICAgICAgICAgICAgIH0pLnNlbGVjdChcIitwYXNzd29yZFwiKTtcbiAgICAgICAgICAgICAgICBpZiAoIXVzZXIpIHRocm93IG5ldyBFcnJvcihcIlVzdWFyaW8gbm8gZW5jb250cmFkb1wiKTtcbiAgICAgICAgICAgICAgICBjb25zdCBpc1ZhbGlkID0gYXdhaXQgYmNyeXB0LmNvbXBhcmUoXG4gICAgICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzLnBhc3N3b3JkLFxuICAgICAgICAgICAgICAgICAgICB1c2VyLnBhc3N3b3JkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzVmFsaWQpIHRocm93IG5ldyBFcnJvcihcIkNvbnRyYXNlw7FhIGluY29ycmVjdGFcIik7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgICAgICBpZDogdXNlci5faWQudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogdXNlci5uYW1lLFxuICAgICAgICAgICAgICAgICAgICBlbWFpbDogdXNlci5lbWFpbCxcbiAgICAgICAgICAgICAgICAgICAgaXNPbmJvYXJkZWQ6IHVzZXIuaXNPbmJvYXJkZWQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgIF0sXG4gICAgcGFnZXM6IHtcbiAgICAgICAgc2lnbkluOiBcIi9sb2dpblwiLFxuICAgICAgICBlcnJvcjogXCIvbG9naW5cIixcbiAgICB9LFxuICAgIGNhbGxiYWNrczoge1xuICAgICAgICBhc3luYyBqd3QoeyB0b2tlbiwgdXNlciB9KSB7XG4gICAgICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgICAgIHRva2VuLmlkID0gdXNlci5pZDtcbiAgICAgICAgICAgICAgICB0b2tlbi5pc09uYm9hcmRlZCA9ICh1c2VyIGFzIGFueSkuaXNPbmJvYXJkZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdG9rZW47XG4gICAgICAgIH0sXG4gICAgICAgIGFzeW5jIHNlc3Npb24oeyBzZXNzaW9uLCB0b2tlbiB9KSB7XG4gICAgICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uLnVzZXIgPSB7XG4gICAgICAgICAgICAgICAgICAgIC4uLnNlc3Npb24udXNlciEsXG4gICAgICAgICAgICAgICAgICAgIGlkOiB0b2tlbi5pZCBhcyBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgIGlzT25ib2FyZGVkOiB0b2tlbi5pc09uYm9hcmRlZCBhcyBib29sZWFuLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHNlc3Npb246IHtcbiAgICAgICAgc3RyYXRlZ3k6IFwiand0XCIsXG4gICAgICAgIG1heEFnZTogMzAgKiAyNCAqIDYwICogNjAsXG4gICAgfSxcbiAgICBzZWNyZXQ6IHByb2Nlc3MuZW52Lk5FWFRBVVRIX1NFQ1JFVCxcbiAgICBkZWJ1ZzogcHJvY2Vzcy5lbnYuTk9ERV9FTlYgPT09IFwiZGV2ZWxvcG1lbnRcIixcbn07XG4iXSwibmFtZXMiOlsiQ3JlZGVudGlhbHNQcm92aWRlciIsImNvbm5lY3RUb0RhdGFiYXNlIiwiVXNlciIsImJjcnlwdCIsImF1dGhPcHRpb25zIiwicHJvdmlkZXJzIiwiaWQiLCJuYW1lIiwiY3JlZGVudGlhbHMiLCJlbWFpbCIsImxhYmVsIiwidHlwZSIsInBhc3N3b3JkIiwiYXV0aG9yaXplIiwiRXJyb3IiLCJ1c2VyIiwiZmluZE9uZSIsInNlbGVjdCIsImlzVmFsaWQiLCJjb21wYXJlIiwiX2lkIiwidG9TdHJpbmciLCJpc09uYm9hcmRlZCIsInBhZ2VzIiwic2lnbkluIiwiZXJyb3IiLCJjYWxsYmFja3MiLCJqd3QiLCJ0b2tlbiIsInNlc3Npb24iLCJzdHJhdGVneSIsIm1heEFnZSIsInNlY3JldCIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJkZWJ1ZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/mongodb.js":
/*!****************************!*\
  !*** ./src/lib/mongodb.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   connectToDatabase: () => (/* binding */ connectToDatabase),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! mongoose */ \"mongoose\");\n/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);\n\nconst MONGODB_URI = process.env.MONGODB_URI;\nif (!MONGODB_URI) {\n    throw new Error(\"Por favor define la variable de entorno MONGODB_URI dentro de .env.local\");\n}\n/**\n * Variables globales para almacenar el estado de la conexión\n */ let cached = global.mongoose;\nif (!cached) {\n    cached = global.mongoose = {\n        conn: null,\n        promise: null\n    };\n}\n/**\n * Función para conectar a MongoDB\n */ async function connectToDatabase() {\n    if (cached.conn) {\n        return cached.conn;\n    }\n    if (!cached.promise) {\n        const opts = {\n            useNewUrlParser: true,\n            useUnifiedTopology: true\n        };\n        cached.promise = mongoose__WEBPACK_IMPORTED_MODULE_0___default().connect(MONGODB_URI, opts).then((mongoose)=>{\n            return mongoose;\n        });\n    }\n    cached.conn = await cached.promise;\n    return cached.conn;\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connectToDatabase);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL21vbmdvZGIuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFnQztBQUVoQyxNQUFNQyxjQUFjQyxRQUFRQyxHQUFHLENBQUNGLFdBQVc7QUFFM0MsSUFBSSxDQUFDQSxhQUFhO0lBQ2hCLE1BQU0sSUFBSUcsTUFDUjtBQUVKO0FBRUE7O0NBRUMsR0FDRCxJQUFJQyxTQUFTQyxPQUFPTixRQUFRO0FBRTVCLElBQUksQ0FBQ0ssUUFBUTtJQUNYQSxTQUFTQyxPQUFPTixRQUFRLEdBQUc7UUFBRU8sTUFBTTtRQUFNQyxTQUFTO0lBQUs7QUFDekQ7QUFFQTs7Q0FFQyxHQUNNLGVBQWVDO0lBQ3BCLElBQUlKLE9BQU9FLElBQUksRUFBRTtRQUNmLE9BQU9GLE9BQU9FLElBQUk7SUFDcEI7SUFFQSxJQUFJLENBQUNGLE9BQU9HLE9BQU8sRUFBRTtRQUNuQixNQUFNRSxPQUFPO1lBQ1hDLGlCQUFpQjtZQUNqQkMsb0JBQW9CO1FBQ3RCO1FBRUFQLE9BQU9HLE9BQU8sR0FBR1IsdURBQWdCLENBQUNDLGFBQWFTLE1BQU1JLElBQUksQ0FBQyxDQUFDZDtZQUN6RCxPQUFPQTtRQUNUO0lBQ0Y7SUFFQUssT0FBT0UsSUFBSSxHQUFHLE1BQU1GLE9BQU9HLE9BQU87SUFDbEMsT0FBT0gsT0FBT0UsSUFBSTtBQUNwQjtBQUVBLGlFQUFlRSxpQkFBaUJBLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9raXBvLWFwcC8uL3NyYy9saWIvbW9uZ29kYi5qcz84YjAzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBtb25nb29zZSBmcm9tICdtb25nb29zZSc7XG5cbmNvbnN0IE1PTkdPREJfVVJJID0gcHJvY2Vzcy5lbnYuTU9OR09EQl9VUkk7XG5cbmlmICghTU9OR09EQl9VUkkpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFxuICAgICdQb3IgZmF2b3IgZGVmaW5lIGxhIHZhcmlhYmxlIGRlIGVudG9ybm8gTU9OR09EQl9VUkkgZGVudHJvIGRlIC5lbnYubG9jYWwnXG4gICk7XG59XG5cbi8qKlxuICogVmFyaWFibGVzIGdsb2JhbGVzIHBhcmEgYWxtYWNlbmFyIGVsIGVzdGFkbyBkZSBsYSBjb25leGnDs25cbiAqL1xubGV0IGNhY2hlZCA9IGdsb2JhbC5tb25nb29zZTtcblxuaWYgKCFjYWNoZWQpIHtcbiAgY2FjaGVkID0gZ2xvYmFsLm1vbmdvb3NlID0geyBjb25uOiBudWxsLCBwcm9taXNlOiBudWxsIH07XG59XG5cbi8qKlxuICogRnVuY2nDs24gcGFyYSBjb25lY3RhciBhIE1vbmdvREJcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbm5lY3RUb0RhdGFiYXNlKCkge1xuICBpZiAoY2FjaGVkLmNvbm4pIHtcbiAgICByZXR1cm4gY2FjaGVkLmNvbm47XG4gIH1cblxuICBpZiAoIWNhY2hlZC5wcm9taXNlKSB7XG4gICAgY29uc3Qgb3B0cyA9IHtcbiAgICAgIHVzZU5ld1VybFBhcnNlcjogdHJ1ZSxcbiAgICAgIHVzZVVuaWZpZWRUb3BvbG9neTogdHJ1ZSxcbiAgICB9O1xuXG4gICAgY2FjaGVkLnByb21pc2UgPSBtb25nb29zZS5jb25uZWN0KE1PTkdPREJfVVJJLCBvcHRzKS50aGVuKChtb25nb29zZSkgPT4ge1xuICAgICAgcmV0dXJuIG1vbmdvb3NlO1xuICAgIH0pO1xuICB9XG5cbiAgY2FjaGVkLmNvbm4gPSBhd2FpdCBjYWNoZWQucHJvbWlzZTtcbiAgcmV0dXJuIGNhY2hlZC5jb25uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0VG9EYXRhYmFzZTtcbiJdLCJuYW1lcyI6WyJtb25nb29zZSIsIk1PTkdPREJfVVJJIiwicHJvY2VzcyIsImVudiIsIkVycm9yIiwiY2FjaGVkIiwiZ2xvYmFsIiwiY29ubiIsInByb21pc2UiLCJjb25uZWN0VG9EYXRhYmFzZSIsIm9wdHMiLCJ1c2VOZXdVcmxQYXJzZXIiLCJ1c2VVbmlmaWVkVG9wb2xvZ3kiLCJjb25uZWN0IiwidGhlbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/mongodb.js\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/next-auth","vendor-chunks/@babel","vendor-chunks/jose","vendor-chunks/openid-client","vendor-chunks/uuid","vendor-chunks/oauth","vendor-chunks/@panva","vendor-chunks/yallist","vendor-chunks/preact-render-to-string","vendor-chunks/oidc-token-hash","vendor-chunks/bcryptjs","vendor-chunks/preact","vendor-chunks/object-hash","vendor-chunks/lru-cache","vendor-chunks/cookie"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...nextauth%5D%2Froute.ts&appDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fsalomon%2FDocuments%2FProjects%2Fkipo-app&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();