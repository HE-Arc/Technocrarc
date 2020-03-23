export class OptionFormGenerator {

    constructor(formId, options) {
        this.form = document.getElementById(formId)
        this.options = options
    }

    buidlFormField() {
        this._clearForm()

        this._parseOptions()
    }

    _parseOptions() {
        for (var prop in this.options) {
            if (Object.prototype.hasOwnProperty.call(this.options, prop)) {
                let field = this.options[prop]
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
                    default:
                        break
                }
            }
        }
    }

    _clearForm() {
        while (this.form.firstChild) {
            this.form.removeChild(this.form.lastChild);
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
        l.innerHTML = fieldName

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
        l.innerHTML = fieldName

        p.appendChild(l)
        p.appendChild(i)

        return p
    }
}