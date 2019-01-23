// @flow
import { mapState } from 'vuex'
import { loadUploadedFile } from '../api'
import R from 'ramda'

export default {
    template: `
        <div>
            <a :href="file.url">{{file.name}}</a>
        </div>
    `,
    props: ['fieldId'],
    data(){
        return {
            file: { name: '', url: null },
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value },
        lookupList() { return this.field.LookupList }
    },
    watch: {
        value: {
            handler: function (value){
                loadUploadedFile(this.lookupList, value)
                    .map(R.head)
                    .fork(
                        ()   => {},
                        succ => {
                            this.file= { name: succ.Title, url: succ.EncodedAbsUrl }
                        }
                    )
            }
        }
    }
}
