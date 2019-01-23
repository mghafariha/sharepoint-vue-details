// @flow
import PageContent from './PageContent'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    name: 'app',
    components: { PageContent },
    render () {
        return (
            <div id='app' dir='rtl' class="display-form">
                <PageContent loading={this.loading}/>
            </div>
        )
    },
    computed: {
        ...mapGetters({
            isError: 'isError',
            error: 'firstError'
        }),
        ...mapState({
            loading: s => s.loading
        })
    },
    methods: {
        ...mapActions(['loadFields', 'removeError', 'loadTemplateMetaData'])
    },
    watch: {
        isError: function (isError) {
            if (isError) {
                this.$message.error({
                    message: `An error occured: ${this.error}`,
                    duration: 5000,
                    showClose: true,
                    onClose: () => this.removeError(this.error)
                })
            }
        }
    },
    async mounted () {
        this.loadFields()
        await setTimeout(() => this.loadTemplateMetaData(), 500)

    }
}
