import { mapState } from 'vuex'
import TwoColumn from './TwoColumn'
import SimpleColumn from './SimpleColumn'
import TwoSide from './TwoSide'
import Custom from './Custom'
import Loading from './Loading'


export default {
    components: { TwoColumn, Custom, Loading, SimpleColumn, TwoSide },
    template: `
        <component :is="templateName" :columnsNum="columnsNum"/>
    `,
    computed: {
        ...mapState(['templateName', 'columnsNum'])
    }
}
