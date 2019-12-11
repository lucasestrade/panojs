/**
 * panojs v.1.0.0
 * 
 * PanoJS is the best way to easily create caroussels 
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
        let n = 1;
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
            // create each pano
            Pano.util.createPano(object, element, to, n);
            n++;
        });
        this.number = function(number){
            for(let i = 1; i < number; i++){
                Pano.create(object);
            }
        }
    },
    util : {
        /**
         * create a pano
         * @param {object} object global parameters
         * @param {object} element items parameters
         * @param {string} to file path
         * @param {number} n unique index
         */
        createPano : function(object, element, to, n){
            let elementType = this.getElementType(element.src);
            let parent;
            let typeTo;
            let newBlock = document.createElement("div");
            let blockStyleAttribute = document.createAttribute("style");
            blockStyleAttribute.value = "";
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
            let defaultValue = "width:200px; height:200px;";
            this.createStyleAttribute(object.style, blockStyleAttribute, defaultValue)
            newBlock.setAttributeNode(blockStyleAttribute);
            let blockClassAttribute = document.createAttribute("class");
            let blockIdAttribute = document.createAttribute("id");
            blockClassAttribute.value = "--pano-block";
            blockIdAttribute.value = "--pano-block-" + n;
            newBlock.setAttributeNode(blockClassAttribute);
            newBlock.setAttributeNode(blockIdAttribute);
            if(typeTo === "class"){
                for(let i = 0; i < parent.length; i++){
                    parent[i].appendChild(newBlock);
                }
            }else{
                parent.appendChild(newBlock);
            }
            switch(elementType){
                case "img":
                    this.createPanoElementImg(element, newBlock, n);
                    break;
                case "video":
                    this.createPanoElementVideo(element, newBlock, n);
                    break;
                default:
                    Pano.log.error("The file extension is not valid");
                    return;
            }
            this.createLabel(element, newBlock, n);
        },
        /**
         * create label in pano
         * @param {string} element element
         * @param {HTMLAllCollection} block block parent
         * @param {number} n unique index
         */
        createLabel : function(element, block, n){
            switch(typeof element.label){
                case "undefined":
                    break;
                case "string":
                    let newDiv = document.createElement("div");
                    let styleAttribute = document.createAttribute("style");
                    let defaultValue = "background-color:#000000; color:#FFFFFF;";
                    this.createLabelStyleAttribute(element.labelOptions, styleAttribute, defaultValue);
                    let classAttribute = document.createAttribute("class");
                    let idAttribute = document.createAttribute("id");
                    classAttribute.value = "--pano-label";
                    idAttribute.value = "--pano-label-" + n;
                    newDiv.setAttributeNode(classAttribute);
                    newDiv.setAttributeNode(idAttribute);
                    newDiv.setAttributeNode(styleAttribute);
                    let newLabel = document.createTextNode(element.label);
                    newDiv.appendChild(newLabel);
                    block.appendChild(newDiv);
                    break;
                default:
                    Pano.log.error("'label' parameter must be of type 'string'")
            }
        },
        /**
         * create label style attribute
         * @param {object} styles object with styles types
         * @param {HtmlAttributes} attribute html style attribute
         * @param {string} defaultValue default value if no value inserted
         */
        createLabelStyleAttribute : function(labelOptions, attribute, defaultValue){
            attribute.value = "";
            switch(typeof labelOptions){
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    if(Object.keys(labelOptions).length > 0){
                        for(labelOption in labelOptions){
                            switch(labelOption){
                                case "color":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'color' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "color:" + labelOptions[labelOption] + ";";
                                    break;
                                case "backgroundColor":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'backgroundColor' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "background-color:" + labelOptions[labelOption] + ";";
                                    break;
                                case "textAlign":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'textAlign' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "text-align:" + labelOptions[labelOption] + ";";
                                    break;
                                case "fontSize":
                                    if(typeof labelOptions[labelOption] !== "number"){
                                        Pano.log.error("'fontSize' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "font-size:" + labelOptions[labelOption] + "px;";
                                    break;
                                case "textIndent":
                                    if(typeof labelOptions[labelOption] !== "number"){
                                        Pano.log.error("'textIndent' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "text-indent:" + labelOptions[labelOption] + "px;";
                                    break;
                                case "fontFamily":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'fontFamily' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "font-family:" + labelOptions[labelOption] + ";";
                                    break;
                                case "boxShadow":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'boxShadow' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "box-shadow:" + labelOptions[labelOption] + ";";
                                    break;
                                case "textShadow":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'textShadow' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "text-shadow:" + labelOptions[labelOption] + ";";
                                    break;
                                case "border":
                                    if(typeof labelOptions[labelOption] !== "string"){
                                        Pano.log.error("'border' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "border:" + labelOptions[labelOption] + ";";
                                    break;
                                case "borderRadius":
                                    if(typeof labelOptions[labelOption] !== "number"){
                                        Pano.log.error("'borderRadius' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "border-radius:" + labelOptions[labelOption] + "px;";
                                    break;
                                default:
                                    Pano.log.error("Invalid value for 'labelOption'");
                                    return;
                            }
                        }
                    }else{
                        attribute.value += defaultValue;
                    }
                    break;
                default:
                    Pano.log.error("'labelOptions' property must be of type 'object'");
                    return;
            }
        },
        /**
         * create style attribute
         * @param {object} styles object with styles types
         * @param {HtmlAttributes} attribute html style attribute
         * @param {string} defaultValue default value if no value inserted
         */
        createStyleAttribute : function(styles, attribute, defaultValue){
            switch(typeof styles){
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    console.log(styles);
                    if(Object.keys(styles).length > 0){
                        for(style in styles){
                            console.log(style);
                            attribute.value += style + ":" + styles[style];
                            if(typeof styles[style] === "number"){
                                attribute.value += "px";
                            }
                            attribute.value += ";";
                        }
                    }else{
                        attribute.value += defaultValue;
                    }
                    break;
                default:
                    Pano.log.error("'style' property must be of type 'object'");
                    return;
            }
        },
        /**
         * disperse the target parent to check if it's focused with an id or a class
         * @param {string} the parent target value
         * 
         * @return {object} {type : ... , value : ....} type => [ "." = class , "#" = id ] value => target name without symbol (#/.)
         */
        disperseTo : function(element){
            let type = element[0];
            let value = element.substring(1);
            return {type: type, value: value};
        },
        /**
         * get element type : video/img
         * @param {string} element element to be imported
         * 
         * @return {string} | null img/video according to extension
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
         * @param {string} img path to img
         * @param {parent} element to be imported
         * @param {integer} n unique element id
         */
        createPanoElementImg : function(element, parent, n){
            let newImg = document.createElement("div");
            let styleAttribute = document.createAttribute("style");
            let defaultValue = "background-size: contain; background-position: center;";
            this.createImgStyleAttribute(element.imgOptions, styleAttribute, defaultValue);
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
            let idAttribute = document.createAttribute("id");
            classAttribute.value = "--pano-img";
            styleAttribute.value = "background-image: url(" + element.src + ");";
            idAttribute.value = "--pano-img-" + n;
            newImg.setAttributeNode(classAttribute);
            newImg.setAttributeNode(styleAttribute);
            newImg.setAttributeNode(idAttribute);
            parent.appendChild(newImg);
        },
        /**
         * create img style attribute
         * @param {object} styles object with styles types
         * @param {HtmlAttributes} attribute html style attribute
         * @param {string} defaultValue default value if no value inserted
         */
        createImgStyleAttribute : function(imgOptions, attribute, defaultValue){
            attribute.value = "";
            switch(typeof imgOptions){
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    if(Object.keys(imgOptions).length > 0){
                        for(imgOption in imgOptions){
                            switch(imgOption){
                                case "backgroundSize":
                                    if(typeof imgOptions[imgOption] !== "string"){
                                        Pano.log.error("'backgroundSize' option must be of type 'string'");
                                        return;
                                    }
                                    attribute.value += "background-size:" + imgOptions[imgOption] + ";";
                                    break;
                                case "backgroundPosition":
                                    if(typeof imgOptions[imgOption] !== "string"){
                                        Pano.log.error("'backgroundPosition' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "background-position:" + imgOptions[imgOption] + ";";
                                    break;
                                case "boxShadow":
                                    if(typeof imgOptions[imgOption] !== "string"){
                                        Pano.log.error("'boxShadow' option must be of type 'number'");
                                        return;
                                    }
                                    attribute.value += "box-shadow:" + imgOptions[imgOption] + ";";
                                    break;
                                case "onClick":
                                    break;
                                default:
                                    Pano.log.error("'" + imgOption + "' is not a valid value for 'imgOption'");
                                    return;
                            }
                        }
                    }else{
                        attribute.value += defaultValue;
                    }
                    break;
                default:
                    Pano.log.error("'imgOptions' property must be of type 'object'");
                    return;
            }
        },
        /**
         * if element type = video => create video pano
         * @param {string} video path to video
         * @param {HTMLAllCollection} element to be imported
         * @param {integer} n unique element id
         */
        createPanoElementVideo : function(element, parent, n){
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
            let idAttribute = document.createAttribute("id");
            classAttribute.value = "--pano-video";
            idAttribute.value = "--pano-video-" + n;
            newVideo.setAttributeNode(classAttribute);
            newVideo.setAttributeNode(idAttribute);
            let newSource = document.createElement("source");
            let srcAttribute = document.createAttribute("src");
            srcAttribute.value = element.src;
            newSource.setAttributeNode(srcAttribute);
            let typeAttribute = document.createAttribute("type");
            typeAttribute.value = "video/" + this.getExtension(element.src);
            newSource.setAttributeNode(typeAttribute);
            newVideo.appendChild(newSource);
            parent.appendChild(newVideo);
        },
        /**
         * get element extension
         * @param {element} element to get extension
         * 
         * @return {string} extension
         */
        getExtension : function(element){
            return element.slice(element.indexOf(".", -1) + 1).toLowerCase();
        }
    },
    log : {
        /**
         * display error into user console
         * @param {string} error error value
         */
        error : function(error){
            console.error("Panojs ERROR => " + error); 
        }
    }
}

let cssPath = 'file:///C:/Users/Lucas/Desktop/panojs/src/assets/style/style.css'; 
var head  = document.getElementsByTagName('head')[0];
var link  = document.createElement('link');
link.rel  = 'stylesheet';
link.type = 'text/css';
link.href = cssPath;
head.appendChild(link);

Pano = Pano;