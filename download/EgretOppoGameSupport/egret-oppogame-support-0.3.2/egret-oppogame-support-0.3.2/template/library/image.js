/**
 * 重写的图片加载器，代替引擎默认的图片加载器
 * 该代码中包含了大量日志用于辅助开发者调试
 * 正式上线时请开发者手动删除这些注释
 */
class ImageProcessor {
    onLoadStart(host, resource) {
        let scale9Grid;
        const {
            root,
            url,
            scale9grid
        } = resource;
        if (scale9grid) {
            const list = resource.scale9grid.split(",");
            scale9Grid = new egret.Rectangle(parseInt(list[0]), parseInt(list[1]), parseInt(list[2]), parseInt(list[3]));
        }
        let imageSrc = root + url;
        if (RES['getVirtualUrl']) {
            imageSrc = RES['getVirtualUrl'](imageSrc);
        }
        let oppo_path = window.oppo_path;
        if (oppo_path.isRemotePath(imageSrc)) { //判断是本地加载还是网络加载
            if (!needCache(imageSrc)) {//通过缓存机制判断是否本地加载
                //无需缓存加载
                return loadImage(imageSrc, scale9Grid);
            } else {
                //通过缓存机制加载
                const fullname = oppo_path.getLocalFilePath(imageSrc);
                if (oppo_fs.existsSync(fullname)) {
                    //本地有缓存
                    return loadImage(oppo_path.getUserPath(fullname))
                } else {
                    //本地没有缓存,下载
                    return oppo_fs.downloadFile(imageSrc, fullname).then(() => {
                        //下载完成，再从缓存里读取
                        return loadImage(oppo_path.getUserPath(fullname), scale9Grid);
                    }, () => {
                        return;
                    })
                }
            }

        } else {
            //本地加载
            return loadImage(imageSrc, scale9Grid);
        }

    }

    onRemoveStart(host, resource) {
        let texture = host.get(resource);
        texture.dispose();
        return Promise.resolve();
    }
}

function loadImage(imageURL, scale9grid) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function (event) {
            const bitmapdata = new egret.BitmapData(image);
            const texture = new egret.Texture();
            texture._setBitmapData(bitmapdata);
            if (scale9grid) {
                texture["scale9Grid"] = scale9grid;
            }
            setTimeout(() => {
                resolve(texture);
            }, 0);
        }
        image.onerror = function () {
            reject()
        }
        image.src = imageURL;
    })
}
/**
 * 由于小游戏限制只有50M的资源可以本地存储，
 * 所以开发者应根据URL进行判断，将特定资源进行本地缓存
 */
function needCache(assUrl) {
    if (assUrl.indexOf("remote/resource/") >= 0) {
        return true;
    } else {
        return false;
    }
}


RES.processor.map("image", new ImageProcessor());
