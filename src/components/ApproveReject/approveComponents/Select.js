// @flow
import { mapActions, mapState } from 'vuex'
import SelectField from '../widgets/Select'

export default {
    components: { SelectField },
    template: `
        <SelectField :value='value' :options='options' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.approveFields[this.fieldId] }
        }),
        value() { return this.field.value },
        options() { return this.field.options },
        name (){ return this.field.Title },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeApproveField', 'loadApproveOptions']),
        change (value) {
            this.changeApproveField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadApproveOptions({ id: this.fieldId, listId: this.field.LookupList })
    }
}
