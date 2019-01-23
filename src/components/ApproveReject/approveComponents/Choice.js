// @flow
import { mapActions, mapState } from 'vuex'
import ChoiceField from '../widgets/Choice'

export default {
    components: { ChoiceField },
    template: `
        <ChoiceField :value='value' :options='options' :name="name" :rules="rules" @change='change' />
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
        ...mapActions(['changeApproveField']),
        change (value) {
            this.changeApproveField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
