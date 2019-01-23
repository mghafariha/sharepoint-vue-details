import R from 'ramda'
import moment from 'moment-jalaali'

export default {
    template: `
        <tbody>
            <tr v-for='(row, r) in rows' :key='r' class="el-table__row">
                <td class="radif"><div>{{ r+1 }}</div></td>
                <td v-for='(f, idx) in row' :class="f.Type" :key='"td"+r+idx'>
                    <div v-if="f.Type === 'DateTime'">
                        {{ fixDate(f.value) }}
                    </div>
                    <div v-else-if="f.Type === 'Boolean'">
                        <el-checkbox disabled value="f.value"></el-checkbox>
                    </div>
                    <div v-else>{{ f.value }}</div>
                </td>
            </tr>
        </tbody>
    `,
    props: ['rows'],
    methods:{
        fixDate: date => {
            let value = R.pipe(
                R.split(' '),
                R.head,
                R.split('/'),
                ([m, d, y]) => [y, m, d],
                R.join('/')
            )(date)
            return moment(value, 'YYYY/MM/DD').format('jYYYY-jMM-jDD')

        }
    }
}
