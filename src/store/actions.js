// @flow
import R from 'ramda'
import { getFieldsList, getItems, getFilteredItems, getItemMaster, getItemDetail, getTemplate, approveComment, rejectComment, canApprove, getListData } from '../api'

// [{Guid: 1}, ...] -> {1: {}, ...}
export const transformFieldsList = R.pipe(
    R.groupBy(f => f.Guid),
    R.map(R.head)
)

// {DefaultValue: 1} -> {DefaultValue: 1, value: 1}
const assignValue = R.pipe(
    R.juxt([f => f.DefaultValue, R.identity]),
    x => R.assoc('value', ...x)
)

const addToSelect = (res, { InternalName }) => {
    return res + InternalName + ','
}

const constructSelect = R.pipe(
    R.reject(R.propEq('Type', 'MasterDetail')),
    R.values,
    R.reduce(addToSelect, ''),
    R.slice(0, -1) // Remove last comma :grin
)

function setListData ({ commit, state }) {
    return getListData(state.listId)
        .fork(
            err  => commit('addError', err),
            listData => commit('setListData', listData)
        )
}

export function loadFields ({ commit, state, getters }) {
    return getFieldsList(state.listId, state.itemId, state.contentTypeId)
        .fork(
            err => commit('addError', err),
            res => {
                let fields = R.pipe(
                    R.prop('fields'),
                    R.map(assignValue),
                    transformFieldsList
                )(res)
                commit('loadFields', fields)
                if (!getters.isThereDetails) {
                    setTimeout(() => commit('setLoadingFalse'), 1000)
                }

                const select = constructSelect(fields)
                showFieldsList({ commit, state }, { select })

                let approveFields = R.pipe(
                    R.prop('approveFields'),
                    R.map(assignValue),
                    transformFieldsList
                )(res)

                commit('loadApproveFields', approveFields)
                commit('loadHistories', res.histories)

                let canApprove = R.prop('canApprove', res)
                commit('loadApproveRejectAccess', canApprove > 0)

                setListData({ commit, state })
            }
        )
}

export function loadFilteredOptions({ commit }, { id, listId, query }) {
    if (!query.includes('null')) {
        return getFilteredItems(listId, query)
            .fork(
                err     => commit('addError', err),
                options => commit('loadApproveOptions', { id, options })
            )
    }
}

export function loadApproveOptions({ commit }, { id, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('loadApproveOptions', { id, options })
        )
}

export function changeApproveField({ commit }, payload) {
    commit('changeApproveField', payload)
}

export function MDLoadFields ({ commit, state }, { id, listId, masterLookupName } ) {
    return getFieldsList(listId, '', state.dContentTypeId)
        .map(R.map(assignValue))
        .map(transformFieldsList)
        .fork(
            err => commit('addError', err),
            fields => {
                commit('MDLoadFields', { id, fields })
                const select = constructSelect(fields)
                showDetailFieldsList({ commit, state }, { id, listId, select, masterLookupName })
            }
        )
}

export function MDSetFieldRow ({ commit }, payload) {
    commit('MDChangeFieldRow', payload)
}

export function MDLoadOptions ({ commit }, { id, masterId, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('MDLoadOptions', { id, masterId, options })
        )
}

export function MDAddRow ({ commit }, { id }) {
    commit('MDAddRow', { id })
}

export function removeError ({ commit }, error) {
    commit('removeError', error)
}

export function showFieldsList ({ commit, state }, { select }) {
    let { listId, itemId } = state
    return getItemMaster(listId, itemId, select)
        .map(x => JSON.parse(x))
        .map(R.head)
        .fork(
            err     => commit('addError', err),
            items   => {
                commit('showFieldsList', items)
            }
        )
}

function showDetailFieldsList ({ commit, state }, { id, listId, select, masterLookupName }) {
    let { itemId } = state
    return getItemDetail(listId, masterLookupName, itemId, select)
        .map(x => JSON.parse(x))
        .fork(
            err     => commit('addError', err),
            items   => {
                commit('showDetailFieldsList', { id, items })
                commit('setLoadingFalse')
            }
        )
}

