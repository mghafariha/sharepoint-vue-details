// @flow
import { mapActions, mapState } from 'vuex'
import TimeField from '../widgets/TimePicker'

export default {
    components: { TimeField },
    template: `
        <TimeField :value='value' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.approveFields[this.fieldId] }
        }),
        value () { return this.field.value },
        name (){ return this.field.InternalName },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeField']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
