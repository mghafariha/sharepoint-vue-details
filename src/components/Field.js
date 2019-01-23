// @flow
import { mapState } from 'vuex'

import BooleanField from '../components/Boolean'
import DateTimeField from '../components/DateTime'
import MasterDetail from '../components/MasterDetail'
import SimpleField from '../components/Simple'
import UploadField from '../components/Upload'

export default {
    components: { SimpleField, MasterDetail, BooleanField, DateTimeField, UploadField },
    props: ['fieldId', 'showFields', 'headers'],
    render () {
        switch (this.fieldType) {
        case 'Text':
        case 'Number':
        case 'Note':
        case 'Lookup':
        case 'Choice':
        case 'RelatedCustomLookupQuery':
        case 'LookupMulti':
        case 'MultiChoice':
        case 'CustomComputedField':
            return <SimpleField fieldId={this.fieldId}></SimpleField>
        case 'Boolean':
            return <BooleanField fieldId={this.fieldId}></BooleanField>
        case 'DateTime':
            return <DateTimeField fieldId={this.fieldId}></DateTimeField>
        case 'MasterDetail':
            return <MasterDetail fieldId={this.fieldId} showFields={this.showFields} headers={this.headers}></MasterDetail>
        case 'File':
            return <UploadField fieldId={this.fieldId} />
        default:
            return <div>Unexpected Type: {this.fieldType}</div>
        }
    },
    computed: {
        ...mapState({
            fieldType (state) { return state.fields[this.fieldId].Type }
        })
    }
}
