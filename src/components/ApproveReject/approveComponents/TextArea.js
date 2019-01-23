// @flow
import { mapActions, mapState } from 'vuex'
import TextAreaField from '../widgets/TextArea'

export default {
    components: { TextAreaField },
    template: `
        <TextAreaField :value='value' :name="name" :rules="rules" @change='change' />
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
                    required: this.field.IsRequire
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
