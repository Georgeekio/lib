export class View {
    constructor() {
        this.className = this.constructor.name.toLowerCase();
    }

    static xmlns = {
        svg: 'http://www.w3.org/2000/svg'
    }

    createView() {
        const root = this.createElement('div', {class: this.className});

        this.$root = root;
    }

    updateView() {

    }

    createElement(tagName, attrs = {}, ...children) {
        const xmlns = View.xmlns[tagName] || 'http://www.w3.org/1999/xhtml';
        const elt = document.createElementNS(xmlns, tagName);
        this.setAttributes(elt, attrs);
        if(children.length) children.forEach(child => elt.appendChild(child));
        return elt;
    }

    setAttributes(elt, attrs) {
        for(const [attr, value] of Object.entries(attrs)) {
            elt.setAttribute(attr, value);
        }
        return elt;
    }

    getRootElement() {
        return this.$root;
    }

    render(node = document.body) {
        node.appendChild(this.getRootElement());
        return this;
    }
}