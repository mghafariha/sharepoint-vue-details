// @flow
import { mapState } from 'vuex'

export default {
    template: `
        <el-checkbox :disabled="true" v-model="value"></el-checkbox>
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value }
    }
}
