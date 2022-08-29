"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFileTimestamps = exports.relative = exports.isEntry = exports.addWatchIgnore = exports.unescapeRequire = exports.generateContent = void 0;
var path = __importStar(require("path"));
// 添加automatically头
function generateContent(content) {
    return "// This file is automatically generated by build\n" + content;
}
exports.generateContent = generateContent;
// stringify之后用这个 更新require语句
function unescapeRequire(content) {
    return content.replace(/"__(require|asset)\(([^"]+)\)"/g, function (all, cmd, p) {
        if (cmd === 'require') {
            return "require(\"" + p + "\")";
        }
        else if (cmd === 'asset') {
            return "__webpack_public_path__ + \"" + p + "\"";
        }
        return all;
    });
}
exports.unescapeRequire = unescapeRequire;
// 读取stream
// export function readStream(stream) {
//   return new Promise((resolve, reject) => {
//     const chunks = [];
//     stream
//       .on('error', reject)
//       .on('data', chunk => {
//         chunks.push(chunk);
//       })
//       .on('end', () => {
//         resolve(Buffer.concat(chunks));
//       });
//   });
// }
// math匹配
// export function isMatch(fileName, matchList) {
//   if (!Array.isArray(matchList)) {
//     matchList = [matchList];
//   }
//   let included = false;
//   let excluded = false;
//   matchList.forEach(match => {
//     if (match.startsWith('!')) {
//       if (minimatch(fileName, match.slice(1))) {
//         excluded = true;
//       }
//     } else {
//       if (minimatch(fileName, match)) {
//         included = true;
//       }
//     }
//   });
//   return included && !excluded;
// }
// 添加watch ignore
function addWatchIgnore(compiler, ignored) {
    var options = compiler.options;
    // console.log(compiler.options)
    var watchOptions = options.watchOptions
        || (options.devServer && options.devServer.watchOptions)
        || {};
    if (!watchOptions.ignored) {
        watchOptions.ignored = [];
    }
    else if (!Array.isArray(watchOptions.ignored)) {
        watchOptions.ignored = [watchOptions.ignored];
    }
    watchOptions.ignored.push(ignored);
    options.watchOptions = watchOptions;
    // options.devServer.watchOptions = watchOptions;
}
exports.addWatchIgnore = addWatchIgnore;
// 向compilation添加一个asset
// export function addAssetToCompilation(compilation, fileName, content, outFileName) {
//   const { context } = compilation.compiler;
//   const publicName = loaderUtils.interpolateName(
//     {
//       resourcePath: path.join(context, fileName),
//     },
//     outFileName,
//     {
//       content,
//       context,
//     }
//   );
//   compilation.assets[publicName] = {
//     size() {
//       return content.length;
//     },
//     source() {
//       return content;
//     },
//   };
//   return publicName.replace(/\\/g, '/');
// }
// // 获取资源的key名
// export function getRESKey(fileName) {
//   return path.basename(fileName).replace(/\./g, '_');
// }
// 判断文件是否是webpack构建的entry
function isEntry(compiler, resourcePath) {
    var entry = compiler.options.entry;
    if (typeof entry === 'string') {
        entry = {
            index: entry,
        };
    }
    return Object.values(entry).some(function (item) {
        if (!Array.isArray(item)) {
            item = [item];
        }
        return item.some(function (p) {
            p = p.replace(/^.*!/, '');
            // TODO 如果文件没有后缀将判断失误 例如 './src/Main'
            if (!path.isAbsolute(p)) {
                p = path.join(compiler.context, p);
            }
            return p === resourcePath;
        });
    });
}
exports.isEntry = isEntry;
// // 判断是否需要热更新
// export function isHot(compiler) {
//   const { mode, devServer } = compiler.options;
//   return mode === 'development' && devServer && devServer.hot;
// }
// 获取相对路径
// eg: src/Main.ts src/common/Component.ts => ./common/Component.ts
function relative(parent, relative) {
    if (path.isAbsolute(relative)) {
        relative = path.relative(path.dirname(parent), relative).replace(/\\/g, '/');
        if (!/^[\.\/]/.test(relative)) {
            relative = "./" + relative;
        }
    }
    return relative;
}
exports.relative = relative;
// // 同步timestamps
// // 同时清除inputFileSystem缓存
function updateFileTimestamps(compiler, filePath) {
    // 清除inputFileSystem缓存
    compiler.inputFileSystem.purge(filePath);
    if (compiler.fileTimestamps.get(filePath)) {
        var stat = compiler.inputFileSystem.statSync(filePath);
        compiler.fileTimestamps.set(filePath, +stat.mtime);
    }
}
exports.updateFileTimestamps = updateFileTimestamps;
