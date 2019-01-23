// @flow
import { mapActions, mapState } from 'vuex'
import MultiSelectField from '../widgets/MultiSelect'

export default {
    components: { MultiSelectField },
    template: `
        <MultiSelectField :value='value' :options='options' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId' ],
    computed: {
        ...mapState({
            field(state) { return state.approveFields[this.fieldId] }
        }),
        value() { return []},
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
            this.changeApproveField({ id: this.fieldId, value: value.toString() })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadApproveOptions({ id: this.fieldId, listId: this.field.LookupList })
    }
}
