import { getApiF, postApiF, path } from './utils'
import { TEMPLATE_LIST_ID } from '../constants'

export const getEntityTypeName = listId => getApiF(
    `/_api/lists(guid'${listId}')/listItemEntityTypeFullName`
).chain(path(r => r.ListItemEntityTypeFullName))

export const getFieldsList = (listId, itemId, contentTypeId) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetFieldsList',
    { listId, itemId, formType: 'Display', contentTypeId }
)

export const getListData = listId => getApiF(
    `/_api/web/lists(guid'${listId}')`
)

export const addItem = (listId, item) => postApiF(
    `/_api/web/lists(guid'${listId}')/items`,
    item
)
export const getItems = listId => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$filter=FSObjType eq 0`
).chain(path(r => r.results))

export const getFilteredItems = (listId, query) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$filter=${query} and FSObjType eq 0`
).chain(path(r => r.results))

export const getItemById = (listId, itemId) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$select=Id eq ${itemId}`
).chain(path(r => r.results))

export const getItemMaster = (listId, itemNumber, select) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetData',
    { listId, fieldName: 'ID', value: Number(itemNumber), select }
)

export const getItemDetail = (listId, fieldName, itemNumber, select) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetData',
    { listId, fieldName, value: Number(itemNumber), select }
)

export const getTemplate = title => getApiF(
    `/_api/web/lists(guid'${TEMPLATE_LIST_ID}')/items?$filter=Title eq '${title}' and formType eq 'Display'`
).chain(path(r => r.results))

export const approveComment = (itemId, comment, listId, fields, addFiles) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/Approve',
    { itemId, comment, listId, fields, addFiles }
)

export const rejectComment = (itemId, comment, listId) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/Reject',
    { itemId, comment, listId }
)

export const canApprove = (itemId, listId) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/canApprove',
    { itemId, listId }
)

export const loadUploadedFile = (listId, itemId) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$select=EncodedAbsUrl,Title&$filter=Id eq ${itemId}`
).chain(path(r => r.results))
