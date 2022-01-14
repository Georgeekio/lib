export const util = {
    xmlns: {
        svg: 'http://www.w3.org/2000/svg'
    },
    createElement(tagName, attrs = {}, ...children) {
        const xmlns = this.xmlns[tagName] || 'http://www.w3.org/1999/xhtml';
        const elt = document.createElementNS(xmlns, tagName);
        this.setAttributes(elt, attrs);
        if(children.length) children.forEach(child => elt.append(child));
        return elt;
    },
    setAttributes(elt, attrs) {
        for(const [attr, value] of Object.entries(attrs)) {
            elt.setAttributeNS(elt.namespaceURI, attr, value);
        }
        return elt;
    },
    genID(length = 6) {
        let result = '';
        for(let i = 0; i < length; i++) {
            const random = Math.random();
            if(random < 1/3) {
                result += String.fromCharCode(65 + Math.floor(Math.random() * 26));
            } else if(random >= 1/3 && random < 2/3) {
                result += String.fromCharCode(97 + Math.floor(Math.random() * 26));
            } else if(random >= 2/3) {
                const random = Math.random();
                result += result.length ? Math.floor(random * 10) : String.fromCharCode((random < .5 ? 65 : 97) + Math.floor(random * 26));
            }
        }
        return result;
    },
    toCapitalCase(str) {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    },
    isInstance(instance, type) {
        return Object.prototype.toString.call(instance) === '[object ' + this.toCapitalCase(type) + ']';
    },
    isSubset(subset, superset) {
        let yes = true;
        const recurse = (s1, s2) => {
            if(!yes) return;
            for(const [n1, v1] of Object.entries(s1)) {
                let found = false;
                for(const [n2, v2] of Object.entries(s2)) {
                    if(n1 == n2) {
                        if(v1 == v2) {
                            found = true;
                            break;
                        } else if(this.isInstance(v1, 'object') && this.isInstance(v2, 'object')) {
                            found = recurse(v1, v2);
                        } else if(this.isInstance(v1, 'array') && this.isInstance(v2, 'array')) {
                            if(!v1.length) {
                                found = true;
                                break;
                            }
                            for(const elt of v1) {
                                if(v2.indexOf(elt) > -1) {
                                    found = true;
                                    break;
                                }
                            }
                        }
                    }
                }
                if(!found) {
                    yes = false;
                    break;
                }
            }
            return yes;
        }
        return recurse(subset, superset);
    },
    union(s1, s2) {
        const recurse = (s1, s2) => {
            for(const n1 in s1) {
                for(const n2 in s2) {
                    if(n1 == n2 && util.isInstance(s1[n1], 'object') && util.isInstance(s2[n2], 'object')) {
                        recurse(s1[n1], s2[n2]);
                    } else if(n1 == n2 && util.isInstance(s1[n1], 'array') && util.isInstance(s2[n2], 'array')) {
                        for(const elt of s2[n2]) {
                            if(s1[n1].indexOf(elt) == -1) {
                                s1[n1].push(elt);
                            }
                        }
                    } else if(n1 == n2) {
                        s1[n1] = s2[n2];
                    }
                }
            }
        }
        recurse(s1, s2);
    }
};