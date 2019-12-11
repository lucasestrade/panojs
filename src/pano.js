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
            switch(typeof element.src){
                case "undefined":
                    Pano.log.error("'CREATE'.'ITEMS' object not valid. At least 'src' parameter is necessary");
                    return;
                case "string":
                    break;
                default:
                    Pano.log.error("'src' parameter must be of type 'string'");
                    return;
            }
            Pano.util.createPano(element, to)
        });
        this.number = function(number){
            for(let i = 1; i < number; i++){
                Pano.create(object);
            }
        }
    },
    util : {
        //create pano
        createPano : function(element, to){
            let elementType = this.getElementType(element.src);
            let parent;
            let typeTo;
            switch(typeof to){
                case "string":
                    let toObject = this.disperseTo(to);
                    if(![".", "#"].includes(toObject.type)){
                        Pano.log.error("The parent target must be focused with an 'id' or a 'class name'");
                        return;
                    }else if(toObject.type === "#"){
                        parent = document.getElementById(toObject.value);
                        typeTo = "id";
                    }else if(toObject.type === "."){
                        parent = document.getElementsByClassName(toObject.value);
                        typeTo = "class";
                    }
                    break;
                case "object":
                    break;
                default:
                    Pano.log.error("'to' parameter must be of type 'string' or 'object'");
            }
            console.log(elementType);
            switch(elementType){
                case "img":
                    this.createPanoElementImg(element, parent, typeTo);
                    break;
                case "video":
                    this.createPanoElementVideo(element, parent, typeTo);
                    break;
                default:
                    Pano.log.error("The file extension is not valid");
                    return;
            }
            switch(typeof element.label){
                case "undefined":
                    break;
                case "string":
                    let newDiv = document.createElement("div");
                    let classAttribute = document.createAttribute("class");
                    classAttribute.value = "--pano-label";
                    newDiv.setAttributeNode(classAttribute);
                    let newLabel = document.createTextNode(element.label);
                    newDiv.appendChild(newLabel);
                    if(typeTo === "class"){
                        for(let i = 0; i < parent.length; i++){
                            parent[i].appendChild(newDiv);
                        }
                    }else{
                        parent.appendChild(newDiv);
                    }
                    break;
                default:
                    Pano.log.error("'label' parameter must be of type 'string'")
            }
        },
        /**
         * disperse the target parent to check if it's focused with an id or a class
         * @param string the parent target value
         * 
         * @return object {type : ... , value : ....} type => [ "." = class , "#" = id ] value => target name without symbol (#/.)
         */
        disperseTo : function(element){
            let type = element[0];
            let value = element.substring(1);
            return {type: type, value: value};
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
            let extension = this.getExtension(element);
            if(validImgExtensions.includes(extension)) 
                return "img";
            else if(validVideoExtensions.includes(extension)) 
                return "video";
            return;
        },
        /**
         * if element type = img => create img pano
         * @param string img path to img
         * @param parent element to be imported
         */
        createPanoElementImg : function(element, parent, typeTo){
            let newImg = document.createElement("img");
            switch(typeof element.alt){
                case "undefined":
                    break;
                case "string":
                    let altAttribute = document.createAttribute("alt");
                    altAttribute.value = element.alt;
                    newImg.setAttributeNode(altAttribute);
                    break;
                default:
                    Pano.log.error("'alt' attribute must be of type 'string'");
                    return;
            }
            let classAttribute = document.createAttribute("class");
            let srcAttribute = document.createAttribute("src");
            classAttribute.value = "--pano-img";
            srcAttribute.value = element.src;
            newImg.setAttributeNode(classAttribute);
            newImg.setAttributeNode(srcAttribute);
            if(typeTo === "class"){
                console.log(parent.length);
                for(let i = 0; i < parent.length; i++){
                    parent[i].appendChild(newImg);
                }
            }else{
                parent.appendChild(newImg);
            }
        },
        /**
         * if element type = video => create video pano
         * @param string video path to video
         * @param parent element to be imported
         */
        createPanoElementVideo : function(element, parent, typeTo){
            let newVideo = document.createElement("video");
            if(typeof element.options === "object"){
                let validOptions = ["controls", "autoplay", "loop", "muted", "preload"];
                let options = element.options;
                for(option in options) {
                    if(validOptions.includes(option)){
                        if(options[option])
                            newVideo.setAttributeNode(document.createAttribute(option));
                    }else{
                        Pano.log.error("At least one video option is not valid");
                        return;
                    }
                }
            }
            let classAttribute = document.createAttribute("class");
            classAttribute.value = "--pano-video";
            newVideo.setAttributeNode(classAttribute);
            let newSource = document.createElement("source");
            let srcAttribute = document.createAttribute("src");
            srcAttribute.value = element.src;
            newSource.setAttributeNode(srcAttribute);
            let typeAttribute = document.createAttribute("type");
            typeAttribute.value = "video/" + this.getExtension(element.src);
            newSource.setAttributeNode(typeAttribute);
            newVideo.appendChild(newSource);
            if(typeTo === "class"){
                for(let i = 0; i < parent.length; i++){
                    parent[i].appendChild(newVideo);
                }
            }else{
                parent.appendChild(newVideo);
            }
        },
        /**
         * get element extension
         * @param element element to get extension
         * 
         * @return string extension
         */
        getExtension : function(element){
            return element.slice(element.indexOf(".", -1) + 1).toLowerCase();
        }
    },
    log : {
        // error logs
        error : function(error){
            console.error("Panojs ERROR => " + error); 
        }
    }
}

Pano = Pano;