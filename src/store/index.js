// @flow
import Vue from 'vue'
import Vuex from 'vuex'
import R from 'ramda'

import * as actions from './actions'

Vue.use(Vuex)

/*::
type StoreType = {}
*/

const urlParam = name => {
    let url = window.location.href
    name = name.replace(/[\[\]]/g, '\\$&')
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null
    if (!results[2]) return ''
    return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

const store = new Vuex.Store({
    state: ({
        loading: true,
        listId: urlParam('List'),
        itemId: urlParam('ID'),
        contentTypeId: urlParam('ContentTypeId') || '',
        dContentTypeId: urlParam('dContentTypeId') || '',
        listData: { Title: '' },
        fields: {},
        addFiles: {},
        histories: [],
        errors: [],
        templateName: 'Loading',
        columnsNum: 2,
        templateStr: '',
        approveRejectAccess: false,
        approveFields: {},
        serverErrors: []
    }: StoreType),
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0],
        filteredFields: s => R.pipe(
            R.reject(R.propEq('InternalName', 'ID')),
        )(s.fields),
        filteredApproveFields: s => R.pipe(
            R.reject(R.propEq('InternalName', 'ID')),
        )(s.approveFields),
        isThereDetails: s => R.pipe(R.values,
                                    R.filter(R.propEq('Type', 'MasterDetail')),
                                    R.isEmpty,
                                    R.not)(s.fields)
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
        },
        loadApproveFields (state, fields) {
            state.approveFields = fields
        },
        setListData (state, listData){
            state.listData = listData
        },
        loadApproveOptions (state, { id, options }) {
            state.approveFields[id] = { ...state.approveFields[id], options }
        },
        setField (state, { id, value }) {
            state.fields = R.assocPath([id, 'value'], value, state.fields)
        },
        changeApproveField (state, { id, value }) {
            state.approveFields = R.assocPath([id, 'value'], value, state.approveFields)
        },
        showFieldsList(state, items){
            let fieldValues = R.values(R.mapObjIndexed(shapeData, items))
            R.map(({ InternalName, value }) => {
                let id = getFieldId(InternalName, state.fields)
                let Type = state.fields[id].Type
                value = Type != 'File' ? R.last(value.split(';#')) : R.head(value.split(';#'))
                value = isNaN(value) || value == '' ? value : Number(value)
                if (value == 'True') value = true
                id ? state.fields = R.assocPath([id, 'value'], value, state.fields) : null
            }, fieldValues)
        },
        MDLoadFields (state, { id, fields }) {
            state.fields[id] = { ...state.fields[id], fields }
            state.fields[id] = { ...state.fields[id], rows: [] }
            state.fields[id] = { ...state.fields[id], options: {} }
        },
        showDetailFieldsList(state, { id, items }){
            items.forEach(item => {
                let fields = { ...state.fields[id].fields }
                let fieldValues = R.values(R.mapObjIndexed(shapeData, item))
                fieldValues.forEach(({ InternalName, value }) => {
                    let fieldId = getFieldId(InternalName, fields)
                    let fieldType = fields[fieldId]['Type']
                    if (fieldType == 'LookupMulti') {
                        value = R.pipe(
                            R.filter(x => !Number(x)),
                            R.join(', ')
                        )(value.split(';#'))
                    } else {
                        value = R.last(value.split(';#'))
                        value = isNaN(value) || value == '' ? value : Number(value)
                    }
                    if (value == 'True') value = true
                    if (fieldId && (value == 0 || value)) {
                        fields =  R.assocPath([fieldId, 'value'], value, fields)
                    }
                })
                state.fields[id].rows.push(fields)
            })
        },
        MDAddRow (state, { id }) {
            let fields = state.fields[id].fields
            state.fields[id].rows.push(fields)
        },
        MDLoadOptions (state, { id, masterId, options }) {
            state.fields[masterId].options[id] = options
        },
        addError (state, error) {
            state.errors.push(error)
        },
        removeError (state, error) {
            state.errors = R.reject(R.equals(error), state.errors)
        },
        loadTemplateMetaData(state, { templateName, columnsNum, template }){
            state.templateName = templateName
            state.templateStr = template
            state.columnsNum = columnsNum
        },
        loadApproveRejectAccess(state, access){
            state.approveRejectAccess = access
        },
        removeServerError(state, { row, internalName }){
            let relatedFields = R.pipe(
                R.filter(
                    R.where({
                        RowNumber: R.equals(row),
                        InternalName: R.equals(internalName)
                    })),
                R.head,
                R.prop('RelatedFields')
            )(state.serverErrors)

            state.serverErrors = R.reduce(
                (errors, fieldName) => R.reject(
                    R.where({
                        RowNumber: R.equals(row),
                        InternalName: R.equals(fieldName)
                    }),
                    errors
                ),
                state.serverErrors,
                relatedFields
            )
        },
        loadServerErrors(state, errors){
            state.serverErrors = errors
        },
        setLoadingFalse(state){
            state.loading = false
        },
        loadHistories(state, histories){
            state.histories = histories
        },
        addToAddFiles(state, { id, attachment }){
            state.addFiles = R.assoc(id, attachment, state.addFiles)
        },
        removeFromAddFiles(state, id){
            state.addFiles = R.dissoc(id, state.addFiles)
        }
    },
    actions
})

export default store

const getFieldId = (InternalName, fields) => R.pipe( //find the key of first item with this internalName
    R.filter(R.propEq('InternalName', InternalName)),
    R.keys,
    R.head
)(fields)

const shapeData = (value, InternalName) => { // key in the comming items is the InternalName of Field
    return typeof value == 'object' ? { InternalName, value: value ? value.Title : '' } : { InternalName, value }
}
