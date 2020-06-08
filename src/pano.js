/**
 * panojs v.1.0.0
 * 
 * PanoJS is the best way to easily create caroussels 
 * 
 * @author Lucas Estrade 
 * @github author => https://github.com/lucasestrade
 * @github repository => https://github.com/lucasestrade/panojs
 * 
 * Copyright 2020, Lucas Estrade
 * Released under the MIT license
 * 
 */

function Pano(to, object) {

    var itemsIds = [];

    const log = {
        /**
         * display error into user console
         * @param {string} error error value
         */
        error: function (error) {
            console.error("Panojs ERROR => " + error);
        }
    }

    const providers = {
        carousselObject: null,
        cssPath: "file:///C:/Users/Lucas/Desktop/Documents/panojs/src/assets/style/style.css",
        validVideoOptions: ["controls", "autoplay", "loop", "muted", "preload"],
        validVideoExtensions: ["mp4", "mov", "avi"],
        validImgExtensions: ["jpg", "png", "jpeg", "gif", "tiff", "webp", "bmp", "svg"],
        mainBlockClass: "--pano-mainblock",
        mainBlockId: "--pano-mainblock-",
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

    if ([to, object.type, object.items].filter(element => typeof element === "undefined").length > 0) {
        log.error("'CREATE' function object not valid. At least 'to', 'items' and 'type' are necessary");
        return;
    };
    let toObject;
    let typeTo;
    if (typeof to === "string") {
        toObject = disperseTo(to);
        if (![".", "#"].includes(toObject.type)) {
            log.error("The parent target must be focused with an 'id' or a 'class name'");
            return;
        } else if (toObject.type === "#") {
            typeTo = "id";
        } else if (toObject.type === ".") {
            typeTo = "class";
        } else {
            log.error("'to' parameter must focus an 'id' or 'class' html element");
            return;
        }
    } else {
        log.error("'to' parameter must be of type 'string'");
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
        step: object.step,
        dots: object.dots,
        panoOptions: object.panoOptions,
    };
    let rand = new Date().getTime() + Math.floor((Math.random() * 10000) + 1).toString(16);
    let n = 0;
    let caroussel;
    let mainBlock = createElement("div", {
        className: providers.mainBlockClass,
        id: providers.mainBlockId + rand
    });
    let parent = createElement("div", {
        className: providers.parentClass,
        id: providers.parentId + rand
    });
    if (toTypeValueObject.type === "id") {
        caroussel = document.getElementById(toTypeValueObject.value);
        caroussel.append(mainBlock);
        mainBlock.append(parent);
    } else if (toTypeValueObject.type === "class") {
        caroussel = document.getElementsByClassName(toTypeValueObject.value);
        for (let i = 0; i < caroussel.length; i++) {
            caroussel[i].append(mainBlock);
            mainBlock.append(parent);
        }
    }
    providers.carousselObject = { 
        type: toTypeValueObject.type, 
        value: caroussel 
    };
    items.map(element => {
        switch (typeof element.src) {
            case "undefined":
                log.error("'CREATE'.'ITEMS' object not valid. At least 'src' parameter is necessary");
                return;
            case "string":
                break;
            default:
                log.error("'src' parameter must be of type 'string'");
                return;
        }
        n++;
        let uniqId = rand + n;
        itemsIds.push(providers.panoId + uniqId);
        // create each pano
        createPano(object, element, parent, uniqId);
    });
    createPanoLayout(mainBlock, parent, panoLayout, rand + n, n);
    this.number = function (number) {
        for (let i = 1; i < number; i++) {
            Pano(object);
        }
    }

    /**
     * create a pano
     * @param {object} object global parameters
     * @param {object} element items parameters
     * @param {HTMLAllCollection} parent html element parent
     * @param {string} uniqId unique index
     */
    function createPano(object, element, parent, uniqId) {
        let elementType = getElementType(element.src);
        let blockStyleAttribute = document.createAttribute("style");
        blockStyleAttribute.value = "";
        let defaultValue = providers.defaultPanoStyle;
        createStyleAttribute(object.panoOptions, blockStyleAttribute, defaultValue);
        let newBlock = createElement("div", {
            id: providers.panoId + uniqId,
            className: providers.panoClass
        });
        newBlock.setAttributeNode(blockStyleAttribute);
        parent.appendChild(newBlock);
        let linkBlock;
        switch (elementType) {
            case "img":
                linkBlock = createPanoElementImg(element, newBlock, uniqId);
                break;
            case "video":
                createPanoElementVideo(element, newBlock, uniqId);
                break;
            default:
                log.error("The file extension is not valid");
                return;
        }
        if (typeof linkBlock === "undefined")
            createLabel(element, newBlock, uniqId);
        else
            createLabel(element, linkBlock, uniqId);
    }
    /**
     * create label in pano
     * @param {string} element element
     * @param {HTMLAllCollection} block block parent
     * @param {string} uniqId unique index
     */
    function createLabel(element, block, uniqId) {
        switch (typeof element.label) {
            case "undefined":
                break;
            case "string":
                let newDiv = createElement("div", {
                    id: providers.labelId + uniqId,
                    className: providers.labelClass,
                    textContent: element.label
                });
                let styleAttribute = document.createAttribute("style");
                let defaultValue = providers.defaultLabelStyle;
                createLabelStyleAttribute(element.labelOptions, styleAttribute, defaultValue);
                newDiv.setAttributeNode(styleAttribute);
                block.appendChild(newDiv);
                break;
            default:
                log.error("'label' parameter must be of type 'string'")
        }
    }
    /**
     * create label style attribute
     * @param {object} styles object with styles types
     * @param {HtmlAttributes} attribute html style attribute
     * @param {string} defaultValue default value if no value inserted
     */
    function createLabelStyleAttribute(labelOptions, attribute, defaultValue) {
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
                                    log.error("'" + labelOption + "' option must be of type 'string'");
                                    return;
                                }
                                createOneStyleValue(attribute, labelOptions[labelOption], labelOption);
                                break;
                            case "fontSize":
                            case "textIndent":
                            case "borderRadius":
                                if (typeof labelOptions[labelOption] !== "number") {
                                    log.error("'" + labelOption + "' option must be of type 'number'");
                                    return;
                                }
                                createOneStyleValue(attribute, labelOptions[labelOption], labelOption);
                                break;
                            default:
                                log.error("Invalid value for 'labelOption'");
                                return;
                        }
                    }
                } else {
                    attribute.value += defaultValue;
                }
                break;
            default:
                log.error("'labelOptions' property must be of type 'object'");
                return;
        }
    }
    /**
     * create style attribute
     * @param {object} styles object with styles types
     * @param {HtmlAttributes} attribute html style attribute
     * @param {string} defaultValue default value if no value inserted
     */
    function createStyleAttribute(styles, attribute, defaultValue) {
        switch (typeof styles) {
            case "undefined":
                attribute.value += defaultValue;
                break;
            case "object":
                if (Object.keys(styles).length > 0) {
                    for (style in styles) {
                        let styleValue = styles[style];
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
                log.error("'style' property must be of type 'object'");
                return;
        }
    }
    /**
     * disperse the target parent to check if it's focused with an id or a class
     * @param {string} the parent target value
     * 
     * @return {object} {type : ... , value : ....} type => [ "." = class , "#" = id ] value => target name without symbol (#/.)
     */
    function disperseTo(element) {
        let type = element[0];
        let value = element.substring(1);
        return { type: type, value: value };
    }
    /**
     * get element type : video/img
     * @param {string} element element to be imported
     * 
     * @return {string} | null img/video according to extension
     */
    function getElementType(element) {
        if (typeof element !== "string") {
            log.error("'src' is not a string");
            return;
        };
        let validImgExtensions = providers.validImgExtensions;
        let validVideoExtensions = providers.validVideoExtensions;
        let extension = getExtension(element);
        if (validImgExtensions.includes(extension))
            return "img";
        else if (validVideoExtensions.includes(extension))
            return "video";
        return;
    }
    /**
     * if element type = img => create img pano
     * @param {string} img path to img
     * @param {parent} element to be imported
     * @param {string} uniqId unique element id
     * 
     * @return {HTMLAllCollection|undefined} undefined if not onclickable and html <a> element if clickable 
     */
    function createPanoElementImg(element, parent, uniqId) {
        let newImg = createElement("div", {
            id: providers.imgId + uniqId,
            className: providers.imgClass
        });
        let styleAttribute = document.createAttribute("style");
        let defaultValue = providers.defaultImgStyle;
        createImgStyleAttribute(element.imgOptions, styleAttribute, defaultValue);
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
                        log.error("'to' parameter not found in 'onClick' object");
                        return;
                    case "string":
                        let newLink = createOnClickableImg(newImg, onClickObject);
                        parent.appendChild(newLink);
                        return newLink;
                    default:
                        log.error("'to' parameter must be of type 'string'");
                        return;
                }
            default:
                log.error("'onClick' attribute must be of type 'object'");
                return;
        }
    }
    /**
     * create link element to make img clickable
     * @param {HTMLAllCollection} img html element of img 
     * @param {object} onClickObject onClick parameters
     * 
     * @return {HTMLAllCollection} newLink created html link 
     */
    function createOnClickableImg(img, onClickObject) {
        let newLink = createElement("a", {
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
                log.error("'blank' parameter must be of type 'boolean'");
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
                log.error("'title' parameter must be of type 'string'");
                return;
        }
        newLink.appendChild(img);
        return newLink;
    }
    /**
     * create img style attribute
     * @param {object} styles object with styles types
     * @param {HtmlAttributes} attribute html style attribute
     * @param {string} defaultValue default value if no value inserted
     */
    function createImgStyleAttribute(imgOptions, attribute, defaultValue) {
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
                                    log.error("'" + imgOption + "' option must be of type 'string'");
                                    return;
                                }
                                createOneStyleValue(attribute, imgOptions[imgOption], imgOption);
                                break;
                            default:
                                log.error("'" + imgOption + "' is not a valid value for 'imgOption'");
                                return;
                        }
                    }
                } else {
                    attribute.value += defaultValue;
                }
                break;
            default:
                log.error("'imgOptions' property must be of type 'object'");
                return;
        }
    }
    /**
     * create one style string
     * @param {HtmlAttributes} attribute attribut of the element
     * @param {string|number} styleValue value of style
     * @param {string} style type of style
     */
    function createOneStyleValue(attribute, styleValue, style) {
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
                log.error("'" + style + "' is not a valid option");
                break;
        }
    }
    /**
     * if element type = video => create video pano
     * @param {string} video path to video
     * @param {HTMLAllCollection} element to be imported
     * @param {string} uniqId unique element id
     */
    function createPanoElementVideo(element, parent, uniqId) {
        let newVideo = createElement("video", {
            id: providers.videoId + uniqId,
            className: providers.videoClass
        });
        if (typeof element.videoOptions === "object") {
            let validOptions = providers.validVideoOptions;
            let options = element.videoOptions;
            for (option in options) {
                if (validOptions.includes(option)) {
                    if (options[option])
                        newVideo.setAttributeNode(document.createAttribute(option));
                } else {
                    log.error("At least one video option is not valid");
                    return;
                }
            }
        }
        let newSource = createElement("source", {
            src: element.src,
            type: "video/" + getExtension(element.src)
        });
        newVideo.appendChild(newSource);
        parent.appendChild(newVideo);
    }
    /**
     * create pano layout
     * @param {HTMLAllCollection} parent html element parent
     * @param {object} panoLayout object with all pano options
     * @param {string} uniqId unique index
     * @param {number} n number of pano
     */
    function createPanoLayout(mainBlock, parent, panoLayout, uniqId, n) {
        let set;
        let step;
        let timeTransition;
        let dots;
        if (providers.carousselObject.type === "class") {
            for (let i = 0; i < providers.carousselObject.value.lenth; i++) {
                providers.carousselObject.value[i].style = "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;";
            }
        } else {
            providers.carousselObject.value.style = "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;";
        }
        typeof panoLayout.set === "undefined" ?
            set = 1 : typeof panoLayout.set === "number"
                ? set = panoLayout.set : log.error("'set' property must be of type 'number'");
        typeof panoLayout.step === "undefined" ?
            step = 1 : typeof panoLayout.step === "number"
                ? step = panoLayout.step : log.error("'step' property must be of type 'number'");
        typeof panoLayout.timeTransition === "undefined" ?
            timeTransition = 0.5 : typeof panoLayout.timeTransition === "number"
                ? timeTransition = panoLayout.timeTransition : log.error("'timeTransition' property must be of type 'number'");
        typeof panoLayout.dots === "undefined" ?
            dots = true : typeof panoLayout.dots === "boolean"
                ? dots = panoLayout.dots : log.error("'dots' property must be of type 'boolean'");
        switch (panoLayout.type) {
            case "linear":
                placePanoLinear(mainBlock, parent, n, panoLayout);
                break;
            case "fade":
                placePanoFade(parent, n);
            default:
                log.error("Pano type '" + panoLayout.type + "' is not valid");
                return;
        }
        if (dots) {
            let mainBlockValue;
            let blockDots = createElement("div", {
                id: providers.dotsId + uniqId,
                className: providers.dotsClass,
                style: ""
            });
            createDots(blockDots, n, panoLayout, step);
            if (providers.carousselObject.type === "class") {
                mainBlockValue = providers.carousselObject.value;
                for (let i = 0; i < mainBlockValue.length; i++) {
                    mainBlockValue[i].append(blockDots);
                }
            } else {
                providers.carousselObject.value.append(blockDots);
            }
        }
    }
    /**
     * create dots inputs into dots block
     * @param {HTMLAllCollection} blockDots block dots
     * @param {number} n number of items
     * @param {object} panoLayout pano options
     * @param {number} step number of items passed when click on dot
     */
    async function createDots(blockDots, n, panoLayout, step) {
        let set = panoLayout.set;
        let panoWidth = window.getComputedStyle(document.getElementsByClassName(providers.panoClass)[0], null).getPropertyValue("width");
        let numberOfDots = Math.ceil(n / set);
        numberOfDots = n === numberOfDots ? numberOfDots : Math.ceil(((numberOfDots + n) / set) / step);
        numberOfDots = numberOfDots === 1  && n !== set ? numberOfDots + 1 : n === set ? 0 : numberOfDots;
        for (let i = 0; i < numberOfDots; i++) {
            let itemId = itemsIds[i === 0 ? 0 : i + step - 1] || log.error("Parameter 'step' must be inferior or equal by parameter 'set'")
            let dotInput = await createElement("input", {
                className: providers.dotsInputClass,
                type: "button",
                datasets: {
                    itemid: itemId
                }
            });
            blockDots.append(dotInput);
        }
        createDotsEventListeners(panoWidth);
    }
    /**
     * create dots event listeners
     */
    function createDotsEventListeners(panoWidth) {
        let dots = document.getElementsByClassName(providers.dotsInputClass);
        let action = function(){
            console.log(this);
            console.log(providers.carousselObject);
            console.log(panoWidth);
            document.getElementById(this.dataset.itemid).style.left = `-${panoWidth}`;
            console.log(window.getComputedStyle(document.getElementById(this.dataset.itemid), null).getPropertyValue("left"));
        }
        Array.from(dots, dot => dot.addEventListener('click', action));
    }
    /**
     * place linear pano
     * @param {HTMLAllCollection} mainBlock element mainBlock
     * @param {HTMLAllCollection} parent element parent
     * @param {number} n number of pano
     * @param {object} panoLayout pano options
     */
    function placePanoLinear(mainBlock, parent, n, panoLayout) {
        let parametersMainBlock = {
            style: providers.defaultMainBlockStyle + "width:" + panoLayout.panoOptions.width * panoLayout.set + "px;"
        }
        addAttribute(mainBlock, parametersMainBlock);
        let parametersParent = {
            class: providers.panoFlex
        }
        addAttribute(parent, parametersParent);
    }
    /**
     * place fade pano
     * @param {object} mainBlock object with type and value of 'main block'
     * @param {number} n number of pano
     */
    function placePanoFade(mainBlock, n) {
    }
    /**
     * get element extension
     * @param {element} element to get extension
     * 
     * @return {string} extension
     */
    function getExtension(element) {
        return element.slice(element.indexOf(".", -1) + 1).toLowerCase();
    }
    /**
     * 
     * @param {string} type html element type (div, a...)
     * @param {object} attributes html element attributes (id, class...)
     * 
     * @return {HTMLAllCollection} html element
     */
    function createElement(type, attributes) {
        let newHtmlElement = document.createElement(type);
        for (attribute in attributes) {
            if(attribute === "datasets" && typeof attributes[attribute] === "object"){
                for(dataset in attributes[attribute]){
                    newHtmlElement.dataset[dataset] = attributes[attribute][dataset];
                }
            }else{
                newHtmlElement[attribute] = attributes[attribute];
            }
        }
        return newHtmlElement;
    }
    /**
     * add attributes to html element
     * @param {HTMLAllCollection} element html element
     * @param {object} attributes attributes to add
     */
    function addAttribute(element, attributes) {
        for (attribute in attributes) {
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

    let head = document.getElementsByTagName('head')[0];
    let link = createElement("link", {
        rel: "stylesheet",
        type: "text/css",
        href: providers.cssPath
    });
    head.appendChild(link);
}

module.exports = Pano;