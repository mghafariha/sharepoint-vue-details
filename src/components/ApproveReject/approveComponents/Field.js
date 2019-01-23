// @flow
import { mapState } from 'vuex'


import BooleanField from './Boolean'
import ChoiceField from './Choice'
import ComputedText from './ComputedText'
import CustomComputedField from './CustomComputed'
import CustomSelectField from './CustomSelect'
import DateTimeField from './DateTime'
import MasterDetail from './MasterDetail'
import MultiChoiceField from './MultiChoice'
import MultiSelectField from './MultiSelect'
import NumberField from './Number'
import SelectField from './Select'
import TextAreaField from './TextArea'
import TextField from './Text'
import TimeField from './TimePicker'
import UploadField from './Upload'

export default {
    components: { TextField, TextAreaField, NumberField, BooleanField, SelectField, CustomSelectField, DateTimeField, MasterDetail, ChoiceField, MultiChoiceField, UploadField, ComputedText, TimeField },
    props: ['fieldId', 'showFields'],
    render () {
        switch (this.fieldType) {
        case 'Text':
            return <TextField fieldId={this.fieldId} onChange={this.change}></TextField>
        case 'Number':
            return <NumberField fieldId={this.fieldId} onChange={this.change}></NumberField>
        case 'Boolean':
            return <BooleanField fieldId={this.fieldId} onChange={this.change}></BooleanField>
        case 'Lookup':
            return <SelectField fieldId={this.fieldId} onChange={this.change}></SelectField>
        case 'LookupMulti':
            return <MultiSelectField fieldId={this.fieldId} onChange={this.change}></MultiSelectField>
        case 'DateTime':
            return <DateTimeField fieldId={this.fieldId} onChange={this.change}></DateTimeField>
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField fieldId={this.fieldId} multiple={false} onChange={this.change}></CustomSelectField>
        case 'MasterDetail':
            return <MasterDetail fieldId={this.fieldId} onChange={this.change} showFields={this.showFields}></MasterDetail>
        case 'Choice':
            return <ChoiceField fieldId={this.fieldId} onChange={this.change}></ChoiceField>
        case 'MultiChoice':
            return <MultiChoiceField fieldId={this.fieldId} onChange={this.change}></MultiChoiceField>
        case 'Note':
            return <TextAreaField fieldId={this.fieldId} onChange={this.change}></TextAreaField>
        case 'CustomComputedField':
            return <CustomComputedField fieldId={this.fieldId} />
        case 'File':
            return <UploadField fieldId={this.fieldId} />
        case 'ComputedText':
            return <ComputedText fieldId={this.fieldId} />
        case 'Time':
            return <TimeField fieldId={this.fieldId} onChange={this.change}/>
        default:
            return <div>Unexpected Type: {this.fieldType}</div>
        }
    },
    computed: {
        ...mapState({
            fieldType (state) {
                let field = state.approveFields[this.fieldId]
                let Type = field.Type
                if (Type == 'Text' && field.DefaultValue != null ){ //TODO needs checking for {{}} sign
                    return 'ComputedText'
                }
                if (Type == 'Text' && field.MaxLength == 254){
                    return 'Time'
                }
                return Type
            }
        })
    },
    methods: {
        change (value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
