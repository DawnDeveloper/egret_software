"use strict";function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var r={};if(null!=e)for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&(r[t]=e[t]);return r.default=e,r}function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}var _regenerator=require("babel-runtime/regenerator"),_regenerator2=_interopRequireDefault(_regenerator),_asyncToGenerator2=require("babel-runtime/helpers/asyncToGenerator"),_asyncToGenerator3=_interopRequireDefault(_asyncToGenerator2),generate=function(){var e=(0,_asyncToGenerator3.default)(_regenerator2.default.mark(function e(r){var t,a,n,i,u,o,_=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return _regenerator2.default.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return t=r||process.cwd(),a=_path2.default.resolve(_path2.default.resolve(__dirname,"../"),"../"),n=_path2.default.join(a,"tpl"),i=(0,_utils.copySignFile)(t,a,CONFIG,_),u=(0,_utils.createMainifestJson)(n,t,t,(0,_utils.getSuggestPackNameJson)("",t)),o=_path2.default.join(t,CONFIG.DEST_DIR),_fsExtra2.default.emptyDirSync(o),e.next=9,(0,_pack.signDir)(null,t,o,u.option,i,_);case 9:case"end":return e.stop()}},e,this)}));return function(r){return e.apply(this,arguments)}}(),_path=require("path"),_path2=_interopRequireDefault(_path),_fsExtra=require("fs-extra"),_fsExtra2=_interopRequireDefault(_fsExtra),_utils=require("../utils"),_pack=require("../pack"),_config=require("../config/config"),CONFIG=_interopRequireWildcard(_config);module.exports=generate;