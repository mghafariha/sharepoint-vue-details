// @flow
import { mapState } from 'vuex'

export default {
    template: `
        <div>
            {{value}}
        </div>
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return (typeof this.field.value == 'string') ? this.field.value.replace(/\\n/g, '\\\n').replace(/\\/g, '') : this.field.value }
    }
}
