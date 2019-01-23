// @flow
import { mapState } from 'vuex'
import PageTemplate from '../templates'
import ApproveReject from './ApproveReject/approveComponents'
import TitleHeader from './TitleHeader'
import Histories from './Histories'

export default {
    template: `
     <div>
        <el-row type='flex' justify='center' v-loading='loading'>
            <el-col :span='24'>
                <TitleHeader :title="listTitle"/>
                <PageTemplate class="border"/>
            </el-col>
        </el-row>
        <ApproveReject v-show='!loading' class="footer"/>
        <el-row v-show='!loading' type='flex' justify="center">
            <el-col :xs="24" :sm="20" :md="18" :lg="18" :xl="16" class="centeralize">
                <div>مشاهده سوابق</div>
                <Histories class="footer"/>
            </el-col>
        </el-row>
    </div>
    `,
    props: {
        loading: Boolean
    },
    components: { PageTemplate, ApproveReject, TitleHeader, Histories },
    computed: {
        ...mapState({
            listTitle: s => s.listData.Title
        })
    }
}
