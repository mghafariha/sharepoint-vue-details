// @flow
import { mapActions, mapState } from 'vuex'
import CustomComputedField from '../widgets/CustomComputed'
import { replaceQueryFields } from '../functions'

export default {
    components: { CustomComputedField },
    template: `
        <CustomComputedField :value='value' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.approveFields[this.fieldId] },
            fields(state) { return state.approveFields }
        }),
        value () { return this.field.value },
        query () { return replaceQueryFields(this.fields)(this.field.Query) }
    },
    watch : {
        query: {
            handler: function (query, old) {
                if (query != old){
                    this.loadComputed({ id: this.fieldId, listId: this.field.LookupList, query , select: this.field.LookupTitleField, func: this.field.AggregationFunction })
                }
            }
        }
    },
    methods: {
        ...mapActions(['loadComputed'])
    }
}
