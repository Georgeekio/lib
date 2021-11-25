import { util } from './util.js';

class Collection {
    constructor(options) {
        this.name = null;
        this.db = null;
        Object.assign(this, options);
    }

    select(doc) {
        if(!util.isInstance(doc, 'object')) return;
        const data = this.db.get();
        return data.collections[this.name].filter(elt => util.isSubset(doc, elt));
    }

    insert(doc) {
        if(!util.isInstance(doc, 'object')) return;
        doc.id = util.genID();
        const data = this.db.get();
        data.collections[this.name].push(doc);
        this.db.set(data);
        return doc;
    }

    update(subset, doc) {
        const data = this.db.get();
        const collection = data.collections[this.name];
        collection.forEach(superset => {
            if(util.isSubset(subset, superset)) {
                util.union(superset, doc);
            }
        });
        this.db.set(data);
    }
    
    delete(subset) {
        const data = this.db.get();
        const collection = data.collections[this.name];
        for(let i = collection.length - 1; i > -1; i--) {
            if(util.isSubset(subset, collection[i])) {
                collection.splice(i, 1);
            }
        }
        this.db.set(data);
    }
}

export class Storage {
    constructor(name) {
        this.name = name;
        this.init();
    }

    init() {
        const config = {
            createdOn: Date.now(),
            collections: {}
        };
        try {
            for(const name in this.get().collections) {
                this[name] = new Collection({name, db: this});
            }

        } catch(ex) {
            this.set(config);
        }
    }

    createCollection(name) {
        const data = this.get();
        data.collections[name] = data.collections[name] || [];
        this.set(data);
        this[name] = new Collection({name, db: this});
    }

    get() {
        return JSON.parse(localStorage[this.name]);
    }

    set(data) {
        return localStorage[this.name] = JSON.stringify(data);
    }
}