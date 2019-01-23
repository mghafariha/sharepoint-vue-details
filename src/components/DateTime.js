// @flow
import { mapState } from 'vuex'
import moment from 'moment-jalaali'
import R from 'ramda'

export default {
    template: `
        <div>
            {{ value }}
        </div>
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() {
            let value = this.field.value ? R.pipe(
                R.split(' '),
                R.head,
                R.split('/'),
                ([m, d, y]) => [y, m, d],
                R.join('/')
            )(this.field.value)
                : this.field.value
            return value ? moment(value, 'YYYY/MM/DD').format('jYYYY-jMM-jDD') : ''
        }
    }
}
