export class OptionFormGenerator {

    constructor(formId, actionBarId, options) {
        this.form = document.getElementById(formId)
        this.actionBar = document.getElementById(actionBarId)
        this.options = options
    }

    addActions(actions) {
        for (let action in actions) {
            let act = actions[action]
            let a = document.createElement("a")
            act["classes"].forEach((item, i) => {
                a.classList.add(item)
            })
            a.setAttribute("id", act["name"])
            a.addEventListener("click", act["action"])
            a.innerHTML = action
            this.actionBar.appendChild(a)
        }
    }

    buidlFormField() {
        this._clear()

        this._parseOptions(this.options)
    }

    _parseOptions(options) {
        for (let prop in options) {
            if (Object.prototype.hasOwnProperty.call(options, prop)) {
                let field = options[prop]
                let elem;

                switch (field.type) {
                    case "number":
                        elem = this._makeSlider(prop, prop, field.range[0], field.range[1])
                        this.form.appendChild(elem)
                        break
                    case "string":
                        elem = this._makeSelect(prop, prop, field.range)
                        this.form.appendChild(elem)
                        var elems = document.querySelectorAll('select')
                        var instances = M.FormSelect.init(elems, {})
                        break
                    // Sub options
                    default:
                        this._parseOptions(field)
                        break
                }
            }
        }
    }

    _clear() {
        while (this.form.firstChild) {
            this.form.removeChild(this.form.lastChild);
        }

        while (this.actionBar.firstChild) {
            this.actionBar.removeChild(this.actionBar.lastChild);
        }
    }

    _makeSelect(id, fieldName, range) {
        let d = document.createElement("div")
        d.classList.add(...["input-field", "col", "s12"])

        let s = document.createElement("select")
        s.setAttribute("id", id)

        for (let opt of range) {
            let o = document.createElement("option")
            o.setAttribute("value", opt)
            o.innerHTML = opt
            s.appendChild(o)
        }

        let l = document.createElement("label")
        l.innerHTML = this._parseLabel(fieldName)

        d.appendChild(s)
        d.appendChild(l)

        return d
    }

    _makeSlider(id, fieldName, min, max) {
        let p = document.createElement("p")
        p.classList.add("range-field")

        let i = document.createElement("input")
        i.setAttribute("type", "range")
        i.setAttribute("id", id)
        i.setAttribute("min", min)
        i.setAttribute("max", max)

        let l = document.createElement("label")
        l.innerHTML = this._parseLabel(fieldName)

        p.appendChild(l)
        p.appendChild(i)

        return p
    }

    // camelCase -> Camel Case
    _parseLabel(label) {
        return label.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => {
            return str.toUpperCase()
        })
    }
}
