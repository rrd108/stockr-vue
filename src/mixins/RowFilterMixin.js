export default {
    computed: {
        search() {
            return this.$store.state.search
        },
        filteredItems() {
            this[this.model].forEach(item => {
                item.hidden = false
                for (let [field, value] of Object.entries(this.search)) {

                    //remove the first tag in property list as we already on that level
                    let model = field.substr(0, field.indexOf('.'))
                    field = field.substr(field.indexOf('.') + 1)

                    if (model == this.model && value) {
                        let fieldValue = field.split(".").reduce((a, b) => a[b], item);

                        if (!fieldValue) {
                            item.hidden = true
                            return
                        }
                        fieldValue = fieldValue.toString()
                        if (fieldValue.toLowerCase().indexOf(value.toLowerCase()) == -1) {
                            item.hidden = true
                            return
                        }
                    }
                }
            })

            const filteredItems = this[this.model].filter(item => item.hidden !== true)

            this.$emit('setCount', filteredItems.length)
            return filteredItems
        }
    },
}