// @flow
import Field from '../components/Field'
import { mapGetters } from 'vuex'

export default {
    template: `
        <el-row justify="end" :gutter="10">
            <el-form label-position="top">
                <el-col v-for='(f, id) in fields' :key='id' :span="f.Type == 'MasterDetail' ? 24 : 12">
                    <el-form-item :key='id' :class="[{master: f.Type != 'MasterDetail'}, f.Type]" :label='f.Type == "MasterDetail" ? null : f.Title' :prop='id'>
                        <Field :fieldId='id' ref='fields'/>
                    </el-form-item>
                </el-col'>
            </el-form>
        </el-row>
    `,
    components: { Field },
    computed: {
        ...mapGetters({
            fields: 'filteredFields'
        })
    }
}