export function loadTemplateMetaData({ commit, state }) {
    return getTemplate(state.listId)
        .map(R.head)
        .fork(
            err  => commit('loadTemplateMetaData', { templateName: 'SimpleColumn', columnsNum: 2, template: '' + err }),
            succ => {
                let fields = transformFields(state.fields)
                let firstTemplate = replaceTemplateStr(succ.template || '', fields)
                let template = firstTemplate.replace(
                    new RegExp(/{{(\w+)(:[^}:]+)(:\[.*\])}}/, 'g'),
                    (s, fname, shFields, headers) => {
                        let showFields = shFields.substr(1).split(',')
                        let headersArr = headers.substr(1)
                        let field = fields[fname]
                        return `<el-form label-position="top">
                                    <el-form-item>
                                        <div class='detail-title'>${field.title}</div>
                                            <Field fieldId='${field.id}' class="${fname}" showFields="${showFields}" headers='${headersArr}'></Field>
                                            <div class='detail-item'>
                                        </div>
                                    </el-form-item>
                                </el-form>`
                    }
                )
                commit('loadTemplateMetaData', {
                    templateName: succ.templateName || 'SimpleColumn',
                    columnsNum: succ.columnsNum || 2,
                    template
                })
            }
        )
}

const transformFields= R.pipe(
    R.values,
    R.reduce((acc, curr) => ({
        ...acc,
        [curr.InternalName]: {
            'id': curr.Guid,
            'title': curr.Title,
            'intName': curr.InternalName,
            'isRequire': curr.IsRequire
        }
    }), {})
)

const replaceTemplateStr = (str, fields) => R.reduce(
    (q, field) => R.replace(
        new RegExp('{{'+field+'}}', 'g'),
        `<el-form label-position="top" class="master-field">
            <el-form-item :class="{'require': ${fields[field].isRequire}}">
                <div class='master-title'>${fields[field].title}</div>
                <div class='master-item'>
                    <Field fieldId="${fields[field].id}" class="${field}" ></Field>
                </div>
            </el-form-item>
        </el-form>`,
        q),
    str,
    R.keys(fields)
)

const transFormFields= R.pipe(
    R.values,
    R.project(['InternalName', 'Type', 'value', 'rows', 'LookupList']),
    R.map(R.map(f => f == null ? '' : f)), // remove null values
    R.map(f => f.rows == '' ? R.assoc('rows', [], f) : f), // replace rows null value with empty array
    R.map(f => (f.InternalName == 'ID' && f.value == '') ? R.assoc('value', 0, f) : f), // replace ID of null with 0 value
    R.reject(R.propEq('value', ''))
)

const transFormRows = R.map(
    R.ifElse(
        R.propEq('Type', 'MasterDetail'),
        field => R.assoc('rows', R.values(R.map(transFormFields, field.rows)), field),
        R.identity
    )
)

const transFormForSave = R.pipe(
        transFormFields,
        transFormRows
)

export function approveForm({ commit, state }, comment){
    let data = transFormForSave(state.approveFields)
    return new Promise((resolve, reject) => {
        approveComment(state.itemId, comment, state.listId, data, R.values(state.addFiles))
            .fork(
                err  => reject(err),
                succ => resolve(succ)
            )
    })
}

export function rejectForm({ commit, state }, comment){
    return new Promise ((resolve, reject) => {
        rejectComment(state.itemId, comment, state.listId)
            .fork(
                err  => reject(err),
                succ => resolve(succ)
            )
    })
}

export function loadApproveRejectAccess({ commit, state }){
    return canApprove(state.itemId, state.listId)
        .fork(
            err  => commit('addError', err),
            succ => commit('loadApproveRejectAccess', succ > 0) // if succ == 1 has access
        )
}

export function removeServerError({ commit }, { row, internalName }){
    commit('removeServerError', { row, internalName })
}

export function loadServerErrors({ commit }, errors){
    errors = R.chain(transformError, errors)
    commit('loadServerErrors', errors)
}

const transformError = ({ Message, RowNumber, FieldNames }) => {
    return R.map(field => {
        return {
            Message,
            RowNumber,
            InternalName: field,
            RelatedFields: FieldNames
        }
    }, FieldNames)
}

export function addError({ commit }, err) {
    commit('addError', err)
}

export function addToAddFiles({ commit }, payload ){
    commit('addToAddFiles', payload)
}

export function removeFromAddFiles({ commit }, id ){
    commit('removeFromAddFiles', id)
}
