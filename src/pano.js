/**
 * panojs v.1.0.0
 * 
 * @author Lucas Estrade 
 * @github author => https://github.com/lucasestrade
 * @github repository => https://github.com/lucasestrade/panojs
 * 
 * Released under the MIT license
 * 
 */

var Pano = {
    create : function(object) {
        if([object.to, object.items].filter(element => typeof element === "undefined").length > 0){
            Pano.log.error("'CREATE' function object not valid. At least 'to', 'items' and 'type' are necessary"); 
            return;
        };
        let to = object.to;
        let items = object.items;
        items.map(element => {
            if(typeof element.el === "undefined"){
                Pano.log.error("'CREATE'.'ITEMS' object not valid. At least 'el' is necessary");
                return;
            }
            Pano.util.createPano(element.el, element.label || null, object.to)
        });
        this.number = function(number){
        }
        //}
    },
    util : {
        //create pano
        createPano : function(element, label, to){
            let elementType = this.getElementType(element);
            console.log(elementType);
            let createdPano;
            switch(elementType){
                case "img":
                    createdPano = this.createPanoElementImg(element);
                    break;
                case "video":
                    createdPano = this.createPanoElementVideo(element);
                    break;
                default:
                    Pano.log.error("The file extension is not valid");
                    return;
            }
            console.log(createdPano);
            let parent = document.getElementById(to);
            parent.appendChild(createdPano);
            if(label !== null){
                let newDiv = document.createElement("div");
                let newLabel = document.createTextNode(label);
                newDiv.appendChild(newLabel);
                parent.appendChild(newDiv);
            }
        },
        /**
         * get element type : video/img
         * @param string element element to be imported
         * 
         * @return string | null img/video according to extension
         */
        getElementType : function(element){
            if(typeof element !== "string"){
                Pano.log.error("'el' is not a string");
                return;
            };
            let validImgExtensions = ["jpg", "png", "jpeg", "gif", "tiff", "webp", "bmp", "svg"];
            let validVideoExtensions = ["mp4", "mov", "avi"];
            let extension = element.slice(element.indexOf(".", -1) + 1).toLowerCase();
            if(validImgExtensions.includes(extension)) 
                return "img";
            else if(validVideoExtensions.includes(extension)) 
                return "video";
            return;
        },
        /**
         * if element type = img => create img pano
         * @param string img path to img
         * 
         * @return newImg img element created
         */
        createPanoElementImg : function(img){
            let newImg = document.createElement("img");
            var classAttribute = document.createAttribute("class");
            var srcAttribute = document.createAttribute("src");
            classAttribute.value = "--pano-img";
            srcAttribute.value = img;
            newImg.setAttributeNode(classAttribute);
            newImg.setAttributeNode(srcAttribute);
            return newImg;
        },
        /**
         * if element type = video => create video pano
         * @param string video path to video
         */
        createPanoElementVideo : function(video){
            console.log("video => " + video);
        }
    },
    log : {
        // error logs
        error : function(error){
            console.error("Panojs fail => " + error); 
        }
    }
}

Pano = Pano;