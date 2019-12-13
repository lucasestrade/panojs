/**
 * panojs v.1.0.0
 * 
 * PanoJS is the best way to easily create caroussels 
 * 
 * @author Lucas Estrade 
 * @github author => https://github.com/lucasestrade
 * @github repository => https://github.com/lucasestrade/panojs
 * 
 * Copyright 2019, Lucas Estrade
 * Released under the MIT license
 * 
 */

var Pano = {
    create: function (to, object) {
        if ([to, object.type, object.items].filter(element => typeof element === "undefined").length > 0) {
            Pano.log.error("'CREATE' function object not valid. At least 'to', 'items' and 'type' are necessary");
            return;
        };
        let toObject;
        let typeTo;
        if (typeof to === "string") {
            toObject = Pano.util.disperseTo(to);
            if (![".", "#"].includes(toObject.type)) {
                Pano.log.error("The parent target must be focused with an 'id' or a 'class name'");
                return;
            } else if (toObject.type === "#") {
                typeTo = "id";
            } else if (toObject.type === ".") {
                typeTo = "class";
            } else {
                Pano.log.error("'to' parameter must focus an 'id' or 'class' html element");
                return;
            }
        } else {
            Pano.log.error("'to' parameter must be of type 'string'");
            return;
        }
        let toTypeValueObject = {
            type: typeTo,
            value: toObject.value
        };
        let items = object.items;
        let panoLayout = {
            type: object.type,
            set: object.set,
            dots: object.dots,
            panoOptions: object.panoOptions,
        };
        let rand = new Date().getTime() + Math.floor((Math.random() * 10000) + 1).toString(16);
        let n = 0;
        let mainBlock;
        let parent = Pano.util.createElement("div", {
            className: Pano.providers.parentClass,
            id: Pano.providers.parentId + rand
        });
        if (toTypeValueObject.type === "id") {
            mainBlock = document.getElementById(toTypeValueObject.value);
            mainBlock.append(parent);
        } else if (toTypeValueObject.type === "class") {
            mainBlock = document.getElementsByClassName(toTypeValueObject.value);
            for (let i = 0; i < mainBlock.length; i++) {
                mainBlock[i].append(parent);
            }
        }
        Pano.providers.mainBlockObject = { type: toTypeValueObject.type, value: mainBlock };
        items.map(element => {
            switch (typeof element.src) {
                case "undefined":
                    Pano.log.error("'CREATE'.'ITEMS' object not valid. At least 'src' parameter is necessary");
                    return;
                case "string":
                    break;
                default:
                    Pano.log.error("'src' parameter must be of type 'string'");
                    return;
            }
            n++;
            // create each pano
            Pano.util.createPano(object, element, parent, rand + n);
        });
        Pano.util.createPanoLayout(parent, panoLayout, rand + n, n);
        this.number = function (number) {
            for (let i = 1; i < number; i++) {
                Pano.create(object);
            }
        }
    },
    util: {
        /**
         * create a pano
         * @param {object} object global parameters
         * @param {object} element items parameters
         * @param {HTMLAllCollection} parent html element parent
         * @param {string} uniqId unique index
         */
        createPano: function (object, element, parent, uniqId) {
            let elementType = this.getElementType(element.src);
            let blockStyleAttribute = document.createAttribute("style");
            blockStyleAttribute.value = "";
            let defaultValue = Pano.providers.defaultPanoStyle;
            this.createStyleAttribute(object.panoOptions, blockStyleAttribute, defaultValue);
            let newBlock = this.createElement("div", {
                id: Pano.providers.panoId + uniqId,
                className: Pano.providers.panoClass
            });
            console.log(newBlock);
            newBlock.setAttributeNode(blockStyleAttribute);
            parent.appendChild(newBlock);
            let linkBlock;
            switch (elementType) {
                case "img":
                    linkBlock = this.createPanoElementImg(element, newBlock, uniqId);
                    break;
                case "video":
                    this.createPanoElementVideo(element, newBlock, uniqId);
                    break;
                default:
                    Pano.log.error("The file extension is not valid");
                    return;
            }
            if (typeof linkBlock === "undefined")
                this.createLabel(element, newBlock, uniqId);
            else
                this.createLabel(element, linkBlock, uniqId);
        },
        /**
         * create label in pano
         * @param {string} element element
         * @param {HTMLAllCollection} block block parent
         * @param {string} uniqId unique index
         */
        createLabel: function (element, block, uniqId) {
            switch (typeof element.label) {
                case "undefined":
                    break;
                case "string":
                    let newDiv = this.createElement("div", {
                        id: Pano.providers.labelId + uniqId,
                        className: Pano.providers.labelClass,
                        textContent: element.label
                    });
                    let styleAttribute = document.createAttribute("style");
                    let defaultValue = Pano.providers.defaultLabelStyle;
                    this.createLabelStyleAttribute(element.labelOptions, styleAttribute, defaultValue);
                    newDiv.setAttributeNode(styleAttribute);
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
        createLabelStyleAttribute: function (labelOptions, attribute, defaultValue) {
            attribute.value = "";
            switch (typeof labelOptions) {
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    if (Object.keys(labelOptions).length > 0) {
                        for (labelOption in labelOptions) {
                            switch (labelOption) {
                                case "color":
                                case "backgroundColor":
                                case "textAlign":
                                case "fontFamily":
                                case "border":
                                case "boxShadow":
                                case "textShadow":
                                case "position":
                                    if (typeof labelOptions[labelOption] !== "string") {
                                        Pano.log.error("'" + labelOption + "' option must be of type 'string'");
                                        return;
                                    }
                                    this.createOneStyleValue(attribute, labelOptions[labelOption], labelOption);
                                    break;
                                case "fontSize":
                                case "textIndent":
                                case "borderRadius":
                                    if (typeof labelOptions[labelOption] !== "number") {
                                        Pano.log.error("'" + labelOption + "' option must be of type 'number'");
                                        return;
                                    }
                                    this.createOneStyleValue(attribute, labelOptions[labelOption], labelOption);
                                    break;
                                default:
                                    Pano.log.error("Invalid value for 'labelOption'");
                                    return;
                            }
                        }
                    } else {
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
        createStyleAttribute: function (styles, attribute, defaultValue) {
            switch (typeof styles) {
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    console.log(styles);
                    if (Object.keys(styles).length > 0) {
                        for (style in styles) {
                            let styleValue = styles[style];
                            console.log(style);
                            if (style === "width") {
                                style = "min-width";
                            }
                            attribute.value += style + ":" + styleValue;
                            if (typeof styleValue === "number") {
                                attribute.value += "px";
                            }
                            attribute.value += ";";
                        }
                    } else {
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
        disperseTo: function (element) {
            let type = element[0];
            let value = element.substring(1);
            return { type: type, value: value };
        },
        /**
         * get element type : video/img
         * @param {string} element element to be imported
         * 
         * @return {string} | null img/video according to extension
         */
        getElementType: function (element) {
            if (typeof element !== "string") {
                Pano.log.error("'src' is not a string");
                return;
            };
            let validImgExtensions = Pano.providers.validImgExtensions;
            let validVideoExtensions = Pano.providers.validVideoExtensions;
            let extension = this.getExtension(element);
            if (validImgExtensions.includes(extension))
                return "img";
            else if (validVideoExtensions.includes(extension))
                return "video";
            return;
        },
        /**
         * if element type = img => create img pano
         * @param {string} img path to img
         * @param {parent} element to be imported
         * @param {string} uniqId unique element id
         * 
         * @return {HTMLAllCollection|undefined} undefined if not onclickable and html <a> element if clickable 
         */
        createPanoElementImg: function (element, parent, uniqId) {
            let newImg = this.createElement("div", {
                id: Pano.providers.imgId + uniqId,
                className: Pano.providers.imgClass
            });
            let styleAttribute = document.createAttribute("style");
            let defaultValue = Pano.providers.defaultImgStyle;
            this.createImgStyleAttribute(element.imgOptions, styleAttribute, defaultValue);
            styleAttribute.value += "background-image: url(" + element.src + ");";
            newImg.setAttributeNode(styleAttribute);
            switch (typeof element.onClick) {
                case "undefined":
                    parent.appendChild(newImg);
                    return;
                case "object":
                    let onClickObject = element.onClick;
                    switch (typeof onClickObject.to) {
                        case "undefined":
                            Pano.log.error("'to' parameter not found in 'onClick' object");
                            return;
                        case "string":
                            let newLink = this.createOnClickableImg(newImg, onClickObject);
                            parent.appendChild(newLink);
                            return newLink;
                        default:
                            Pano.log.error("'to' parameter must be of type 'string'");
                            return;
                    }
                default:
                    Pano.log.error("'onClick' attribute must be of type 'object'");
                    return;
            }
        },
        /**
         * create link element to make img clickable
         * @param {HTMLAllCollection} img html element of img 
         * @param {object} onClickObject onClick parameters
         * 
         * @return {HTMLAllCollection} newLink created html link 
         */
        createOnClickableImg: function (img, onClickObject) {
            let newLink = this.createElement("a", {
                href: onClickObject.to
            });
            switch (typeof onClickObject.blank) {
                case "undefined":
                    break;
                case "boolean":
                    if (onClickObject.blank) {
                        let blankAttribute = document.createAttribute("target");
                        blankAttribute.value = "_blank";
                        newLink.setAttributeNode(blankAttribute);
                    }
                    break;
                default:
                    Pano.log.error("'blank' parameter must be of type 'boolean'");
                    return;
            }
            switch (typeof onClickObject.title) {
                case "undefined":
                    break;
                case "string":
                    let titleAttribute = document.createAttribute("title");
                    titleAttribute.value = onClickObject.title;
                    newLink.setAttributeNode(titleAttribute);
                    break;
                default:
                    Pano.log.error("'title' parameter must be of type 'string'");
                    return;
            }
            newLink.appendChild(img);
            return newLink;
        },
        /**
         * create img style attribute
         * @param {object} styles object with styles types
         * @param {HtmlAttributes} attribute html style attribute
         * @param {string} defaultValue default value if no value inserted
         */
        createImgStyleAttribute: function (imgOptions, attribute, defaultValue) {
            attribute.value = "";
            switch (typeof imgOptions) {
                case "undefined":
                    attribute.value += defaultValue;
                    break;
                case "object":
                    if (Object.keys(imgOptions).length > 0) {
                        for (imgOption in imgOptions) {
                            switch (imgOption) {
                                case "backgroundSize":
                                case "backgroundPosition":
                                case "boxShadow":
                                    if (typeof imgOptions[imgOption] !== "string") {
                                        Pano.log.error("'" + imgOption + "' option must be of type 'string'");
                                        return;
                                    }
                                    this.createOneStyleValue(attribute, imgOptions[imgOption], imgOption);
                                    break;
                                default:
                                    Pano.log.error("'" + imgOption + "' is not a valid value for 'imgOption'");
                                    return;
                            }
                        }
                    } else {
                        attribute.value += defaultValue;
                    }
                    break;
                default:
                    Pano.log.error("'imgOptions' property must be of type 'object'");
                    return;
            }
        },
        /**
         * create one style string
         * @param {HtmlAttributes} attribute attribut of the element
         * @param {string|number} styleValue value of style
         * @param {string} style type of style
         */
        createOneStyleValue: function (attribute, styleValue, style) {
            switch (style) {
                case "color":
                    attribute.value += "color:" + styleValue + ";";
                    break;
                case "backgroundColor":
                    attribute.value += "background-color:" + styleValue + ";";
                    break;
                case "textAlign":
                    attribute.value += "text-align:" + styleValue + ";";
                    break;
                case "fontFamily":
                    attribute.value += "font-family:" + styleValue + ";";
                    break;
                case "border":
                    attribute.value += "border:" + styleValue + ";";
                    break;
                case "boxShadow":
                    attribute.value += "box-shadow:" + styleValue + ";";
                    break;
                case "textShadow":
                    attribute.value += "text-shadow:" + styleValue + ";";
                    break;
                case "backgroundSize":
                    attribute.value += "background-size:" + styleValue + ";";
                    break;
                case "backgroundPosition":
                    attribute.value += "background-position:" + styleValue + ";";
                    break;
                case "position":
                    attribute.value += styleValue + ":0;";
                    break;
                case "fontSize":
                    attribute.value += "font-size:" + styleValue + "px;";
                    break;
                case "textIndent":
                    attribute.value += "text-indent:" + styleValue + "px;";
                    break;
                case "borderRadius":
                    attribute.value += "border-radius:" + styleValue + "px;";
                    break;
                default:
                    Pano.log.error("'" + style + "' is not a valid option");
                    break;
            }
        },
        /**
         * if element type = video => create video pano
         * @param {string} video path to video
         * @param {HTMLAllCollection} element to be imported
         * @param {string} uniqId unique element id
         */
        createPanoElementVideo: function (element, parent, uniqId) {
            let newVideo = this.createElement("video", {
                id: Pano.providers.videoId + uniqId,
                className: Pano.providers.videoClass
            });
            if (typeof element.options === "object") {
                let validOptions = Pano.providers.validVideoOptions;
                let options = element.options;
                for (option in options) {
                    if (validOptions.includes(option)) {
                        if (options[option])
                            newVideo.setAttributeNode(document.createAttribute(option));
                    } else {
                        Pano.log.error("At least one video option is not valid");
                        return;
                    }
                }
            }
            let newSource = this.createElement("source", {
                src: element.src,
                type: "video/" + this.getExtension(element.src)
            });
            newVideo.appendChild(newSource);
            parent.appendChild(newVideo);
        },
        /**
         * create pano layout
         * @param {HTMLAllCollection} parent html element parent
         * @param {object} panoLayout object with all pano options
         * @param {string} uniqId unique index
         * @param {number} n number of pano
         */
        createPanoLayout: function (parent, panoLayout, uniqId, n) {
            let set;
            let step;
            let timeTransition;
            let dots;
            if (Pano.providers.mainBlockObject.type === "class") {
                for (let i = 0; i < Pano.providers.mainBlockObject.value.lenth; i++) {
                    Pano.providers.mainBlockObject.value[i].style = "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;";
                }
            } else {
                Pano.providers.mainBlockObject.value.style = "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;";
            }
            typeof panoLayout.set === "undefined" ?
                set = 1 : typeof panoLayout.set === "number"
                    ? set = panoLayout.set : Pano.log.error("'set' property must be of type 'number'");
            typeof panoLayout.step === "undefined" ?
                step = 1 : typeof panoLayout.step === "number"
                    ? step = panoLayout.step : Pano.log.error("'step' property must be of type 'number'");
            typeof panoLayout.timeTransition === "undefined" ?
                timeTransition = 0.5 : typeof panoLayout.timeTransition === "number"
                    ? timeTransition = panoLayout.timeTransition : Pano.log.error("'timeTransition' property must be of type 'number'");
            typeof panoLayout.dots === "undefined" ?
                dots = true : typeof panoLayout.dots === "boolean"
                    ? dots = panoLayout.dots : Pano.log.error("'dots' property must be of type 'boolean'");
            switch (panoLayout.type) {
                case "linear":
                    this.placePanoLinear(parent, n, panoLayout);
                    break;
                case "fade":
                    this.placePanoFade(parent, n);
                default:
                    Pano.log.error("Pano type '" + panoLayout.type + "' is not valid");
                    return;
            }
            if (dots) {
                let mainBlockValue;
                let blockDots = this.createElement("div", {
                    id: Pano.providers.dotsId + uniqId,
                    className: Pano.providers.dotsClass,
                    style: ""
                });
                this.createDots(blockDots, n, panoLayout.set);
                if (Pano.providers.mainBlockObject.type === "class") {
                    mainBlockValue = Pano.providers.mainBlockObject.value;
                    for (let i = 0; i < mainBlockValue.length; i++) {
                        mainBlockValue[i].append(blockDots);
                    }
                } else {
                    Pano.providers.mainBlockObject.value.append(blockDots);
                }
            }
        },
        /**
         * create dots inputs into dots block
         * @param {HTMLAllCollection} blockDots block dots
         * @param {number} n number of items
         * @param {number} set number of items displayed in same time
         */
        createDots: function (blockDots, n, set) {
            let numberOfDots = Math.ceil(n / set);
            for (let i = 0; i < numberOfDots; i++) {
                let dotInput = this.createElement("input", {
                    className: Pano.providers.dotsInputClass,
                    type: "button"
                });
                blockDots.append(dotInput);
            }
        },
        /**
         * place linear pano
         * @param {HTMLAllCollection} parent element parent
         * @param {number} n number of pano
         * @param {object} panoLayout pano options
         */
        placePanoLinear: function (parent, n, panoLayout) {
            let parameters = {
                class: Pano.providers.panoFlex,
                style: Pano.providers.defaultMainBlockStyle + "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;",
            }
            this.addAttribute(parent, parameters);
        },
        /**
         * place fade pano
         * @param {object} mainBlock object with type and value of 'main block'
         * @param {number} n number of pano
         */
        placePanoFade: function (mainBlock, n) {
        },
        /**
         * get element extension
         * @param {element} element to get extension
         * 
         * @return {string} extension
         */
        getExtension: function (element) {
            return element.slice(element.indexOf(".", -1) + 1).toLowerCase();
        },
        /**
         * 
         * @param {string} type html element type (div, a...)
         * @param {object} attributes html element attributes (id, class...)
         * 
         * @return {HTMLAllCollection} html element
         */
        createElement: function (type, attributes) {
            let newHtmlElement = document.createElement(type);
            for (attribute in attributes) {
                newHtmlElement[attribute] = attributes[attribute];
            }
            return newHtmlElement;
        },
        /**
         * add attributes to html element
         * @param {HTMLAllCollection} element html element
         * @param {object} attributes attributes to add
         */
        addAttribute: function (element, attributes) {
            for (attribute in attributes) {
                console.log(attribute);
                if (element.hasAttribute(attribute)) {
                    let updatedAttribute = document.createAttribute(attribute);
                    updatedAttribute.value = element.getAttribute(attribute) + " " + attributes[attribute];
                    element.setAttributeNode(updatedAttribute);
                } else {
                    let createdAttribute = document.createAttribute(attribute);
                    let value = attributes[attribute];
                    createdAttribute.value = value;
                    element.setAttributeNode(createdAttribute);
                }
            }
        }
    },
    log: {
        /**
         * display error into user console
         * @param {string} error error value
         */
        error: function (error) {
            console.error("Panojs ERROR => " + error);
        }
    },
    providers: {
        mainBlockObject: null,
        cssPath: "file:///C:/Users/Lucas/Desktop/panojs/src/assets/style/style.css",
        validVideoOptions: ["controls", "autoplay", "loop", "muted", "preload"],
        validVideoExtensions: ["mp4", "mov", "avi"],
        validImgExtensions: ["jpg", "png", "jpeg", "gif", "tiff", "webp", "bmp", "svg"],
        parentClass: "--pano-parent",
        parentId: "--pano-parent-",
        panoId: "--pano-block-",
        panoClass: "--pano-block",
        imgId: "--pano-img-",
        imgClass: "--pano-img",
        videoId: "--pano-video-",
        videoClass: "--pano-video",
        labelId: "--pano-label-",
        labelClass: "--pano-label",
        panoFlex: "--pano-flex",
        defaultPanoStyle: "width:200px; height:200px;",
        defaultImgStyle: "background-size: contain; background-position: center;",
        defaultLabelStyle: "background-color:rgba(0,0,0,0.7); color:#FFFFFF; bottom: 0;",
        dotsId: "--pano-dots-",
        dotsClass: "--pano-dots",
        defaultMainBlockStyle: "overflow-x: hidden; overflow-y: visible; position: relative;",
        dotsInputClass: "--pano-dot-input"
    }
}
let head = document.getElementsByTagName('head')[0];
let link = Pano.util.createElement("link", {
    rel: "stylesheet",
    type: "text/css",
    href: Pano.providers.cssPath
});
head.appendChild(link);

Pano = Pano;