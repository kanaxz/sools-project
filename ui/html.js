/*
    	str2DOMElement
    	all credits goes to Krasimir Tsonev 
    	http://krasimirtsonev.com/blog/article/Revealing-the-magic-how-to-properly-convert-HTML-string-to-a-DOM-element
    */

var wrapMap = {
    option: [1, "<select multiple='multiple'>", "</select>"],
    legend: [1, "<fieldset>", "</fieldset>"],
    area: [1, "<map>", "</map>"],
    param: [1, "<object>", "</object>"],
    thead: [1, "<table>", "</table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    body: [0, "", ""],
    _default: [1, "<div>", "</div>"]
};
wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;
var str2DOMElement = function(html) {

    var match = /<\s*\w.*?>/g.exec(html);
    var element = document.createElement('div');
    if (match != null) {
        var tag = match[0].replace(/</g, '').replace(/>/g, '').split(' ')[0];
        if (tag.toLowerCase() === 'body') {
            var dom = document.implementation.createDocument('http://www.w3.org/1999/xhtml', 'html', null);
            var body = document.createElement("body");
            // keeping the attributes
            element.innerHTML = html.replace(/<body/g, '<div').replace(/<\/body>/g, '</div>');
            var attrs = element.firstChild.attributes;
            body.innerHTML = html;
            for (var i = 0; i < attrs.length; i++) {
                body.setAttribute(attrs[i].name, attrs[i].value);
            }
            return body;
        } else {
            var map = wrapMap[tag] || wrapMap._default,
                element;
            html = map[1] + html + map[2];
            element.innerHTML = html;
            // Descend through wrappers to the right content
            var j = map[0] + 1;
            while (j--) {
                element = element.lastChild;
            }
        }
    } else {
        element.innerHTML = html;
        element = element.lastChild;
    }
    return element;
}

/**
	@namespace whitecrow.htmlHelper
*/
var htmlHelper = {
    isRelatedTo: function(el1, el2) {
        var currentElement = el1;
        while (currentElement) {
            if (currentElement == el2)
                return true;
            currentElement = currentElement.parentNode;
        }
        return false;
    },
    /**
        @public
        @memberof whitecrow.tree
        @method isCustomElement
        @static
        @param {web.typedefs.node} node
        @return {bool} returns true if the node is a customElement
    */
    isCustomElement: function(node) {
        return node.tagName && typeof customElements.get(node.tagName.toLowerCase()) != "undefined";
    },
    /**
        @public
        @memberof whitecrow.tree
        @method isControl
        @static
        @param {web.typedefs.element} source
        @param {web.typedefs.nodeType} nodeType
        @return {bool} returns true if the node is a control
    */
    getFirstNodeByType: function(source, nodeType) {
        for (var i = 0; i < source.childNodes.length; i++) {
            var childNode = source.childNodes[i];
            if (childNode.nodeType == nodeType)
                return childNode;
        }
        return null;
    },
    isTemplate: function(template) {
        return (template instanceof HTMLScriptElement || template instanceof HTMLTemplateElement || typeof template === "string");
    },
    /**
    	Allows to get the first element of a template element
    	@public
    	@method getElementFromTemplate
    	@static
    	@memberof whitecrow.htmlHelper
    	@param {whitecrow.typedefs.template} template
    	@return {web.typedefs.HTMLElement}
    */
    getElementFromTemplate: function(template) {
        if (template instanceof HTMLScriptElement) {
            var clearInnerHTML = template.innerHTML.trim();

            var result = str2DOMElement(clearInnerHTML);
            return result;
        } else if (template instanceof HTMLTemplateElement) {
            var clone = document.importNode(template.content, true);
            return htmlHelper.getFirstNodeByType(clone, Node.ELEMENT_NODE);
        } else if (typeof template === "string") {
            return str2DOMElement(template);
        } else {
            throw new Error("Cannot get content of template");
        }
    }
}

module.exports = htmlHelper;