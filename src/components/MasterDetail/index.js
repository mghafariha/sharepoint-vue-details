// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import TableHeader from './TableHeader'
import TableBody from './TableBody'

export default {
    name: 'MasterDetail',
    template: `
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
            <div class="el-table__header-wrapper">
                <table class="el-table__header">
                    <TableHeader :fields="showingFields" :headers="headers" :class="['absolute-position', 'hidden']" />
                    <TableHeader :fields="showingFields" :headers="headers"/>
                    <TableBody v-if="show" :rows="showingRows" />
               </table>
            </div>
        </div>
   `,
    components: { TableHeader, TableBody },
    props:  ['fieldId', 'showFields', 'headers'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
        }),
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows || [] },
        listOfShowFields() { return this.showFields ? this.showFields.split(',') : [] },
        showingFields() {
            return this.listOfShowFields.length ===  0 ?
                getFilteredView(this.field.RelatedFields || [], R.values(this.fields))
                : R.equals(this.fields, {}) ? {} : getSortedList(this.listOfShowFields, this.fields)
        },
        showingRows() {
            return this.listOfShowFields.length === 0 ?
                R.pipe(
                    R.map(R.values),
                    R.map(getFilteredView(this.field.RelatedFields || []))
                )(this.rows)
                : R.map(getSortedList(this.listOfShowFields), this.rows)
        },
        show() {
            return this.showingRows.length > 0
        }
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
        ]),
    },
    mounted () {
        this.MDLoadFields({ id: this.fieldId, listId: this.field.LookupList, masterLookupName: this.field.MasterLookupName })
    }
}

const getSortedList = R.curry((list, fields) => R.map(x => R.find(R.propEq('InternalName', x), R.values(fields)), list))

const getFilteredView = R.curry((filterList, fields) => R.filter(field => filterList.includes(field.InternalName), fields))

