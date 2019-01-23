// @flow
import { mapActions, mapState } from 'vuex'
import TextField from '../widgets/Text'

export default {
    components: { TextField },
    template: `
        <TextField :value='value' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.approveFields[this.fieldId] }
        }),
        value () { return this.field.value },
        name (){ return this.field.Title },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire,
                    max: this.field.MaxLength
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeApproveField']),
        change(value) {
            this.changeApproveField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
